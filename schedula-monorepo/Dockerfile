# Use Node.js LTS version
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NX_VERBOSE_LOGGING=true

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies with legacy peer deps to handle peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the backend with verbose logging
RUN npx nx build backend --configuration=production --verbose

# Production stage
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/dist/apps/backend ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"] 