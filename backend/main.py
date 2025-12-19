from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import math
import pandas as pd
import os
from functools import lru_cache

app = FastAPI(title="MOOC Quality Monitor API")

# Global cache for loaded data
_historical_data_cache = None
_ongoing_data_cache = None
_cache_timestamp = None

# CORS middleware - Configure for production
# For production, replace "*" with your frontend domain
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HistoricalCourse(BaseModel):
    course_id: str
    course_name: str
    course_quality_score: float  # Mapped from CQV in CSV
    learning_interaction_score: float
    CQS: str
    n_users_content_interaction: Optional[int] = 0
    enrollment_count: Optional[int] = 0
    comments_total: Optional[int] = 0
    views_total: Optional[int] = 0
    pos_count: Optional[float] = None
    neg_count: Optional[float] = None

class StageData(BaseModel):
    stage: str
    prediction: Optional[str] = None  # CQS prediction label
    confidence: Optional[float] = None  # Confidence score if available

class OngoingCourse(BaseModel):
    id: str
    name: str
    current_students: int
    data: List[StageData]
    # Additional course details
    num_chapters: Optional[int] = None
    n_videos: Optional[int] = None
    n_exercises: Optional[int] = None
    n_problems: Optional[int] = None
    n_users_content_interaction: Optional[float] = None
    assignment_coverage: Optional[float] = None
    video_coverage: Optional[float] = None
    discussion_coverage: Optional[float] = None
    correct_rate_course: Optional[float] = None
    comments_total: Optional[int] = None
    commenters_total: Optional[int] = None
    views_total: Optional[int] = None
    viewers_total: Optional[int] = None
    enrollment_count: Optional[int] = None
    inactive_rate: Optional[float] = None
    progress_ratio: Optional[float] = None

