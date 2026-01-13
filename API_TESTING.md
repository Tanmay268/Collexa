# API Testing Guide

Quick reference for testing the Collexa API endpoints.

## Base URL

Development: `http://localhost:5000/api`
Production: `https://your-backend-url.up.railway.app/api`

## 1. Health Check

```bash
curl http://localhost:5000/api/health
```

Expected: `{"status":"ok","message":"Collexa API is running"}`

## 2. Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "email": "rahul@vitstudent.ac.in",
    "password": "SecurePass123",
    "phone": "9876543210"
  }'
```

Expected: OTP sent to email

## 3. Verify OTP

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rahul@vitstudent.ac.in",
    "otp": "123456",
    "name": "Rahul Sharma",
    "password": "SecurePass123",
    "phone": "9876543210"
  }'
```

Expected: `{"success":true,"token":"...","user":{...}}`

## 4. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rahul@vitstudent.ac.in",
    "password": "SecurePass123"
  }'
```

Save the token from response!

## 5. Get Current User

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 6. Create Listing

```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=Engineering Mathematics Textbook" \
  -F "description=Brand new condition. Used for one semester only." \
  -F "category=Books" \
  -F "condition=Like New" \
  -F "price=450" \
  -F "listingType=sell" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

## 7. Browse Listings

```bash
# All listings
curl http://localhost:5000/api/listings

# With filters
curl "http://localhost:5000/api/listings?category=Books&minPrice=0&maxPrice=1000"

# Search
curl "http://localhost:5000/api/listings?search=mathematics"
```

## 8. View Listing Details

```bash
curl http://localhost:5000/api/listings/LISTING_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 9. Get My Listings

```bash
curl http://localhost:5000/api/listings/my-listings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 10. Report Listing

```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "LISTING_ID",
    "reason": "Spam",
    "description": "This listing is posted multiple times"
  }'
```

## 11. Admin - Get Stats

```bash
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## 12. Admin - Get All Reports

```bash
curl "http://localhost:5000/api/admin/reports?status=pending" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## Using Postman

1. Import as collection
2. Create environment variable: `base_url = http://localhost:5000/api`
3. Create variable: `token` (set after login)
4. Use `{{base_url}}` and `{{token}}` in requests

## Common Response Codes

- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (not admin or not owner)
- 404: Not Found
- 409: Conflict (duplicate email/report)
- 429: Too Many Requests (rate limit)
- 500: Server Error

## Testing Checklist

- [ ] Health check works
- [ ] Signup sends OTP email
- [ ] OTP verification creates user
- [ ] Login returns valid JWT
- [ ] Get current user works
- [ ] Create listing with images
- [ ] Browse listings (public)
- [ ] View listing details (requires login)
- [ ] Search & filter works
- [ ] Report listing
- [ ] Admin endpoints (with admin account)
- [ ] Auto-expiry (wait 30 days or manually update DB)

## Tips

1. Save token after login: `export TOKEN="your_token_here"`
2. Use in requests: `-H "Authorization: Bearer $TOKEN"`
3. Check server logs for errors
4. Verify MongoDB Atlas has data
5. Test email delivery (check spam)
