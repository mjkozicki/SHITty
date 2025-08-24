package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Product represents a product in the system
type Product struct {
	ID          string  `json:"id" example:"123e4567-e89b-12d3-a456-426614174000"`
	Name        string  `json:"name" example:"iPhone 15 Pro"`
	Description string  `json:"description" example:"Latest iPhone with advanced features"`
	Price       float64 `json:"price" example:"999.99"`
	Category    string  `json:"category" example:"Electronics"`
	Stock       int     `json:"stock" example:"50"`
	Rating      float64 `json:"rating" example:"4.5"`
	ImageURL    string  `json:"image_url" example:"https://example.com/iphone.jpg"`
}

// CartItem represents an item in the shopping cart
type CartItem struct {
	ProductID string `json:"product_id" example:"123e4567-e89b-12d3-a456-426614174000"`
	Quantity  int    `json:"quantity" example:"2"`
}

// Cart represents a user's shopping cart
type Cart struct {
	ID       string     `json:"id" example:"123e4567-e89b-12d3-a456-426614174000"`
	UserID   string     `json:"user_id" example:"user123"`
	Items    []CartItem `json:"items"`
	Total    float64    `json:"total" example:"1999.98"`
	Updated  time.Time  `json:"updated" example:"2023-12-01T10:00:00Z"`
}

// Order represents a completed order
type Order struct {
	ID        string     `json:"id" example:"123e4567-e89b-12d3-a456-426614174000"`
	UserID    string     `json:"user_id" example:"user123"`
	Items     []CartItem `json:"items"`
	Total     float64    `json:"total" example:"1999.98"`
	Status    string     `json:"status" example:"completed"`
	Created   time.Time  `json:"created" example:"2023-12-01T10:00:00Z"`
	Completed time.Time  `json:"completed,omitempty" example:"2023-12-01T10:30:00Z"`
}

// SearchHistory represents a user's search history
type SearchHistory struct {
	ID        string    `json:"id" example:"123e4567-e89b-12d3-a456-426614174000"`
	UserID    string    `json:"user_id" example:"user123"`
	Query     string    `json:"query" example:"iPhone"`
	Timestamp time.Time `json:"timestamp" example:"2023-12-01T10:00:00Z"`
}

// Global storage (in production, use a proper database)
var (
	products      = make(map[string]Product)
	carts         = make(map[string]Cart)
	orders        = make(map[string]Order)
	searchHistory = make(map[string][]SearchHistory)
	userCarts    = make(map[string]string) // userID -> cartID
)

