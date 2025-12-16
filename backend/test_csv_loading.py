#!/usr/bin/env python3
"""Test script to check CSV loading"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import load_historical_data_from_csv

if __name__ == "__main__":
    print("Testing CSV loading...")
    courses = load_historical_data_from_csv()
    
    if courses:
        print(f"\n✅ Successfully loaded {len(courses)} courses")
        print(f"\nFirst course sample:")
        first = courses[0]
        print(f"  - ID: {first.course_id}")
        print(f"  - Name: {first.course_name}")
        print(f"  - CQV: {first.course_quality_score}")
        print(f"  - Learning Interaction: {first.learning_interaction_score}")
        print(f"  - CQS: {first.CQS}")
        print(f"  - Users: {first.n_users_content_interaction}")
    else:
        print("\n❌ No courses loaded. Check error messages above.")

