# Frontend Integration Guide

This document lists the current backend endpoints and how the frontend should use them.

Base URL

- Production: `https://simplewood-backend-t1k5.vercel.app`

Authentication

- Tokens are JWTs returned by `/api/auth/register` and `/api/auth/login`.
- Send token on protected routes as `Authorization: Bearer <token>`.

Auth Endpoints

- `POST /api/auth/register`
  - Body:
    ```json
    { "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
    ```
  - Response:
    ```json
    {
      "success": true,
      "message": "User created successfully",
      "token": "<jwt>",
      "user": { "id": "<userId>", "name": "Jane Doe", "email": "jane@example.com" }
    }
    ```
- `POST /api/auth/login`
  - Body:
    ```json
    { "email": "jane@example.com", "password": "secret123" }
    ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Login Successful",
      "token": "<jwt>",
      "user": { "id": "<userId>", "name": "Jane Doe", "email": "jane@example.com" }
    }
    ```
- `GET /api/auth/profile` (protected)
  - Response:
    ```json
    { "success": true, "user": { "_id": "<userId>", "name": "Jane Doe", "email": "jane@example.com" } }
    ```

Products

- `GET /api/products`
  - Query params: `page`, `limit`, `category`, `minPrice`, `maxPrice`, `inStock`, `sortBy`, `sortOrder`, `search`
  - Example:
    `GET /api/products?page=1&limit=12&category=chairs&sortBy=createdAt&sortOrder=desc`
- `GET /api/products/:id`
  - Returns a single product by id.
  - Response:
    ```json
    {
      "success": true,
      "message": "Product found",
      "data": {
        "_id": "<productId>",
        "name": "Arc Lounge Chair",
        "price": 399.99,
        "category": "chairs",
        "images": [{ "url": "https://images.unsplash.com/...", "alt": "..." }],
        "rating": { "average": 4.6, "count": 12 }
      }
    }
    ```
- `POST /api/products` (protected)
  - Create a product. Use same schema as `Product.models.js`.
  - Response:
    ```json
    {
      "success": true,
      "message": "Product created successfully",
      "data": { "_id": "<productId>", "name": "Arc Lounge Chair", "createdBy": { "name": "Jane Doe" } }
    }
    ```
- `PUT /api/products/:id` (protected)
  - Update a product by id.
  - Response:
    ```json
    {
      "success": true,
      "message": "Product updated successfully",
      "data": { "_id": "<productId>", "name": "Updated Name" }
    }
    ```
- `DELETE /api/products/:id` (protected)
  - Soft delete (sets `isActive=false`).
  - Response: HTTP `204 No Content`

Product Reviews

- `GET /api/products/:id/reviews`
  - Query params: `page`, `limit`
  - Response:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "<reviewId>",
          "nickname": "Veronica",
          "summary": "Comfy and well made",
          "review": "Rides up a bit but feels great overall.",
          "rating": 4,
          "createdAt": "2025-01-18T12:00:00.000Z"
        }
      ],
      "pagination": { "currentPage": 1, "totalPages": 1, "totalReviews": 1, "hasNextPage": false, "hasPrevPage": false }
    }
    ```
- `POST /api/products/:id/reviews` (protected)
  - Body:
    ```json
    {
      "nickname": "Veronica",
      "summary": "Comfy and well made",
      "review": "Rides up a bit but feels great overall.",
      "rating": 4
    }
    ```
  - Response:
    ```json
    { "success": true, "message": "Review created successfully", "data": { "_id": "<reviewId>" } }
    ```

Product Blog (Long-form description)

- `GET /api/products/:id/blog`
  - Returns blog content for a product (if published).
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "_id": "<blogId>",
        "title": "Mona Pullover Hoodie: Fit, Feel, Styling",
        "contentFormat": "markdown",
        "content": "## Overview\nThis hoodie blends soft fleece with..."
      }
    }
    ```
- `POST /api/products/:id/blog` (protected)
  - Create or upsert blog content.
  - Response:
    ```json
    { "success": true, "message": "Blog content saved", "data": { "_id": "<blogId>" } }
    ```