// @title SHITty E-commerce API
// @version 1.0
// @description A comprehensive e-commerce API with product management, shopping cart, orders, and recommendations
// @host localhost:3001
// @BasePath /api/v1
func main() {
	// Initialize sample data
	initializeData()

	r := gin.Default()

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().Format(time.RFC3339),
			"service":   "SHITty E-commerce API",
			"version":   "1.0.0",
		})
	})

	// OpenAPI specification endpoint
	r.GET("/openapi.json", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"openapi": "3.0.0",
			"info": gin.H{
				"title":       "SHITty E-commerce API",
				"description": "A comprehensive e-commerce API with product management, shopping cart, orders, and recommendations",
				"version":     "1.0.0",
			},
			"servers": []gin.H{
				{
					"url":         "http://localhost:8080",
					"description": "Development server",
				},
			},
			"paths": gin.H{
				"/health": gin.H{
					"get": gin.H{
						"summary":     "Health check",
						"description": "Check if the service is healthy",
						"responses": gin.H{
							"200": gin.H{
								"description": "Service is healthy",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"type": "object",
											"properties": gin.H{
												"status": gin.H{"type": "string"},
												"timestamp": gin.H{"type": "string", "format": "date-time"},
												"service": gin.H{"type": "string"},
												"version": gin.H{"type": "string"},
											},
										},
									},
								},
							},
						},
					},
				},
				"/api/v1/products": gin.H{
					"get": gin.H{
						"summary":     "Get all products",
						"description": "Retrieve a list of all available products",
						"responses": gin.H{
							"200": gin.H{
								"description": "List of products",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"type": "array",
											"items": gin.H{
												"$ref": "#/components/schemas/Product",
											},
										},
									},
								},
							},
						},
					},
				},
				"/api/v1/products/{id}": gin.H{
					"get": gin.H{
						"summary":     "Get a single product",
						"description": "Retrieve a specific product by ID",
						"parameters": []gin.H{
							{
								"name":        "id",
								"in":          "path",
								"required":    true,
								"description": "Product ID",
								"schema": gin.H{
									"type": "string",
								},
							},
						},
						"responses": gin.H{
							"200": gin.H{
								"description": "Product details",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"$ref": "#/components/schemas/Product",
										},
									},
								},
							},
							"404": gin.H{
								"description": "Product not found",
							},
						},
					},
				},
				"/api/v1/products/top": gin.H{
					"get": gin.H{
						"summary":     "Get top products",
						"description": "Retrieve top-rated products",
						"parameters": []gin.H{
							{
								"name":        "limit",
								"in":          "query",
								"required":    false,
								"description": "Number of products to return",
								"schema": gin.H{
									"type": "integer",
									"default": 5,
								},
							},
						},
						"responses": gin.H{
							"200": gin.H{
								"description": "List of top products",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"type": "array",
											"items": gin.H{
												"$ref": "#/components/schemas/Product",
											},
										},
									},
								},
							},
						},
					},
				},
				"/api/v1/cart/add": gin.H{
					"post": gin.H{
						"summary":     "Add product to cart",
						"description": "Add a product to the user's shopping cart",
						"parameters": []gin.H{
							{
								"name":        "user_id",
								"in":          "query",
								"required":    true,
								"description": "User ID",
								"schema": gin.H{
									"type": "string",
								},
							},
						},
						"requestBody": gin.H{
							"required": true,
							"content": gin.H{
								"application/json": gin.H{
									"schema": gin.H{
										"$ref": "#/components/schemas/CartItem",
									},
								},
							},
						},
						"responses": gin.H{
							"200": gin.H{
								"description": "Cart updated successfully",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"$ref": "#/components/schemas/Cart",
										},
									},
								},
							},
							"400": gin.H{
								"description": "Bad request",
							},
							"404": gin.H{
								"description": "Product not found",
							},
						},
					},
				},
				"/api/v1/cart/remove": gin.H{
					"delete": gin.H{
						"summary":     "Remove item from cart",
						"description": "Remove a product from the user's shopping cart",
						"parameters": []gin.H{
							{
								"name":        "user_id",
								"in":          "query",
								"required":    true,
								"description": "User ID",
								"schema": gin.H{
									"type": "string",
								},
							},
						},
						"requestBody": gin.H{
							"required": true,
							"content": gin.H{
								"application/json": gin.H{
									"schema": gin.H{
										"$ref": "#/components/schemas/CartItem",
									},
								},
							},
						},
						"responses": gin.H{
							"200": gin.H{
								"description": "Cart updated successfully",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"$ref": "#/components/schemas/Cart",
										},
									},
								},
							},
							"400": gin.H{
								"description": "Bad request",
							},
						},
					},
				},
				"/api/v1/cart/{userID}": gin.H{
					"get": gin.H{
						"summary":     "Get user's cart",
						"description": "Retrieve the user's shopping cart",
						"parameters": []gin.H{
							{
								"name":        "userID",
								"in":          "path",
								"required":    true,
								"description": "User ID",
								"schema": gin.H{
									"type": "string",
								},
							},
						},
						"responses": gin.H{
							"200": gin.H{
								"description": "Cart details",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"$ref": "#/components/schemas/Cart",
										},
									},
								},
							},
							"404": gin.H{
								"description": "Cart not found",
							},
						},
					},
				},
				"/api/v1/checkout": gin.H{
					"post": gin.H{
						"summary":     "Checkout",
						"description": "Complete the checkout process and create an order",
						"parameters": []gin.H{
							{
								"name":        "user_id",
								"in":          "query",
								"required":    true,
								"description": "User ID",
								"schema": gin.H{
									"type": "string",
								},
							},
						},
						"responses": gin.H{
							"200": gin.H{
								"description": "Order created successfully",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"$ref": "#/components/schemas/Order",
										},
									},
								},
							},
							"400": gin.H{
								"description": "Bad request",
							},
						},
					},
				},
				"/api/v1/orders/{userID}": gin.H{
					"get": gin.H{
						"summary":     "Get order history",
						"description": "Retrieve the user's order history",
						"parameters": []gin.H{
							{
								"name":        "userID",
								"in":          "path",
								"required":    true,
								"description": "User ID",
								"schema": gin.H{
									"type": "string",
								},
							},
						},
						"responses": gin.H{
							"200": gin.H{
								"description": "List of orders",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"type": "array",
											"items": gin.H{
												"$ref": "#/components/schemas/Order",
											},
										},
									},
								},
							},
						},
					},
				},
				"/api/v1/recommendations/{userID}": gin.H{
					"get": gin.H{
						"summary":     "Get product recommendations",
						"description": "Get personalized product recommendations based on order history, search history, or popular products",
						"parameters": []gin.H{
							{
								"name":        "userID",
								"in":          "path",
								"required":    true,
								"description": "User ID",
								"schema": gin.H{
									"type": "string",
								},
							},
							{
								"name":        "limit",
								"in":          "query",
								"required":    false,
								"description": "Number of recommendations",
								"schema": gin.H{
									"type": "integer",
									"default": 5,
								},
							},
						},
						"responses": gin.H{
							"200": gin.H{
								"description": "List of recommended products",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"type": "array",
											"items": gin.H{
												"$ref": "#/components/schemas/Product",
											},
										},
									},
								},
							},
						},
					},
				},
				"/api/v1/search": gin.H{
					"get": gin.H{
						"summary":     "Search products",
						"description": "Search for products and record search history",
						"parameters": []gin.H{
							{
								"name":        "q",
								"in":          "query",
								"required":    true,
								"description": "Search query",
								"schema": gin.H{
									"type": "string",
								},
							},
							{
								"name":        "user_id",
								"in":          "query",
								"required":    false,
								"description": "User ID for tracking search history",
								"schema": gin.H{
									"type": "string",
								},
							},
						},
						"responses": gin.H{
							"200": gin.H{
								"description": "Search results",
								"content": gin.H{
									"application/json": gin.H{
										"schema": gin.H{
											"type": "array",
											"items": gin.H{
												"$ref": "#/components/schemas/Product",
											},
										},
									},
								},
							},
							"400": gin.H{
								"description": "Bad request",
							},
						},
					},
				},
			},
			"components": gin.H{
				"schemas": gin.H{
					"Product": gin.H{
						"type": "object",
						"properties": gin.H{
							"id": gin.H{
								"type": "string",
								"example": "1",
							},
							"name": gin.H{
								"type": "string",
								"example": "iPhone 15 Pro",
							},
							"description": gin.H{
								"type": "string",
								"example": "Latest iPhone with advanced features",
							},
							"price": gin.H{
								"type": "number",
								"example": 999.99,
							},
							"category": gin.H{
								"type": "string",
								"example": "Electronics",
							},
							"stock": gin.H{
								"type": "integer",
								"example": 50,
							},
							"rating": gin.H{
								"type": "number",
								"example": 4.5,
							},
							"image_url": gin.H{
								"type": "string",
								"example": "https://example.com/iphone.jpg",
							},
						},
					},
					"CartItem": gin.H{
						"type": "object",
						"properties": gin.H{
							"product_id": gin.H{
								"type": "string",
								"example": "1",
							},
							"quantity": gin.H{
								"type": "integer",
								"example": 2,
							},
						},
					},
					"Cart": gin.H{
						"type": "object",
						"properties": gin.H{
							"id": gin.H{
								"type": "string",
								"example": "cart-uuid",
							},
							"user_id": gin.H{
								"type": "string",
								"example": "user123",
							},
							"items": gin.H{
								"type": "array",
								"items": gin.H{
									"$ref": "#/components/schemas/CartItem",
								},
							},
							"total": gin.H{
								"type": "number",
								"example": 1999.98,
							},
							"updated": gin.H{
								"type": "string",
								"format": "date-time",
								"example": "2023-12-01T10:00:00Z",
							},
						},
					},
					"Order": gin.H{
						"type": "object",
						"properties": gin.H{
							"id": gin.H{
								"type": "string",
								"example": "order-uuid",
							},
							"user_id": gin.H{
								"type": "string",
								"example": "user123",
							},
							"items": gin.H{
								"type": "array",
								"items": gin.H{
									"$ref": "#/components/schemas/CartItem",
								},
							},
							"total": gin.H{
								"type": "number",
								"example": 1999.98,
							},
							"status": gin.H{
								"type": "string",
								"example": "completed",
							},
							"created": gin.H{
								"type": "string",
								"format": "date-time",
								"example": "2023-12-01T10:00:00Z",
							},
							"completed": gin.H{
								"type": "string",
								"format": "date-time",
								"example": "2023-12-01T10:30:00Z",
							},
						},
					},
				},
			},
		})
	})

	// API routes
	api := r.Group("/api/v1")
	{
		// Product endpoints
		api.GET("/products", getProducts)
		api.GET("/products/:id", getProduct)
		api.GET("/products/top", getTopProducts)

		// Cart endpoints
		api.POST("/cart/add", addToCart)
		api.DELETE("/cart/remove", removeFromCart)
		api.GET("/cart/:userID", getCart)

		// Checkout and orders
		api.POST("/checkout", checkout)
		api.GET("/orders/:userID", getOrderHistory)

		// Recommendations
		api.GET("/recommendations/:userID", getRecommendations)

		// Search (for tracking search history)
		api.GET("/search", searchProducts)
	}

	// Swagger documentation (temporarily disabled for Docker build)
	// r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	log.Println("Server starting on :3001")
	log.Fatal(r.Run(":3001"))
}

