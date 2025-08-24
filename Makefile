.PHONY: help build run test clean docker-build docker-run docker-stop

# Default target
help:
	@echo "SHITty E-commerce API - Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  build        - Build the Go application"
	@echo "  run          - Run the application locally"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run with Docker Compose"
	@echo "  docker-stop  - Stop Docker Compose services"
	@echo ""
	@echo "API Testing:"
	@echo "  test-api     - Run API test script (requires server running)"
	@echo ""
	@echo "Documentation:"
	@echo "  docs         - Generate Swagger documentation"

# Development commands
build:
	@echo "Building application..."
	go build -o bin/shitty main.go

run: build
	@echo "Running application..."
	./bin/shitty

test:
	@echo "Running tests..."
	go test ./...

clean:
	@echo "Cleaning build artifacts..."
	rm -rf bin/
	go clean

# Docker commands
docker-build:
	@echo "Building Docker image..."
	docker build -t shitty-api .

docker-run: docker-build
	@echo "Starting services with Docker Compose..."
	docker-compose up -d

docker-stop:
	@echo "Stopping Docker Compose services..."
	docker-compose down

# API testing
test-api:
	@echo "Testing API endpoints..."
	./test_api.sh

# Documentation
docs:
	@echo "Generating Swagger documentation..."
	@echo "Note: This requires swag CLI tool to be installed"
	@echo "Install with: go install github.com/swaggo/swag/cmd/swag@latest"
	@echo "Then run: swag init -g main.go"

# Install dependencies
deps:
	@echo "Installing Go dependencies..."
	go mod tidy
	go mod download

# Development setup
setup: deps
	@echo "Setting up development environment..."
	@echo "✅ Dependencies installed"
	@echo "✅ Ready to run: make run"
	@echo "✅ Or with Docker: make docker-run"