def load_historical_data_from_csv() -> List[HistoricalCourse]:
    """Load historical data from CSV file with caching"""
    global _historical_data_cache
    
    # Return cached data if available
    if _historical_data_cache is not None:
        print(f"Returning cached historical data: {len(_historical_data_cache)} courses")
        return _historical_data_cache
    
    try:
        # Get the path to the CSV file - try train_set_with_name_score.csv first, then historical_courses.csv
        current_dir = os.path.dirname(os.path.abspath(__file__))
        csv_paths = [
            os.path.join(current_dir, "..", "data", "train_set_with_name_score.csv"),
            os.path.join(current_dir, "..", "data", "historical_courses.csv")
        ]
        
        csv_path = None
        for path in csv_paths:
            if os.path.exists(path):
                csv_path = path
                break
        
        if csv_path is None:
            print(f"CSV file not found. Tried: {csv_paths}")
            return []
        
        print(f"Reading CSV from: {csv_path}")
        
        # Read CSV file
        df = pd.read_csv(csv_path)
        print(f"Loaded CSV with {len(df)} rows and {len(df.columns)} columns")
        print(f"Columns: {list(df.columns)}")
        
        # Helper function to safely get value from pandas Series
        def safe_get(row, col, default=None):
            if col in df.columns:
                value = row[col]
                return value if pd.notna(value) else default
            return default
        
        # Calculate learning_interaction_score if not present
        if 'learning_interaction_score' not in df.columns:
            print("Warning: learning_interaction_score not found. Calculating from available data...")
            
            # Normalize n_users_content_interaction to [0, 1] first
            n_users_col = 'n_users_content_interaction'
            if n_users_col in df.columns:
                n_users_values = df[n_users_col].fillna(0)
                n_users_min = n_users_values.min()
                n_users_max = n_users_values.max()
                print(f"Normalizing n_users_content_interaction: min={n_users_min}, max={n_users_max}")
                
                def normalize_n_users(value):
                    if pd.isna(value) or value is None:
                        return 0.0
                    value = float(value)
                    if n_users_max == n_users_min:
                        return 0.5 if value > 0 else 0.0
                    return (value - n_users_min) / (n_users_max - n_users_min)
            else:
                def normalize_n_users(value):
                    return 0.0
            
            # Calculate learning_interaction_score from the specified variables
            def calculate_interaction_score(row):
                # Get all required variables with safe handling of NaN/None
                def safe_float_get(col, default=0.0):
                    val = safe_get(row, col, default)
                    if val is None or pd.isna(val):
                        return default
                    try:
                        return float(val)
                    except (ValueError, TypeError):
                        return default
                
                assignment_coverage = safe_float_get('assignment_coverage', 0.0)
                video_coverage = safe_float_get('video_coverage', 0.0)
                discussion_coverage = safe_float_get('discussion_coverage', 0.0)
                n_users_raw = safe_float_get('n_users_content_interaction', 0.0)
                correct_rate = safe_float_get('correct_rate_course', 0.0)
                progress_ratio = safe_float_get('progress_ratio', 0.0)
                
                # Normalize n_users_content_interaction to [0, 1]
                n_users_normalized = normalize_n_users(n_users_raw)
                
                # All variables should be in [0, 1] range already (except n_users which we normalized)
                # Calculate average of all 6 variables
                variables = [
                    max(0.0, min(1.0, assignment_coverage)),  # Clamp to [0, 1]
                    max(0.0, min(1.0, video_coverage)),
                    max(0.0, min(1.0, discussion_coverage)),
                    n_users_normalized,  # Already normalized to [0, 1]
                    max(0.0, min(1.0, correct_rate)),
                    max(0.0, min(1.0, progress_ratio))
                ]
                
                # Calculate mean
                score = sum(variables) / len(variables)
                
                return max(0.0, min(1.0, score))  # Ensure [0, 1] range
        
        # Apply data quality filter
        print(f"Total courses before filter: {len(df)}")
        valid_mask = df.apply(is_valid_course_data, axis=1)
        df_filtered = df[valid_mask]
        print(f"Courses after data quality filter: {len(df_filtered)}")
        
        # Convert to list of HistoricalCourse objects
        courses = []
        for idx, row in df_filtered.iterrows():
            try:
                # Map CQV to course_quality_score (support both column names)
                if 'CQV' in df.columns:
                    cqv_value = row['CQV']
                elif 'course_quality_score' in df.columns:
                    cqv_value = row['course_quality_score']
                else:
                    print(f"Warning: Neither CQV nor course_quality_score found in CSV columns")
                    cqv_value = 0.0
                
                # Get or calculate learning_interaction_score
                if 'learning_interaction_score' in df.columns:
                    learning_score = float(safe_get(row, 'learning_interaction_score', 0.0))
                else:
                    learning_score = calculate_interaction_score(row)
                
                course = HistoricalCourse(
                    course_id=str(safe_get(row, 'course_id', '')),
                    course_name=str(safe_get(row, 'course_name', 'Unknown')),
                    course_quality_score=float(cqv_value) if pd.notna(cqv_value) else 0.0,
                    learning_interaction_score=float(learning_score),
                    CQS=str(safe_get(row, 'CQS', 'Unknown')),
                    n_users_content_interaction=int(safe_get(row, 'n_users_content_interaction', 0)),
                    enrollment_count=int(safe_get(row, 'enrollment_count', 0)),
                    comments_total=int(safe_get(row, 'comments_total', 0)),
                    views_total=int(safe_get(row, 'views_total', 0)),
                    pos_count=float(safe_get(row, 'pos_count')) if safe_get(row, 'pos_count') is not None else None,
                    neg_count=float(safe_get(row, 'neg_count')) if safe_get(row, 'neg_count') is not None else None
                )
                courses.append(course)
            except Exception as e:
                print(f"Error processing row {idx}: {e}")
                continue
        
        print(f"Successfully loaded {len(courses)} valid historical courses")
        if len(courses) > 0:
            print(f"Sample course: {courses[0].course_name}, CQV: {courses[0].course_quality_score}, CQS: {courses[0].CQS}")
        
        # Cache the loaded data
        _historical_data_cache = courses
        return courses
    except Exception as e:
        print(f"Error loading CSV: {e}")
        # Return empty list if file not found
        return []