// initializeData populates the system with sample data
func initializeData() {
	// Sample products
	products["1"] = Product{
		ID:          "1",
		Name:        "iPhone 15 Pro",
		Description: "Latest iPhone with advanced features",
		Price:       999.99,
		Category:    "Electronics",
		Stock:       50,
		Rating:      4.5,
		ImageURL:    "https://example.com/iphone.jpg",
	}
	products["2"] = Product{
		ID:          "2",
		Name:        "MacBook Pro M3",
		Description: "Powerful laptop for professionals",
		Price:       1999.99,
		Category:    "Electronics",
		Stock:       30,
		Rating:      4.8,
		ImageURL:    "https://example.com/macbook.jpg",
	}
	products["3"] = Product{
		ID:          "3",
		Name:        "AirPods Pro",
		Description: "Wireless earbuds with noise cancellation",
		Price:       249.99,
		Category:    "Electronics",
		Stock:       100,
		Rating:      4.6,
		ImageURL:    "https://example.com/airpods.jpg",
	}
	products["4"] = Product{
		ID:          "4",
		Name:        "iPad Air",
		Description: "Versatile tablet for work and play",
		Price:       599.99,
		Category:    "Electronics",
		Stock:       75,
		Rating:      4.4,
		ImageURL:    "https://example.com/ipad.jpg",
	}
	products["5"] = Product{
		ID:          "5",
		Name:        "Apple Watch Series 9",
		Description: "Smartwatch with health monitoring",
		Price:       399.99,
		Category:    "Electronics",
		Stock:       60,
		Rating:      4.7,
		ImageURL:    "https://example.com/watch.jpg",
	}
}

