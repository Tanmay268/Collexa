# Collexa Deployment Guide

This project is now set up to use Firebase Firestore as the database and to deploy as two Vercel projects:

1. `server/` as the backend API
2. `client/` as the frontend website

That is the cleanest deployment model for this repo because the frontend is a Vite app and the backend is an Express API.

## 1. Firebase setup

1. Create a Firebase project in the Firebase console.
2. Enable `Firestore Database` in production mode.
3. In `Project settings` -> `Service accounts`, generate a new private key.
4. Keep the JSON file open. You need:
   - `project_id`
   - `client_email`
   - `private_key`

## 2. Cloudinary setup

1. Create a Cloudinary account.
2. Copy:
   - `cloud_name`
   - `api_key`
   - `api_secret`

## 3. Email setup for OTP

Use any SMTP provider. Gmail with an App Password is the easiest option.

Required values:

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`

## 4. Local environment files

Create these files:

- `server/.env`
- `client/.env`

Use the examples already added in:

- `server/.env.example`
- `client/.env.example`

Minimum backend env values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=7d
ENABLE_CRON=true

FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
EMAIL_FROM="Collexa <your-email@example.com>"

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

Frontend env:

```env
VITE_API_URL=http://localhost:5000
```

## 5. Local install and run

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## 6. Deploy backend to Vercel

Create a new Vercel project and set the root directory to `server`.

Framework:

- Use `Other`

Important files already added:

- `server/api/index.js`
- `server/vercel.json`

Set these backend environment variables in Vercel:

- `NODE_ENV=production`
- `FRONTEND_URL=https://your-frontend-domain.vercel.app`
- `JWT_SECRET`
- `JWT_EXPIRE=7d`
- `ENABLE_CRON=false`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Notes:

- Keep the `FIREBASE_PRIVATE_KEY` value quoted and preserve `\n`.
- `ENABLE_CRON=false` is recommended on Vercel because this backend runs as serverless functions.
- Listing expiry still works because the API syncs expired listings during normal requests.

After deploy, note your backend URL, for example:

```text
https://collexa-api.vercel.app
```

Test:

```text
https://collexa-api.vercel.app/api/health
```

## 7. Deploy frontend to Vercel

Create a second Vercel project and set the root directory to `client`.

Framework:

- `Vite`

Important file already added:

- `client/vercel.json`

Set this frontend environment variable:

```env
VITE_API_URL=https://collexa-api.vercel.app
```

Deploy. Your site will be available at a URL like:

```text
https://collexa-web.vercel.app
```

## 8. Final production wiring

After frontend deploy succeeds:

1. Copy the real frontend URL.
2. Open the backend Vercel project.
3. Update `FRONTEND_URL` to the real frontend URL.
4. Redeploy the backend.

This is required so CORS accepts your frontend domain.

## 9. What changed technically

- MongoDB and Mongoose are no longer used by the runtime API.
- Firestore is now the database.
- OTP signup is supported in the frontend.
- The backend is exposed through `server/api/index.js` for Vercel.
- The frontend uses a Vercel SPA rewrite via `client/vercel.json`.

## 10. Known follow-up

Before deploying, regenerate lockfiles so dependencies match the new package manifest:

```bash
cd server
npm install

cd ../client
npm install
```

This is required because the checked-in backend lockfile still reflects the old MongoDB packages.