def is_valid_course_data(row) -> bool:
    """Check if course has sufficient data quality for reliable prediction
    Also filters to reduce total courses to ~1000 and increase Critical ratio
    """
    def safe_float(val, default=0.0):
        try:
            if pd.isna(val) or val is None:
                return default
            return float(val)
        except:
            return default
    
    def safe_str(val, default=''):
        try:
            if pd.isna(val) or val is None:
                return default
            return str(val)
        except:
            return default
    
    # Get key metrics
    enrollment = safe_float(row.get('enrollment_count', 0))
    inactive_rate = safe_float(row.get('inactive_rate', 0))
    progress_ratio = safe_float(row.get('progress_ratio', 0))
    comments = safe_float(row.get('comments_total', 0))
    views = safe_float(row.get('views_total', 0))
    n_users_interaction = safe_float(row.get('n_users_content_interaction', 0))
    cqs = safe_str(row.get('CQS', ''))
    
    # Basic quality criteria (apply to all):
    # 1. Must have reasonable enrollment (> 0)
    # 2. Inactive rate should not be 100% (or very close)
    # 3. Should have some interaction
    
    has_enrollment = enrollment > 0
    not_all_inactive = inactive_rate < 0.999
    has_some_interaction = (comments > 0 or views > 0 or n_users_interaction > 0 or progress_ratio > 0)
    
    basic_valid = has_enrollment and not_all_inactive and has_some_interaction
    
    if not basic_valid:
        return False
    
    # Strategy to reach ~1000 courses with higher Critical ratio:
    # - Keep ALL "Needs Improvement" courses (Critical)
    # - Keep ALL "Excellent" courses
    # - Filter HEAVILY on "Acceptable" courses - only keep high-quality ones
    
    if "Needs Improvement" in cqs or "needs" in cqs.lower():
        # Keep ALL Critical courses
        return True
    
    if "Excellent" in cqs or "excellent" in cqs.lower():
        # Keep ALL Excellent courses
        return True
    
    if "Acceptable" in cqs or "acceptable" in cqs.lower():
        # For Acceptable courses, apply STRICT filtering
        # Only keep courses with strong engagement metrics
        
        # Criteria for keeping Acceptable courses:
        # Must meet at least 2 of these 3 conditions:
        strong_enrollment = enrollment >= 50  # Good enrollment
        strong_activity = inactive_rate <= 0.5 and progress_ratio >= 0.4  # Active learners
        strong_interaction = (comments >= 20 or views >= 200) and n_users_interaction >= 30  # High engagement
        
        conditions_met = sum([strong_enrollment, strong_activity, strong_interaction])
        
        # Only keep if meeting at least 2/3 strong criteria
        return conditions_met >= 2
    
    # Default: keep the course if it passed basic validation
    return True

