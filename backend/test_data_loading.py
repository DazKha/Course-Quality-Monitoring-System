#!/usr/bin/env python3
"""Test script to check data loading"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from main import load_historical_data_from_csv
    
    print("=" * 60)
    print("Testing Historical Data Loading")
    print("=" * 60)
    
    courses = load_historical_data_from_csv()
    
    if courses:
        print(f"\n✅ Successfully loaded {len(courses)} courses")
        print(f"\nFirst 3 courses sample:")
        for i, course in enumerate(courses[:3], 1):
            print(f"\n{i}. {course.course_name}")
            print(f"   - ID: {course.course_id}")
            print(f"   - CQV: {course.course_quality_score}")
            print(f"   - Learning Interaction: {course.learning_interaction_score}")
            print(f"   - CQS: {course.CQS}")
            print(f"   - Users: {course.n_users_content_interaction}")
            print(f"   - Enrollment: {course.enrollment_count}")
        
        # Count by CQS
        needs_improvement = sum(1 for c in courses if c.CQS == 'Needs Improvement')
        acceptable = sum(1 for c in courses if c.CQS == 'Acceptable')
        excellent = sum(1 for c in courses if c.CQS == 'Excellent')
        
        print(f"\n📊 Statistics:")
        print(f"   - Needs Improvement: {needs_improvement}")
        print(f"   - Acceptable: {acceptable}")
        print(f"   - Excellent: {excellent}")
        print(f"   - Total: {len(courses)}")
        
        # Check for zero values
        zero_cqv = sum(1 for c in courses if c.course_quality_score == 0.0)
        zero_learning = sum(1 for c in courses if c.learning_interaction_score == 0.0)
        print(f"\n⚠️  Zero values:")
        print(f"   - Zero CQV: {zero_cqv}")
        print(f"   - Zero Learning Interaction: {zero_learning}")
    else:
        print("\n❌ No courses loaded. Check error messages above.")
        
except Exception as e:
    import traceback
    print(f"\n❌ Error: {e}")
    print(traceback.format_exc())

