# Use Node.js 20 Alpine as the base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install global dependencies
RUN npm install -g @nestjs/cli

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the backend
WORKDIR /app/apps/backend
RUN npm install --legacy-peer-deps && \
    npm install --save-dev webpack webpack-cli --legacy-peer-deps && \
    npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package*.json ./

# Install production dependencies only
RUN npm install --omit=dev --legacy-peer-deps

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"] 