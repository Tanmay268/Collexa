# 🚀 Deployment Guide for Collexa

This guide will help you deploy Collexa to production in under 30 minutes.

## Prerequisites Checklist

- [ ] GitHub account
- [ ] MongoDB Atlas account (free)
- [ ] Gmail account (for SMTP)
- [ ] Railway or Render account (free)
- [ ] Vercel account (free, optional for frontend)

## Step 1: Database Setup (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Click "Build a Database"
4. Choose **FREE** M0 cluster
5. Cloud Provider: **AWS**, Region: **Mumbai (ap-south-1)**
6. Cluster Name: `collexa-cluster`
7. Click "Create"

### Configure Database Access

1. Go to **Database Access** → **Add New Database User**
   - Username: `collexa-admin`
   - Password: Generate secure password (save it!)
   - Role: **Atlas admin**

2. Go to **Network Access** → **Add IP Address**
   - Choose: **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Click "Confirm"

### Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string:
   ```
   mongodb+srv://collexa-admin:<password>@collexa-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `/collexa`
   ```
   mongodb+srv://collexa-admin:YOUR_PASSWORD@collexa-cluster.xxxxx.mongodb.net/collexa?retryWrites=true&w=majority
   ```

## Step 2: Email Setup (Gmail)

1. **Create Gmail Account** (or use existing)
   - Email: `collexa.vit@gmail.com` (or similar)

2. **Enable 2-Step Verification**
   - Google Account → Security → 2-Step Verification → Turn On

3. **Generate App Password**
   - Google Account → Security → App Passwords
   - App: **Mail**
   - Device: **Other** (name it "Collexa")
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
   - **Save this!** You'll need it for EMAIL_PASS

## Step 3: Backend Deployment (Railway)

### Option A: Railway (Recommended)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Authorize Railway to access your repo
5. Select your Collexa repository

### Configure Environment Variables

In Railway:
1. Go to **Variables** tab
2. Add these variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://collexa-admin:YOUR_PASSWORD@collexa-cluster.xxxxx.mongodb.net/collexa?retryWrites=true&w=majority
JWT_SECRET=super_secret_random_32_characters_minimum_change_this
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=collexa.vit@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=Collexa <noreply@collexa.com>
FRONTEND_URL=http://localhost:5173
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Railway will automatically deploy
4. Get your backend URL from **Settings** → **Domains**
   - Example: `collexa-backend-production.up.railway.app`

### Option B: Render (Alternative)

1. Go to https://render.com
2. Sign up with GitHub
3. Click **"New"** → **"Web Service"**
4. Connect your repository
5. Configure:
   - Name: `collexa-backend`
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

6. Add same environment variables as Railway
7. Deploy

## Step 4: Frontend Deployment (Vercel)

1. Complete the frontend setup (see FRONTEND_SETUP.md)
2. Go to https://vercel.com
3. Sign up with GitHub
4. Click **"New Project"**
5. Import your repository
6. Configure:
   - Framework: **Vite**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

7. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app/api
   ```

8. Deploy

## Step 5: Testing Deployment

### Test Backend Health

```bash
curl https://your-backend-url.up.railway.app/api/health
```

Expected response:
```json
{"status":"ok","message":"Collexa API is running"}
```

### Test Signup Flow

```bash
curl -X POST https://your-backend-url.up.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@vitstudent.ac.in",
    "password": "Test1234"
  }'
```

Check your email for OTP!

## Step 6: Create Admin Account

1. Sign up normally through the app
2. Verify your email with OTP
3. Go to MongoDB Atlas:
   - Databases → Browse Collections
   - Select `collexa` database → `users` collection
   - Find your user document
   - Click "Edit"
   - Change `isAdmin: false` to `isAdmin: true`
   - Update

Now you can access `/admin` routes!

## Step 7: Custom Domain (Optional)

### Buy Domain

- Namecheap: ₹500-800/year
- GoDaddy: Similar pricing
- Domain: `collexa.in` or `collexa.co.in`

### Configure DNS

**For Frontend (Vercel):**
1. Vercel → Settings → Domains → Add `collexa.in`
2. Add DNS records at your registrar:
   ```
   Type    Name    Value
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com
   ```

**For Backend (Railway):**
1. Railway → Settings → Custom Domain → `api.collexa.in`
2. Add DNS record:
   ```
   Type    Name    Value
   CNAME   api     your-app.up.railway.app
   ```

SSL certificates are automatic!

## Step 8: Monitoring

### Railway Logs

- Dashboard → Deployments → View Logs
- Monitor errors, requests, startup

### MongoDB Atlas Metrics

- Clusters → Metrics
- Watch connections, operations, storage

### Uptime Monitor (Optional)

1. Sign up at https://uptimerobot.com (free)
2. Add Monitor:
   - Type: HTTPS
   - URL: `https://your-backend-url/api/health`
   - Interval: 5 minutes
   - Email alerts: Your email

## Troubleshooting

### Backend won't start

**Check logs for:**
- MongoDB connection error → Verify MONGODB_URI
- Email error → Check EMAIL_USER and EMAIL_PASS
- Port already in use → Railway handles this automatically

### OTP email not received

1. Check spam folder
2. Verify EMAIL_PASS is correct (16 chars from App Password)
3. Check Gmail hasn't blocked the app
4. Test email in Railway logs

### CORS errors

1. Update FRONTEND_URL in backend environment:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
2. Redeploy backend

### Images not loading

1. Images are stored locally on Railway
2. Make sure `/uploads` directory exists
3. Check file permissions
4. Railway provides ephemeral storage (images lost on redeploy)
5. For production, consider Cloudinary (later enhancement)

## Production Checklist

- [ ] MongoDB Atlas cluster running
- [ ] Database user created
- [ ] Network access configured (0.0.0.0/0)
- [ ] Gmail app password generated
- [ ] Backend deployed (Railway/Render)
- [ ] All environment variables set
- [ ] Backend health check returns 200
- [ ] OTP email received
- [ ] Frontend deployed (Vercel)
- [ ] API_URL configured in frontend
- [ ] Admin account created
- [ ] Test full signup flow
- [ ] Test listing creation
- [ ] Test image upload
- [ ] Monitor logs

## Cost Breakdown

| Service | Tier | Cost |
|---------|------|------|
| MongoDB Atlas | M0 Free | ₹0 |
| Railway | Free | ₹0 |
| Vercel | Free | ₹0 |
| Gmail SMTP | Free | ₹0 |
| Domain (optional) | Paid | ₹500-800/year |

**Total Monthly Cost:** ₹0 (or ₹67/month with domain)

## Scaling Limits (Free Tier)

- MongoDB: 512MB storage
- Railway: 500 hours/month execution
- Vercel: 100GB bandwidth
- Suitable for: **500-1000 active users**

When to upgrade:
- MongoDB > 512MB → Atlas M10 (₹2000/month)
- Railway > 500 hrs → Pro ($5/month)
- Vercel > 100GB → Pro ($20/month)

## Next Steps

1. ✅ Deploy backend
2. ✅ Create admin account
3. ✅ Test all features
4. 📱 Launch at your college!
5. 📊 Monitor usage
6. 🚀 Scale as needed

## Support

If stuck:
1. Check Railway/Render logs
2. Verify all environment variables
3. Test endpoints with Postman
4. Check MongoDB connection
5. Verify Gmail app password

Backend is production-ready! Just follow these steps carefully.

Good luck with your launch! 🎉
