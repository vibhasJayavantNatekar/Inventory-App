# Inventory App API Endpoints 

## Base URL
```
http://localhost:4000/api
```

---

## Authentication Endpoint

### POST /login
- **Description**: Login using username and password.
- **Body**: `{ name, password }`
- **Response**: `{ user }` or `"Invalid"`, `"Inactive"`, `"Failed"`

---

## User Endpoints

### GET /users
- **Description**: Get all users.
- **Response**: `{ users: [...] }`

### GET /users/:id
- **Description**: Get a specific user by ID.

### POST /users
- **Description**: Create a new user.
- **Body**: `{ name, email, password, active, role }`
- **Response**: `{ message: "User added successfully" }`

### PUT /users/:id
- **Description**: Update user details.
- **Body**: `{ name, email, password, active, role }`
- **Response**: `{ message: "Updated .." }`

### DELETE /users/:id
- **Description**: Delete a user.
- **Response**: `{ message: "Deleted user ..." }`

### GET /users/get-pdf
- **Description**: Download users list in PDF format.

### GET /users/get-excel
- **Description**: Download users list in Excel format.

---

## Category Endpoints

### GET /categories
- **Description**: Get all categories.
- **Response**: `{ category: [...] }`

### GET /categories/:c_id
- **Description**: Get category by category ID.

### POST /categories
- **Description**: Add a new category.
- **Body**: `{ name, description }`
- **Response**: `{ message: "New category created" }`

### PUT /categories/:id
- **Description**: Update a category.
- **Body**: `{ name, description }`
- **Response**: `{ message: "Updated.." }`

### DELETE /categories/:id
- **Description**: Delete a category.
- **Response**: `{ message: "Deleted..." }`

### GET /categories/get-pdf
- **Description**: Download all categories as PDF.

### GET /categories/get-excel
- **Description**: Download all categories as Excel.

---

## Product Endpoints

### GET /products
- **Description**: Get all products with category and supplier.
- **Response**: `{ products: [...] }`

### GET /products/:id
- **Description**: Get a product by ID.

### POST /products
- **Description**: Create a new product.
- **Body**: `{ name, price, qty, c_id, s_id }`
- **Response**: `{ message: "Product created successfully" }`

### PUT /products/:id
- **Description**: Update a product.
- **Body**: `{ name, price, qty, c_id, s_id }`
- **Response**: `{ message: "Product updated" }`

### DELETE /products/:id
- **Description**: Delete a product.
- **Response**: `{ message: "Deleted successfully" }`

### GET /products/get-pdf
- **Description**: Download product list as PDF.

### GET /products/get-excel
- **Description**: Download product list as Excel.

---

## Supplier Endpoints

### GET /suppliers
- **Description**: Get all suppliers.
- **Response**: `{ supplier: [...] }`

### GET /suppliers/:id
- **Description**: Get supplier by ID.

### POST /suppliers
- **Description**: Add a new supplier.
- **Body**: `{ name, contact, address }`
- **Response**: `{ message: "Supplier was Created" }`

### PUT /suppliers/:id
- **Description**: Update supplier.
- **Body**: `{ name, contact, address }`
- **Response**: `{ message: "Updated ..." }`

### DELETE /suppliers/:id
- **Description**: Delete supplier.
- **Response**: `{ message: "Deleted..." }`

### GET /suppliers/get-pdf
- **Description**: Download supplier list as PDF.

### GET /suppliers/get-excel
- **Description**: Download supplier list as Excel.

---

## Report Endpoints

### GET /reports/export-pdf
- **Description**: Generate and download report as PDF.

### GET /reports/export-excel
- **Description**: Generate and download report as Excel.

---

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## Error Codes

- **400**: Bad Request  
- **401**: Unauthorized  
- **404**: Not Found  
- **500**: Internal Server Error  

---


