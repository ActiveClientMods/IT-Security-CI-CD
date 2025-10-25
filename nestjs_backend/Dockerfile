ARG NODE_VERSION=25
ARG ALPINE_VERSION=3.21

# ---------- Build Stage ----------
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

# Set working directory
WORKDIR /app

# Install pnpm (use corepack for security and version pinning)
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

# Copy only package files first (leverage Docker layer caching)
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the TypeScript project
RUN pnpm run build

# Remove devDependencies to reduce image size
RUN pnpm prune --prod


# ---------- Production Stage ----------
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}

# Set environment variables early
ENV NODE_ENV=production \
    PORT=3000

# Install pnpm (same version as in builder)
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

# Create and use non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Drop privileges
USER appuser

# Expose port
EXPOSE 3000

# Health check (use wget — smaller and built-in)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://localhost:3000/health || exit 1

# Start the app
CMD ["node", "dist/main"]
