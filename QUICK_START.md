# 🚀 Quick Start Guide - Collexa

Get Collexa running in 10 minutes!

## What's Included

✅ **Complete Backend** (100% functional)
- All API endpoints (23 total)
- MongoDB schemas (4 models)
- Authentication (JWT + OTP)
- File upload system
- Email integration
- Admin panel
- Security middleware
- Cron jobs
- Rate limiting

⚠️ **Frontend Scaffold** (needs completion)
- Package.json configured
- Vite + Tailwind setup
- Folder structure created
- See `client/FRONTEND_SETUP.md` for details

## Prerequisites

Install these first:
1. **Node.js 18+**: https://nodejs.org
2. **npm** (comes with Node.js)
3. **Git**: https://git-scm.com

## Step 1: Extract & Navigate

```bash
# Extract the zip file
unzip collexa-project.zip
cd collexa-project
```

## Step 2: Backend Setup (5 minutes)

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Step 3: Configure Environment

Edit `server/.env` with your credentials:

```env
# Required: MongoDB Atlas
MONGODB_URI=mongodb+srv://your-user:your-password@cluster.mongodb.net/collexa?retryWrites=true&w=majority

# Required: JWT Secret (generate random string)
JWT_SECRET=your_super_secret_32_character_random_string

# Required: Gmail SMTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Optional: Keep defaults
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### How to Get These:

**MongoDB URI:**
1. Sign up at https://mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. See DEPLOYMENT.md for detailed steps

**JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Gmail App Password:**
1. Enable 2FA on Gmail
2. Google Account → Security → App Passwords
3. Generate password for "Mail"
4. Use the 16-character password

## Step 4: Start Backend

```bash
# From server directory
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
✅ Email server ready
✅ Cron jobs started
🚀 Server running on port 5000
```

## Step 5: Test API

Open new terminal:

```bash
# Health check
curl http://localhost:5000/api/health

# Expected: {"status":"ok","message":"Collexa API is running"}
```

## Step 6: Test Signup Flow

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@vitstudent.ac.in",
    "password": "Test1234"
  }'
```

Check your email for OTP!

## Step 7: Frontend Setup (Optional)

The backend works standalone. For frontend:

```bash
cd client
npm install
npm run dev
```

See `client/FRONTEND_SETUP.md` for complete frontend guide.

## Testing Without Frontend

Use Postman, Insomnia, or cURL to test APIs:

**Import Postman Collection:**
- See `API_TESTING.md` for all endpoints
- Create environment with `base_url` = `http://localhost:5000/api`
- Test signup → verify → login → create listing flow

## File Structure

```
collexa-project/
├── README.md              ← Start here (full documentation)
├── DEPLOYMENT.md          ← Deploy to production
├── API_TESTING.md         ← Test all endpoints
├── server/                ← Backend (COMPLETE)
│   ├── .env.example       ← Copy to .env
│   ├── package.json
│   ├── server.js          ← Entry point
│   ├── config/           ← DB & email setup
│   ├── models/           ← MongoDB schemas
│   ├── controllers/      ← Business logic
│   ├── routes/           ← API routes
│   ├── middleware/       ← Auth, validation, etc.
│   ├── utils/            ← Helpers
│   ├── cron/             ← Scheduled jobs
│   └── uploads/          ← Image storage
└── client/               ← Frontend (scaffold)
    ├── FRONTEND_SETUP.md ← Setup guide
    ├── package.json
    └── src/              ← React app (needs completion)
```

## Common Issues

### Port 5000 already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Or change PORT in .env to 5001
```

### MongoDB connection failed
- Check MONGODB_URI is correct
- Verify IP whitelist: 0.0.0.0/0
- Test connection string in MongoDB Compass

### OTP email not received
- Check EMAIL_USER and EMAIL_PASS
- Verify it's app-specific password (not regular password)
- Check spam folder
- Ensure 2FA is enabled on Gmail

### Module not found
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

## What Works Right Now

✅ User signup with OTP verification
✅ Login with JWT tokens
✅ Create listings with image upload
✅ Browse/search/filter listings
✅ View listing details (seller contact)
✅ Report system
✅ Admin panel APIs
✅ Auto-expire after 30 days
✅ Rate limiting
✅ Security middleware

## Next Steps

1. ✅ **Backend running?** → Test with Postman
2. 📱 **Ready to launch?** → See DEPLOYMENT.md
3. 🎨 **Build frontend?** → See client/FRONTEND_SETUP.md
4. 📚 **Learn APIs?** → See API_TESTING.md
5. 📖 **Full docs?** → See README.md

## Need Help?

Check these files:
- `README.md` - Complete documentation
- `DEPLOYMENT.md` - Production deployment
- `API_TESTING.md` - Test all endpoints
- `client/FRONTEND_SETUP.md` - Frontend guide

## Quick Commands

```bash
# Start backend
cd server && npm run dev

# Test health
curl http://localhost:5000/api/health

# Create admin (after signup)
# In MongoDB Atlas: Set isAdmin = true

# View logs
# Check terminal where server is running
```

## Success Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas account created
- [ ] Gmail app password generated
- [ ] Dependencies installed (`npm install`)
- [ ] .env file configured
- [ ] Server starts without errors
- [ ] Health check returns 200
- [ ] Signup sends OTP email
- [ ] Can login and get JWT token

Once all checked, you're ready to deploy or build frontend!

## Support

The backend is production-ready and fully functional.
All API endpoints are tested and working.
Frontend is optional - backend works standalone!

**Good luck with Collexa! 🎉**
