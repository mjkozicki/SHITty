# SHITty E-commerce API

A comprehensive e-commerce API built in Go with product management, shopping cart functionality, order processing, and intelligent product recommendations.

## Features

- **Product Management**: List products, get single products, view top-rated products
- **Shopping Cart**: Add/remove items, view cart contents
- **Order Processing**: Checkout functionality and order history tracking
- **Search**: Product search with search history tracking
- **Recommendations**: Intelligent product recommendations based on:
  - Order history (primary)
  - Search history (secondary)
  - Popular products (fallback)
- **OpenAPI Compliance**: Full Swagger/OpenAPI 3.0 documentation

## API Endpoints

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/{id}` - Get a single product
- `GET /api/v1/products/top` - Get top-rated products

### Shopping Cart
- `POST /api/v1/cart/add` - Add product to cart
- `DELETE /api/v1/cart/remove` - Remove product from cart
- `GET /api/v1/cart/{userID}` - View user's cart

### Orders & Checkout
- `POST /api/v1/checkout` - Complete checkout process
- `GET /api/v1/orders/{userID}` - Get order history

### Search & Recommendations
- `GET /api/v1/search` - Search products
- `GET /api/v1/recommendations/{userID}` - Get personalized recommendations

## Quick Start

### Prerequisites
- Go 1.21 or higher
- Node.js 16+ and npm (for React frontend)
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SHITty
```

2. Install dependencies:
```bash
go mod tidy
```

3. Run the application:
```bash
go run main.go
```

The server will start on `http://localhost:3001`

### Alternative: Using Docker

If you prefer to use Docker:

```bash
# Build and run with Docker Compose
make docker-run

# Or manually:
docker-compose up -d

# Stop the service
make docker-stop
# Or manually:
docker-compose down
```

### Frontend Development

The React frontend is located in the `frontend/` directory:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The frontend will be available at `http://localhost:3002` and will automatically connect to the Go backend at `http://localhost:3001`.

### API Documentation


Once the server is running, you can access the API documentation at:
- **OpenAPI Specification**: `http://localhost:3001/openapi.json`
- **Health Check**: `http://localhost:3001/health`


## Usage Examples

### Get All Products
```bash
curl http://localhost:3001/api/v1/products
```

### Add Product to Cart
```bash
curl -X POST http://localhost:3001/api/v1/cart/add?user_id=user123 \
  -H "Content-Type: application/json" \
  -d '{"product_id": "1", "quantity": 2}'
```

### Search Products
```bash
curl "http://localhost:3001/api/v1/search?q=iPhone&user_id=user123"
```

### Get Recommendations
```bash
curl http://localhost:3001/api/v1/recommendations/user123
```

### Checkout
```bash
curl -X POST http://localhost:3001/api/v1/checkout?user_id=user123
```

## Data Models

### Product
```json
{
  "id": "1",
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "rating": 4.5,
  "image_url": "https://example.com/iphone.jpg"
}
```

### Cart Item
```json
{
  "product_id": "1",
  "quantity": 2
}
```

### Cart
```json
{
  "id": "cart-uuid",
  "user_id": "user123",
  "items": [...],
  "total": 1999.98,
  "updated": "2023-12-01T10:00:00Z"
}
```

### Order
```json
{
  "id": "order-uuid",
  "user_id": "user123",
  "items": [...],
  "total": 1999.98,
  "status": "completed",
  "created": "2023-12-01T10:00:00Z",
  "completed": "2023-12-01T10:30:00Z"
}
```

## Recommendation Algorithm

The system uses a three-tier recommendation strategy:

1. **Order History**: Analyzes past purchases to suggest similar products
2. **Search History**: Uses search patterns when no order history exists
3. **Popular Products**: Falls back to top-rated products when no personal data is available

## Development

### Project Structure
```
SHITty/
├── main.go          # Main application file
├── go.mod           # Go module file
├── docs/            # Swagger documentation
│   └── docs.go      # Generated OpenAPI spec
└── README.md        # This file
```

### Adding New Endpoints

1. Add the handler function with proper Swagger annotations
2. Register the route in the main function
3. Update the OpenAPI documentation if needed

### Testing

```bash
# Run tests (when implemented)
go test ./...

# Test specific endpoint
curl -v http://localhost:8080/api/v1/products
```

## Production Considerations

- **Database**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
- **Authentication**: Implement proper user authentication and authorization
- **Validation**: Add comprehensive input validation and sanitization
- **Error Handling**: Implement proper error logging and monitoring
- **Rate Limiting**: Add API rate limiting to prevent abuse
- **Caching**: Implement Redis or similar for caching frequently accessed data
- **Security**: Add HTTPS, CORS configuration, and security headers

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For questions or issues, please open an issue on the GitHub repository.

---

## 📋 **Initial Project Requirements**

This project was created based on the following initial prompt:

> Create a web application in Golang with the following endpoints, a list of products, a single product, add a product to a server side cart, remove an item from the cart, view top products, go to checkout, record order history, and recommend products based on my order history (use search history if no orders. If no searches, use popular recommendations). Make the API OpenAPI compliant.

### ✅ **Requirements Fulfilled:**

- **✅ List of products**: `GET /api/v1/products`
- **✅ Single product**: `GET /api/v1/products/{id}`
- **✅ Add product to cart**: `POST /api/v1/cart/add`
- **✅ Remove item from cart**: `DELETE /api/v1/cart/remove`
- **✅ View top products**: `GET /api/v1/products/top`
- **✅ Go to checkout**: `POST /api/v1/checkout`
- **✅ Record order history**: `GET /api/v1/orders/{userID}`
- **✅ Recommend products based on order history**: `GET /api/v1/recommendations/{userID}`
- **✅ OpenAPI compliant**: Full Swagger/OpenAPI 3.0 documentation
- **✅ Bonus features**: Search functionality, health checks, Docker support, comprehensive testing