- `PUT /api/products/:id/blog` (protected)
  - Update existing blog content.
  - Body example:

    ```json
    {
      "title": "Mona Pullover Hoodie: Fit, Feel, Styling",
      "excerpt": "A deep dive into comfort, sizing, and styling.",
      "contentFormat": "markdown",
      "content": "## Overview\nThis hoodie blends soft fleece with...",
      "heroImage": {
        "url": "https://images.unsplash.com/...",
        "alt": "Hero image"
      },
      "images": [
        { "url": "https://images.unsplash.com/...", "alt": "Detail shot" }
      ],
      "isPublished": true
    }
    ```
  - Response:
    ```json
    { "success": true, "message": "Blog content updated", "data": { "_id": "<blogId>" } }
    ```

Newsletter

- `POST /api/newsletter/subscribe`
  - Body:

    ```json
    { "email": "jane@example.com", "source": "footer_form" }
    ```

  - Response is success even if already subscribed.
  - Response:
    ```json
    { "success": true, "message": "Subscribed successfully" }
    ```

Payments

- Stripe (create PaymentIntent)
  - `POST /api/payments/stripe/intent`
  - Body:
  
    ```json
    {
      "amount": 49.99,
      "currency": "usd",
      "description": "Order #1234",
      "receiptEmail": "buyer@example.com",
      "metadata": { "orderId": "1234" }
    }
    ```
  - Response includes `clientSecret` for Stripe.js.
  - Response:
    ```json
    { "success": true, "data": { "id": "<intentId>", "clientSecret": "<clientSecret>" } }
    ```
- Paystack
  - `POST /api/payments/paystack/initialize`
    - Body:
      ```json
      {
        "email": "buyer@example.com",
        "amount": 15000,
        "currency": "NGN",
        "callbackUrl": "https://your-frontend.com/paystack/callback",
        "metadata": { "orderId": "1234" }
      }
      ```
    - Response:
      ```json
      {
        "success": true,
        "data": {
          "authorization_url": "https://checkout.paystack.com/...",
          "access_code": "<accessCode>",
          "reference": "<reference>"
        }
      }
      ```
  - `GET /api/payments/paystack/verify/:reference`
    - Use the `reference` returned by Paystack or the callback query string.
    - Response:
      ```json
      { "success": true, "data": { "status": "success", "reference": "<reference>" } }
      ```

Dashboard Overview (single payload for account page)

- `GET /api/dashboard/overview` (protected)
  - Returns:
    - `user` (id, name, email)
    - `newsletter` (subscribed, email)
    - `addressBook` (list of addresses)
    - `recentOrders` (latest 5)
    - `recentlyOrdered` (recent order items)
    - `wishlist` (latest 5)
    - `compareList` (latest 5)
    - `reviewSummary` (count)
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "user": { "id": "<userId>", "name": "Jane Doe", "email": "jane@example.com" },
        "newsletter": { "subscribed": true, "email": "jane@example.com" },
        "addressBook": [{ "id": "<addressId>", "label": "Home", "line1": "6146 Honey Bluff Parkway" }],
        "recentOrders": [{ "id": "<orderId>", "orderNumber": "00000001", "status": "pending", "total": 896.6 }],
        "recentlyOrdered": [{ "name": "Arc Lounge Chair", "price": 399.99 }],
        "wishlist": [{ "id": "<wishlistId>", "product": { "id": "<productId>", "name": "Arc Lounge Chair" } }],
        "compareList": [{ "id": "<compareId>", "product": { "id": "<productId>", "name": "Ridge Dining Table" } }],
        "reviewSummary": { "count": 2 }
      }
    }
    ```

Frontend Integration Tips

- Store JWT in memory or secure storage and attach to protected requests.
- For dashboard, call only `/api/dashboard/overview` to populate the account page.
- For Paystack, send user to `authorization_url` from initialize response.
- For Stripe, use Stripe.js with the `clientSecret` from PaymentIntent.
