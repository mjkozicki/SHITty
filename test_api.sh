#!/bin/bash

# SHITty E-commerce API Test Script
# Make sure the server is running on localhost:8080 before executing this script

BASE_URL="http://localhost:8080/api/v1"
USER_ID="test_user_123"

echo "🧪 Testing SHITty E-commerce API"
echo "=================================="
echo ""

# Test 1: Get all products
echo "1️⃣ Testing GET /products"
curl -s "$BASE_URL/products" | jq '.' 2>/dev/null || curl -s "$BASE_URL/products"
echo ""
echo ""

# Test 2: Get a specific product
echo "2️⃣ Testing GET /products/1"
curl -s "$BASE_URL/products/1" | jq '.' 2>/dev/null || curl -s "$BASE_URL/products/1"
echo ""
echo ""

# Test 3: Get top products
echo "3️⃣ Testing GET /products/top"
curl -s "$BASE_URL/products/top" | jq '.' 2>/dev/null || curl -s "$BASE_URL/products/top"
echo ""
echo ""

# Test 4: Search products
echo "4️⃣ Testing GET /search?q=iPhone&user_id=$USER_ID"
curl -s "$BASE_URL/search?q=iPhone&user_id=$USER_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/search?q=iPhone&user_id=$USER_ID"
echo ""
echo ""

# Test 5: Add product to cart
echo "5️⃣ Testing POST /cart/add"
curl -s -X POST "$BASE_URL/cart/add?user_id=$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "1", "quantity": 2}' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/cart/add?user_id=$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "1", "quantity": 2}'
echo ""
echo ""

# Test 6: Add another product to cart
echo "6️⃣ Testing POST /cart/add (second product)"
curl -s -X POST "$BASE_URL/cart/add?user_id=$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "3", "quantity": 1}' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/cart/add?user_id=$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "3", "quantity": 1}'
echo ""
echo ""

# Test 7: View cart
echo "7️⃣ Testing GET /cart/$USER_ID"
curl -s "$BASE_URL/cart/$USER_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/cart/$USER_ID"
echo ""
echo ""

# Test 8: Get recommendations
echo "8️⃣ Testing GET /recommendations/$USER_ID"
curl -s "$BASE_URL/recommendations/$USER_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/recommendations/$USER_ID"
echo ""
echo ""

# Test 9: Checkout
echo "9️⃣ Testing POST /checkout"
curl -s -X POST "$BASE_URL/checkout?user_id=$USER_ID" | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/checkout?user_id=$USER_ID"
echo ""
echo ""

# Test 10: View order history
echo "🔟 Testing GET /orders/$USER_ID"
curl -s "$BASE_URL/orders/$USER_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/orders/$USER_ID"
echo ""
echo ""

# Test 11: View empty cart after checkout
echo "1️⃣1️⃣ Testing GET /cart/$USER_ID (should be empty after checkout)"
curl -s "$BASE_URL/cart/$USER_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/cart/$USER_ID"
echo ""
echo ""

# Test 12: Get recommendations after order
echo "1️⃣2️⃣ Testing GET /recommendations/$USER_ID (after order)"
curl -s "$BASE_URL/recommendations/$USER_ID" | jq '.' 2>/dev/null || curl -s "$BASE_URL/recommendations/$USER_ID"
echo ""
echo ""

echo "✅ API testing completed!"
echo ""
echo "📚 API Documentation available at: http://localhost:1009/swagger/index.html"
echo "🔗 OpenAPI JSON available at: http://localhost:1009/openapi.json"
