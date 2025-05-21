# Use Node.js LTS version
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NX_VERBOSE_LOGGING=true

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies with legacy peer deps to handle peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the backend
RUN cd apps/backend && npm install && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package*.json ./

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"] 