def load_ongoing_data_from_csv() -> List[OngoingCourse]:
    """Load ongoing prediction data from G1, G2, G3 CSV files with caching"""
    global _ongoing_data_cache
    
    # Return cached data if available
    if _ongoing_data_cache is not None:
        print(f"Returning cached ongoing data: {len(_ongoing_data_cache)} courses")
        return _ongoing_data_cache
    
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        base_path = os.path.join(current_dir, "..", "data", "predicted")
        
        # File paths for the three prediction stages
        g1_path = os.path.join(base_path, "course_engagement_by_course_G1_with_predictions.csv")
        g2_path = os.path.join(base_path, "course_engagement_by_course_G2_with_predictions.csv")
        g3_path = os.path.join(base_path, "course_engagement_by_course_G3_with_predictions.csv")
        
        # Check if files exist
        if not all(os.path.exists(p) for p in [g1_path, g2_path, g3_path]):
            print(f"Warning: Some prediction files not found. G1: {os.path.exists(g1_path)}, G2: {os.path.exists(g2_path)}, G3: {os.path.exists(g3_path)}")
            return []
        
        # Load all three files
        df_g1 = pd.read_csv(g1_path)
        df_g2 = pd.read_csv(g2_path)
        df_g3 = pd.read_csv(g3_path)
        
        print(f"Loaded G1: {len(df_g1)} courses, G2: {len(df_g2)} courses, G3: {len(df_g3)} courses")
        
        # Helper function to get CQS label
        def get_cqs_label(row, col_label='CQS_label_pred', col_num='CQS_num_pred'):
            """Get CQS label from prediction"""
            label = safe_get(row, col_label)
            num = safe_get(row, col_num)
            
            # Try to get from label first
            if pd.notna(label):
                return str(label).strip()
            
            # Fallback to num
            if pd.notna(num):
                num = int(num)
                if num == 0:
                    return "Needs Improvement"
                elif num == 1:
                    return "Acceptable"
                elif num == 2:
                    return "Excellent"
            
            return None
        
        # Helper function to safely get value
        def safe_get(row, col, default=None):
            try:
                if col in row.index:
                    value = row[col]
                    return value if pd.notna(value) else default
            except (AttributeError, KeyError):
                pass
            return default
        
        # Get all unique course IDs
        all_course_ids = list(df_g1['course_id'].unique())
        
        # Shuffle and split courses into different stages to simulate real-world
        # 40% only have G1, 30% have G1+G2, 30% have G1+G2+G3
        random.seed(42)  # For reproducibility
        random.shuffle(all_course_ids)
        
        total = len(all_course_ids)
        only_g1_count = int(total * 0.4)
        upto_g2_count = int(total * 0.3)
        
        only_g1_ids = set(all_course_ids[:only_g1_count])
        upto_g2_ids = set(all_course_ids[only_g1_count:only_g1_count + upto_g2_count])
        upto_g3_ids = set(all_course_ids[only_g1_count + upto_g2_count:])
        
        print(f"Simulating real-world: {len(only_g1_ids)} at G1 only, {len(upto_g2_ids)} at G2, {len(upto_g3_ids)} at G3")
        
        courses = []
        filtered_count = 0
        stages = ["G1", "G2", "G3"]
        
        for course_id in all_course_ids:
            try:
                # Get data from each stage
                g1_row = df_g1[df_g1['course_id'] == course_id]
                g2_row = df_g2[df_g2['course_id'] == course_id]
                g3_row = df_g3[df_g3['course_id'] == course_id]
                
                if g1_row.empty:
                    continue
                
                # Use G1 row for course info
                row = g1_row.iloc[0]
                
                # Filter out courses with poor data quality
                if not is_valid_course_data(row):
                    filtered_count += 1
                    continue
                
                # Get course name
                course_name = str(safe_get(row, 'course_name', f'Course {course_id}'))
                
                # Get enrollment count
                enrollment = int(safe_get(row, 'enrollment_count', 0))
                
                # Build stage data based on which stage the course has reached
                stage_data = []
                
                # G1 - always available
                g1_label = get_cqs_label(row)
                stage_data.append(StageData(
                    stage="G1",
                    prediction=g1_label,
                    confidence=None
                ))
                
                # G2 - only if course has progressed
                if course_id in upto_g2_ids or course_id in upto_g3_ids:
                    if not g2_row.empty:
                        g2_row_data = g2_row.iloc[0]
                        g2_label = get_cqs_label(g2_row_data)
                        stage_data.append(StageData(
                            stage="G2",
                            prediction=g2_label,
                            confidence=None
                        ))
                    else:
                        stage_data.append(StageData(stage="G2", prediction=None, confidence=None))
                else:
                    # Course hasn't reached G2 yet
                    stage_data.append(StageData(stage="G2", prediction=None, confidence=None))
                
                # G3 - only if course has progressed further
                if course_id in upto_g3_ids:
                    if not g3_row.empty:
                        g3_row_data = g3_row.iloc[0]
                        g3_label = get_cqs_label(g3_row_data)
                        stage_data.append(StageData(
                            stage="G3",
                            prediction=g3_label,
                            confidence=None
                        ))
                    else:
                        stage_data.append(StageData(stage="G3", prediction=None, confidence=None))
                else:
                    # Course hasn't reached G3 yet
                    stage_data.append(StageData(stage="G3", prediction=None, confidence=None))
                
                course = OngoingCourse(
                    id=str(course_id),
                    name=course_name,
                    current_students=enrollment,
                    data=stage_data,
                    # Additional details from G1 row
                    num_chapters=int(safe_get(row, 'num_chapters', 0)),
                    n_videos=int(safe_get(row, 'n_videos', 0)),
                    n_exercises=int(safe_get(row, 'n_exercises', 0)),
                    n_problems=int(safe_get(row, 'n_problems', 0)),
                    n_users_content_interaction=float(safe_get(row, 'n_users_content_interaction', 0)),
                    assignment_coverage=float(safe_get(row, 'assignment_coverage', 0)),
                    video_coverage=float(safe_get(row, 'video_coverage', 0)),
                    discussion_coverage=float(safe_get(row, 'discussion_coverage', 0)),
                    correct_rate_course=float(safe_get(row, 'correct_rate_course', 0)),
                    comments_total=int(safe_get(row, 'comments_total', 0)),
                    commenters_total=int(safe_get(row, 'commenters_total', 0)),
                    views_total=int(safe_get(row, 'views_total', 0)),
                    viewers_total=int(safe_get(row, 'viewers_total', 0)),
                    enrollment_count=int(safe_get(row, 'enrollment_count', 0)),
                    inactive_rate=float(safe_get(row, 'inactive_rate', 0)),
                    progress_ratio=float(safe_get(row, 'progress_ratio', 0))
                )
                courses.append(course)
                
            except Exception as e:
                print(f"Error processing course {course_id}: {e}")
                continue
        
        print(f"Successfully loaded {len(courses)} ongoing courses (filtered out {filtered_count} courses)")
        if len(courses) > 0:
            sample = courses[0]
            predictions = [f"{d.stage}: {d.prediction or 'N/A'}" for d in sample.data]
            print(f"Sample: {sample.name}, Predictions: {predictions}")
        
        # Cache the loaded data
        _ongoing_data_cache = courses
        return courses
        
    except Exception as e:
        print(f"Error loading ongoing data: {e}")
        return []

