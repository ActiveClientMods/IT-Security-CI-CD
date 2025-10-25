ARG NODE_VERSION=20
ARG ALPINE_VERSION=3.21

# ---------- Build Stage ----------
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

# Install security updates and required packages
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Enable corepack and install pnpm (use corepack for security and version pinning)
RUN corepack enable && \
    corepack prepare pnpm@10.19.0 --activate

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

# Install security updates, required packages, and remove cache
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    dumb-init \
    wget \
    && rm -rf /var/cache/apk/*

# Set environment variables early
ENV NODE_ENV=production \
    PORT=3000 \
    NODE_OPTIONS="--max-old-space-size=512"

# Enable corepack and install pnpm (same version as in builder)
RUN corepack enable && \
    corepack prepare pnpm@10.19.0 --activate

# Create and use non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

# Create necessary directories for tmpfs mounts
RUN mkdir -p /tmp /app/.npm && \
    chown -R appuser:appgroup /tmp /app/.npm

# Drop privileges
USER appuser

# Expose port
EXPOSE 3000

# Health check (use wget — smaller and built-in)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the app
CMD ["node", "dist/main"]