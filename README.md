# Collexa - College Marketplace Platform

A full-stack marketplace platform exclusively for college students to buy, sell, and rent items within their campus community.

## 🎯 Features

- **Verified Student Access**: Only students with @vitstudent.ac.in email can register
- **Email OTP Verification**: Secure signup with 6-digit OTP
- **Marketplace**: Browse, search, and filter listings by category, price, type
- **Direct Contact**: Email/phone of sellers visible only to logged-in users
- **Listing Management**: Create, edit, delete, and reactivate listings
- **Report System**: Flag inappropriate listings for admin review
- **Admin Panel**: Full dashboard for user/listing/report management
- **Auto-Expiry**: Listings automatically expire after 30 days
- **Image Upload**: Support for multiple images per listing (max 5)
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer (Gmail SMTP)
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **Cron Jobs**: node-cron (auto-expire listings)

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## 📁 Project Structure

```
collexa-project/
├── server/                 # Backend
│   ├── config/            # DB & Email configuration
│   ├── models/            # Mongoose schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Auth, validation, upload, etc.
│   ├── utils/             # Helper functions
│   ├── cron/              # Scheduled jobs
│   ├── uploads/           # Image storage
│   ├── .env.example       # Environment variables template
│   ├── package.json
│   └── server.js          # Entry point
│
└── client/                # Frontend (React)
    ├── public/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Page-level components
    │   ├── context/      # State management
    │   ├── services/     # API calls
    │   ├── utils/        # Helper functions
    │   └── App.jsx       # Root component
    ├── package.json
    └── vite.config.js
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- Gmail account (for SMTP)

### Backend Setup

1. **Navigate to server directory**:
```bash
cd server
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key_32_chars_minimum
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_specific_password
FRONTEND_URL=http://localhost:5173
```

4. **Start development server**:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**:
```bash
cd client
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

4. **Start development server**:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📝 Environment Variables Guide

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string and add to `.env`

### Gmail SMTP Setup

1. Enable 2-Step Verification on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate app password for "Mail"
4. Add the 16-character password to `.env`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Request OTP
- `POST /api/auth/verify-otp` - Verify & create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/resend-otp` - Resend OTP

### Listings
- `GET /api/listings` - Browse all listings (public)
- `POST /api/listings` - Create listing (auth required)
- `GET /api/listings/:id` - View listing details (auth required)
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `POST /api/listings/:id/reactivate` - Reactivate expired listing
- `GET /api/listings/my-listings` - Get user's listings

### Reports
- `POST /api/reports` - Report a listing
- `GET /api/reports/my-reports` - Get user's reports

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/listings` - List all listings
- `GET /api/admin/reports` - List all reports
- `PUT /api/admin/reports/:id/review` - Review report
- `GET /api/admin/stats` - Dashboard statistics

### Users
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password

## 🗄️ Database Schema

### Users
- name, email (@vitstudent.ac.in), password (hashed)
- phone, year, department (optional)
- isVerified, isAdmin flags
- Timestamps

### Listings
- seller (ref: User), title, description
- category, condition, price, listingType (sell/rent)
- images array, status (active/expired/deleted)
- expiresAt (auto-set to +30 days)
- viewCount, reportCount
- Timestamps

### Reports
- listing (ref: Listing), reportedBy (ref: User)
- reason, description, status
- reviewedBy, reviewNote, reviewedAt
- Timestamps

### OTPs
- email, otp (6 digits)
- createdAt with TTL index (10 min expiry)

## 🔒 Security Features

- ✅ Email domain validation (@vitstudent.ac.in only)
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT authentication (7-day expiry)
- ✅ Rate limiting on auth/OTP endpoints
- ✅ Input validation & sanitization
- ✅ NoSQL injection prevention
- ✅ File type & size validation
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Auto-expiry for listings

## 📊 Admin Features

1. **Dashboard**: View platform statistics
2. **User Management**: List all registered users
3. **Listing Management**: View/delete any listing
4. **Report Moderation**: Review and act on reports
5. **Analytics**: Listings by category, user counts

### Creating Admin Account

After signup, manually update user in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-admin@vitstudent.ac.in" },
  { $set: { isAdmin: true } }
)
```

## 🚢 Deployment

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect Railway/Render to repository
3. Set environment variables
4. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Connect Vercel to repository
3. Set `VITE_API_URL` environment variable
4. Deploy

### Database (MongoDB Atlas)

- Already cloud-hosted
- No deployment needed

## 💰 Estimated Costs

### Development/MVP (Free)
- MongoDB Atlas: Free (M0, 512MB)
- Railway/Render: Free tier
- Vercel: Free tier
- Gmail SMTP: Free
- **Total: ₹0/month**

### Production (Optional Domain)
- Domain: ₹800/year (~₹67/month)
- Everything else: Free tier sufficient for 500-1000 users
- **Total: ~₹67/month**

## 🎯 Future Enhancements

- In-app messaging system
- Premium listing features
- Payment gateway integration
- Mobile app (React Native)
- Multi-college support
- Advanced analytics
- Rental insurance
- Escrow service

## 📄 License

MIT License - Feel free to use for your college!

## 👨‍💻 Author

Built for VIT students with ❤️

## 🤝 Contributing

This is a college project. Fork and customize for your institution!

## 📞 Support

For issues, check:
1. MongoDB connection string is correct
2. Gmail app password is set
3. Environment variables are loaded
4. Ports 5000 and 5173 are available

## 🎓 Educational Purpose

This project demonstrates:
- Full-stack development with MERN stack
- REST API design
- JWT authentication
- File upload handling
- Email integration
- Admin dashboard
- Security best practices
- Deployment workflow

Perfect for learning and launching at your campus!