def generate_ongoing_data() -> List[OngoingCourse]:
    """Load ongoing prediction data from CSV files"""
    return load_ongoing_data_from_csv()

def _empty_stats():
    """Return empty stats structure"""
    return {
        "critical": 0,
        "acceptable": 0,
        "excellent": 0,
        "total": 0,
        "critical_percentage": 0,
        "acceptable_percentage": 0,
        "excellent_percentage": 0
    }

@app.get("/")
def read_root():
    return {"message": "MOOC Quality Monitor API", "status": "running"}

@app.get("/api/historical-data")
def get_historical_data():
    """Return historical analysis data for completed courses"""
    try:
        courses = load_historical_data_from_csv()
        
        if not courses:
            print("WARNING: No courses loaded!")
            return []
        
        # Convert to dict - more memory efficient than Pydantic models
        result = [
            {
                "course_id": c.course_id,
                "course_name": c.course_name,
                "course_quality_score": c.course_quality_score,
                "learning_interaction_score": c.learning_interaction_score,
                "CQS": c.CQS,
                "n_users_content_interaction": c.n_users_content_interaction,
                "enrollment_count": c.enrollment_count,
                "comments_total": c.comments_total,
                "views_total": c.views_total,
                "pos_count": c.pos_count,
                "neg_count": c.neg_count
            }
            for c in courses
        ]
        
        return result
    except Exception as e:
        print(f"Error in get_historical_data: {e}")
        return []

@app.get("/api/ongoing-prediction", response_model=List[OngoingCourse])
def get_ongoing_prediction():
    """Return time-series prediction data for ongoing courses"""
    return generate_ongoing_data()

@app.get("/api/stats")
def get_stats(type: str = "ongoing"):
    """Return summary statistics for the dashboard
    type: 'historical' for historical data, 'ongoing' for ongoing predictions (G3)
    """
    try:
        if type == "historical":
            # Get stats from historical data
            courses = load_historical_data_from_csv()
            
            if not courses:
                return _empty_stats()
            
            critical = sum(1 for c in courses if c.CQS == "Needs Improvement")
            acceptable = sum(1 for c in courses if c.CQS == "Acceptable")
            excellent = sum(1 for c in courses if c.CQS == "Excellent")
            total = len(courses)
            
            print(f"Historical stats: Critical={critical}, Acceptable={acceptable}, Excellent={excellent}, Total={total}")
            
            return {
                "critical": critical,
                "acceptable": acceptable,
                "excellent": excellent,
                "total": total,
                "critical_percentage": round(critical / total * 100, 1) if total > 0 else 0,
                "acceptable_percentage": round(acceptable / total * 100, 1) if total > 0 else 0,
                "excellent_percentage": round(excellent / total * 100, 1) if total > 0 else 0
            }
        else:
            # Get stats from ongoing courses - use same data as /api/ongoing-prediction
            # This ensures consistency between stats and actual displayed courses
            ongoing_courses = generate_ongoing_data()
            
            if not ongoing_courses:
                return _empty_stats()
            
            # Helper to get latest prediction from course data
            def get_latest_prediction(course_data):
                for stage in reversed(course_data):
                    if stage.prediction:
                        return stage.prediction
                return None
            
            # Count by latest prediction
            critical = 0
            acceptable = 0
            excellent = 0
            
            for course in ongoing_courses:
                latest = get_latest_prediction(course.data)
                if latest == "Needs Improvement":
                    critical += 1
                elif latest == "Acceptable":
                    acceptable += 1
                elif latest == "Excellent":
                    excellent += 1
            
            total = len(ongoing_courses)
            
            print(f"Ongoing stats (from ongoing courses): Critical={critical}, Acceptable={acceptable}, Excellent={excellent}, Total={total}")
            
            return {
                "critical": critical,
                "acceptable": acceptable,
                "excellent": excellent,
                "total": total,
                "critical_percentage": round(critical / total * 100, 1) if total > 0 else 0,
                "acceptable_percentage": round(acceptable / total * 100, 1) if total > 0 else 0,
                "excellent_percentage": round(excellent / total * 100, 1) if total > 0 else 0
            }
    except Exception as e:
        import traceback
        print(f"Error calculating stats: {e}")
        print(traceback.format_exc())
        return {
            "critical": 0,
            "acceptable": 0,
            "excellent": 0,
            "total": 0,
            "critical_percentage": 0,
            "acceptable_percentage": 0,
            "excellent_percentage": 0
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

