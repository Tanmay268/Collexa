# ======================
# FRONTEND BUILD
# ======================
FROM node:20-alpine AS client-build

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy all client files
COPY client/ .

# Build the frontend
RUN npm run build

# ======================
# BACKEND
# ======================
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install production dependencies
RUN npm install --production

# Copy server files
COPY server/ .

# Copy frontend build into backend public folder
COPY --from=client-build /app/client/dist ./public

# Create uploads directory
RUN mkdir -p uploads

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]