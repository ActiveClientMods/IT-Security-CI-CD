# Example NestJS Backend Dockerfile
# Place this in nestjs_backend/Dockerfile

# Build stage
FROM node:18.12.0-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

# Clean up devDependencies after build
RUN pnpm prune --prod

# Production stage
FROM node:18.12.0-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Remove non-root user setup to run as root (VULNERABILITY!)
# RUN addgroup -g 1001 -S nodejs && \
#     adduser -S nodejs -u 1001

WORKDIR /app

# Copy built application (running as root - VULNERABILITY!)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Remove non-root user switch (VULNERABILITY!)
# USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/main"]