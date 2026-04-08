# Collexa – College Marketplace Platform

Collexa is a full-stack marketplace platform designed specifically for college students. It enables students to buy, sell, and rent items within their campus community in a secure and organized manner.

## Features

- Verified Student Access: Only users with a valid college email address can register.
- Email OTP Verification: A secure signup process using a one-time password.
- Marketplace Functionality: Users can browse, search, and filter listings based on category, price, and type.
- Direct Communication: Contact details of sellers are visible only to logged-in users.
- Listing Management: Users can create, update, delete, and reactivate listings.
- Reporting System: Users can report inappropriate listings for administrative review.
- Admin Dashboard: Administrators can manage users, listings, and reports.
- Automatic Expiry: Listings expire automatically after 30 days.
- Image Upload Support: Users can upload multiple images per listing.
- Responsive Design: The platform is optimized for both desktop and mobile devices.

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for email services
- Multer for file uploads
- Security tools such as Helmet, CORS, and rate limiting
- node-cron for scheduled tasks

### Frontend
- React.js
- React Router
- Axios for API communication
- Tailwind CSS for styling
- Vite as the build tool

## Project Structure

The project is divided into two main parts:
- Server (Backend): Handles database operations, APIs, authentication, and business logic.
- Client (Frontend): Handles user interface and user interactions.

## Setup Instructions

### Prerequisites
- Node.js and npm
- MongoDB Atlas account
- Gmail account for email services

### Backend Setup
1. Navigate to the server directory.
2. Install dependencies.
3. Configure environment variables such as database connection, JWT secret, and email credentials.
4. Start the development server.

### Frontend Setup
1. Navigate to the client directory.
2. Install dependencies.
3. Configure the API base URL.
4. Start the development server.

## API Overview

### Authentication
- User registration and OTP verification
- Login and session management

### Listings
- Create, view, update, delete, and reactivate listings

### Reports
- Report listings and view submitted reports

### Admin
- Manage users, listings, and reports
- View platform statistics

### User Management
- Update profile and change password

## Database Design

- Users: Stores user details, verification status, and roles.
- Listings: Stores item details, pricing, images, and status.
- Reports: Stores complaints about listings.
- OTPs: Stores temporary verification codes with expiry.

## Security Measures

- Email domain validation
- Password hashing
- JWT-based authentication
- Rate limiting for sensitive endpoints
- Input validation and sanitization
- Protection against common vulnerabilities such as injection attacks
- Secure file upload validation
- Use of security headers

## Admin Capabilities

- Monitor platform statistics
- Manage users and listings
- Review reported content
- Perform moderation actions

## Deployment

- Backend is deployed using render.
- Frontend is deployed using Vercel.
- Database is hosted on MongoDB Atlas.

## Future Improvements

- In-app messaging between users
- Premium listing options
- Integration of payment gateways
- Mobile application development
- Support for multiple colleges
- Advanced analytics and reporting
- Additional security features for rentals

## Purpose

This project demonstrates practical implementation of full-stack development concepts, including API design, authentication, database management, security practices, and deployment workflows. It is suitable for academic use and real-world application within a college environment.
