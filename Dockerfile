# Use the official Go image as the base image
FROM golang:1.21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the source code first
COPY . .

# Download dependencies
RUN go get github.com/gin-gonic/gin && \
    go get github.com/google/uuid && \
    go get github.com/swaggo/gin-swagger && \
    go get github.com/swaggo/files && \
    go get github.com/swaggo/swag

# Build the application
RUN go build -o main .

# Expose port 1009
EXPOSE 1009

# Run the application
CMD ["./main"]
