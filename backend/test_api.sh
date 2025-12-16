#!/bin/bash

# Test script for MOOC Quality Monitor API
# Usage: ./test_api.sh [BASE_URL]
# Example: ./test_api.sh https://your-app.onrender.com

BASE_URL=${1:-"http://localhost:8000"}

echo "🧪 Testing MOOC Quality Monitor API"
echo "Base URL: $BASE_URL"
echo "========================================"

# Test 1: Health Check
echo -e "\n1️⃣  Testing Health Check (GET /)"
curl -s "$BASE_URL/" | jq '.' || echo "❌ Failed"

# Test 2: Historical Data
echo -e "\n2️⃣  Testing Historical Data (GET /api/historical-data)"
response=$(curl -s "$BASE_URL/api/historical-data")
count=$(echo "$response" | jq '. | length')
echo "   📊 Retrieved $count courses"
echo "$response" | jq '.[0]' || echo "❌ Failed"

# Test 3: Ongoing Predictions
echo -e "\n3️⃣  Testing Ongoing Predictions (GET /api/ongoing-prediction)"
response=$(curl -s "$BASE_URL/api/ongoing-prediction")
count=$(echo "$response" | jq '. | length')
echo "   📊 Retrieved $count courses"
echo "$response" | jq '.[0]' || echo "❌ Failed"

# Test 4: Historical Stats
echo -e "\n4️⃣  Testing Historical Stats (GET /api/stats?type=historical)"
curl -s "$BASE_URL/api/stats?type=historical" | jq '.' || echo "❌ Failed"

# Test 5: Ongoing Stats
echo -e "\n5️⃣  Testing Ongoing Stats (GET /api/stats?type=ongoing)"
curl -s "$BASE_URL/api/stats?type=ongoing" | jq '.' || echo "❌ Failed"

# Test 6: Response Time
echo -e "\n6️⃣  Testing Response Time"
time curl -s -o /dev/null -w "   ⏱️  Response time: %{time_total}s\n" "$BASE_URL/api/stats?type=historical"

echo -e "\n========================================"
echo "✅ API Testing Complete!"

