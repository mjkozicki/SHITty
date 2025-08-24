#!/bin/bash

# SHITty E-commerce Development Startup Script
# This script starts both the Go backend and React frontend

echo "🚀 Starting SHITty E-commerce Development Environment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start the backend
echo "🐳 Starting Go backend in Docker..."
docker run --rm -d -p 3001:3001 --name shitty-backend shitty-api

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Check if backend is responding
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Backend is running at http://localhost:3001"
else
    echo "❌ Backend failed to start. Check Docker logs."
    exit 1
fi

# Start the frontend
echo "⚛️  Starting React frontend..."
cd frontend
npm start &

echo ""
echo "🎉 Development environment is starting!"
echo ""
echo "📱 Frontend: http://localhost:3002"
echo "🔧 Backend:  http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/openapi.json"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for user to stop
wait