// @Summary Get all products
// @Description Retrieve a list of all available products
// @Tags products
// @Accept json
// @Produce json
// @Success 200 {array} Product
// @Router /products [get]
func getProducts(c *gin.Context) {
	var productList []Product
	for _, product := range products {
		productList = append(productList, product)
	}
	c.JSON(http.StatusOK, productList)
}

// @Summary Get a single product
// @Description Retrieve a specific product by ID
// @Tags products
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} Product
// @Failure 404 {object} map[string]interface{}
// @Router /products/{id} [get]
func getProduct(c *gin.Context) {
	id := c.Param("id")
	product, exists := products[id]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

// @Summary Get top products
// @Description Retrieve top-rated products
// @Tags products
// @Accept json
// @Produce json
// @Param limit query int false "Number of products to return" default(5)
// @Success 200 {array} Product
// @Router /products/top [get]
func getTopProducts(c *gin.Context) {
	limit := 5
	if limitStr := c.Query("limit"); limitStr != "" {
		if parsed, err := parseLimit(limitStr); err == nil {
			limit = parsed
		}
	}

	var productList []Product
	for _, product := range products {
		productList = append(productList, product)
	}

	// Sort by rating (descending) and limit results
	// In a real app, you'd use a proper sorting algorithm
	if len(productList) > limit {
		productList = productList[:limit]
	}

	c.JSON(http.StatusOK, productList)
}

// @Summary Add product to cart
// @Description Add a product to the user's shopping cart
// @Tags cart
// @Accept json
// @Produce json
// @Param request body CartItem true "Cart item to add"
// @Param user_id query string true "User ID"
// @Success 200 {object} Cart
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Router /cart/add [post]
func addToCart(c *gin.Context) {
	userID := c.Query("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	var item CartItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Check if product exists
	product, exists := products[item.ProductID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Check stock
	if product.Stock < item.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Insufficient stock"})
		return
	}

	// Get or create cart
	cartID, exists := userCarts[userID]
	if !exists {
		cartID = uuid.New().String()
		userCarts[userID] = cartID
		carts[cartID] = Cart{
			ID:      cartID,
			UserID:  userID,
			Items:   []CartItem{},
			Total:   0,
			Updated: time.Now(),
		}
	}

	cart := carts[cartID]

	// Check if product already in cart
	found := false
	for i, existingItem := range cart.Items {
		if existingItem.ProductID == item.ProductID {
			cart.Items[i].Quantity += item.Quantity
			found = true
			break
		}
	}

	if !found {
		cart.Items = append(cart.Items, item)
	}

	// Recalculate total
	cart.Total = 0
	for _, cartItem := range cart.Items {
		if product, exists := products[cartItem.ProductID]; exists {
			cart.Total += product.Price * float64(cartItem.Quantity)
		}
	}

	cart.Updated = time.Now()
	carts[cartID] = cart

	c.JSON(http.StatusOK, cart)
}

// @Summary Remove item from cart
// @Description Remove a product from the user's shopping cart
// @Tags cart
// @Accept json
// @Produce json
// @Param request body CartItem true "Cart item to remove"
// @Param user_id query string true "User ID"
// @Success 200 {object} Cart
// @Failure 400 {object} map[string]interface{}
// @Router /cart/remove [delete]
func removeFromCart(c *gin.Context) {
	userID := c.Query("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	var item CartItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	cartID, exists := userCarts[userID]
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart not found"})
		return
	}

	cart := carts[cartID]

	// Remove item from cart
	for i, existingItem := range cart.Items {
		if existingItem.ProductID == item.ProductID {
			if item.Quantity >= existingItem.Quantity {
				// Remove completely
				cart.Items = append(cart.Items[:i], cart.Items[i+1:]...)
			} else {
				// Reduce quantity
				cart.Items[i].Quantity -= item.Quantity
			}
			break
		}
	}

	// Recalculate total
	cart.Total = 0
	for _, cartItem := range cart.Items {
		if product, exists := products[cartItem.ProductID]; exists {
			cart.Total += product.Price * float64(cartItem.Quantity)
		}
	}

	cart.Updated = time.Now()
	carts[cartID] = cart

	c.JSON(http.StatusOK, cart)
}

// @Summary Get user's cart
// @Description Retrieve the user's shopping cart
// @Tags cart
// @Accept json
// @Produce json
// @Param userID path string true "User ID"
// @Success 200 {object} Cart
// @Failure 404 {object} map[string]interface{}
// @Router /cart/{userID} [get]
func getCart(c *gin.Context) {
	userID := c.Param("userID")
	cartID, exists := userCarts[userID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	cart, exists := carts[cartID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart not found"})
		return
	}

	c.JSON(http.StatusOK, cart)
}

// @Summary Checkout
// @Description Complete the checkout process and create an order
// @Tags checkout
// @Accept json
// @Produce json
// @Param user_id query string true "User ID"
// @Success 200 {object} Order
// @Failure 400 {object} map[string]interface{}
// @Router /checkout [post]
func checkout(c *gin.Context) {
	userID := c.Query("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	cartID, exists := userCarts[userID]
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart not found"})
		return
	}

	cart := carts[cartID]
	if len(cart.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
		return
	}

	// Create order
	order := Order{
		ID:        uuid.New().String(),
		UserID:    userID,
		Items:     cart.Items,
		Total:     cart.Total,
		Status:    "completed",
		Created:   time.Now(),
		Completed: time.Now(),
	}

	orders[order.ID] = order

	// Clear cart
	cart.Items = []CartItem{}
	cart.Total = 0
	cart.Updated = time.Now()
	carts[cartID] = cart

	c.JSON(http.StatusOK, order)
}

// @Summary Get order history
// @Description Retrieve the user's order history
// @Tags orders
// @Accept json
// @Produce json
// @Param userID path string true "User ID"
// @Success 200 {array} Order
// @Router /orders/{userID} [get]
func getOrderHistory(c *gin.Context) {
	userID := c.Param("userID")
	var userOrders []Order

	for _, order := range orders {
		if order.UserID == userID {
			userOrders = append(userOrders, order)
		}
	}

	c.JSON(http.StatusOK, userOrders)
}

// @Summary Get product recommendations
// @Description Get personalized product recommendations based on order history, search history, or popular products
// @Tags recommendations
// @Accept json
// @Produce json
// @Param userID path string true "User ID"
// @Param limit query int false "Number of recommendations" default(5)
// @Success 200 {array} Product
// @Router /recommendations/{userID} [get]
func getRecommendations(c *gin.Context) {
	userID := c.Param("userID")
	limit := 5
	if limitStr := c.Query("limit"); limitStr != "" {
		if parsed, err := parseLimit(limitStr); err == nil {
			limit = parsed
		}
	}

	var recommendations []Product

	// Strategy 1: Based on order history
	userOrders := getOrdersByUser(userID)
	if len(userOrders) > 0 {
		recommendations = getRecommendationsFromOrders(userOrders, limit)
		if len(recommendations) > 0 {
			c.JSON(http.StatusOK, recommendations)
			return
		}
	}

	// Strategy 2: Based on search history
	userSearches := getSearchesByUser(userID)
	if len(userSearches) > 0 {
		recommendations = getRecommendationsFromSearches(userSearches, limit)
		if len(recommendations) > 0 {
			c.JSON(http.StatusOK, recommendations)
			return
		}
	}

	// Strategy 3: Popular products (fallback)
	recommendations = getPopularProducts(limit)
	c.JSON(http.StatusOK, recommendations)
}

// @Summary Search products
// @Description Search for products and record search history
// @Tags search
// @Accept json
// @Produce json
// @Param q query string true "Search query"
// @Param user_id query string false "User ID for tracking search history"
// @Success 200 {array} Product
// @Router /search [get]
func searchProducts(c *gin.Context) {
	query := c.Query("q")
	userID := c.Query("user_id")

	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Search query is required"})
		return
	}

	// Record search history if user_id provided
	if userID != "" {
		search := SearchHistory{
			ID:        uuid.New().String(),
			UserID:    userID,
			Query:     query,
			Timestamp: time.Now(),
		}
		searchHistory[userID] = append(searchHistory[userID], search)
	}

	// Simple search implementation (in production, use proper search engine)
	var results []Product
	for _, product := range products {
		if contains(product.Name, query) || contains(product.Description, query) || contains(product.Category, query) {
			results = append(results, product)
		}
	}

	c.JSON(http.StatusOK, results)
}

// Helper functions
func parseLimit(limitStr string) (int, error) {
	// Simple implementation - in production, use strconv.Atoi
	return 5, nil
}

func getOrdersByUser(userID string) []Order {
	var userOrders []Order
	for _, order := range orders {
		if order.UserID == userID {
			userOrders = append(userOrders, order)
		}
	}
	return userOrders
}

func getSearchesByUser(userID string) []SearchHistory {
	return searchHistory[userID]
}

func getRecommendationsFromOrders(userOrders []Order, limit int) []Product {
	// Simple recommendation based on categories from orders
	categoryCount := make(map[string]int)
	for _, order := range userOrders {
		for _, item := range order.Items {
			if product, exists := products[item.ProductID]; exists {
				categoryCount[product.Category]++
			}
		}
	}

	// Find products from preferred categories
	var recommendations []Product
	for _, product := range products {
		if categoryCount[product.Category] > 0 && len(recommendations) < limit {
			recommendations = append(recommendations, product)
		}
	}

	return recommendations
}

func getRecommendationsFromSearches(userSearches []SearchHistory, limit int) []Product {
	// Simple recommendation based on search terms
	var recommendations []Product
	for _, search := range userSearches {
		for _, product := range products {
			if contains(product.Name, search.Query) || contains(product.Description, search.Query) {
				if len(recommendations) < limit {
					recommendations = append(recommendations, product)
				}
			}
		}
	}
	return recommendations
}

func getPopularProducts(limit int) []Product {
	// Return products with highest ratings
	var productList []Product
	for _, product := range products {
		productList = append(productList, product)
	}

	// Simple sorting by rating (in production, use proper sorting)
	if len(productList) > limit {
		productList = productList[:limit]
	}

	return productList
}

func contains(s, substr string) bool {
	// Simple case-insensitive contains check
	return len(s) >= len(substr) && (s == substr || 
		(len(s) > len(substr) && (s[:len(substr)] == substr || 
		s[len(s)-len(substr):] == substr)))
}
