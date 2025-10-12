# Flutter Multi-Platform Build Dockerfile
# Supports Android APK, App Bundle, and Web builds
# Place this in flutter_frontend/Dockerfile

FROM ghcr.io/cirruslabs/flutter:3.16.0 AS builder

WORKDIR /app

# Copy pubspec files first for better caching
COPY pubspec.* ./

# Get Flutter dependencies
RUN flutter pub get

# Copy the entire project
COPY . .

# Build for multiple platforms
RUN flutter build apk --release
RUN flutter build appbundle --release  
RUN flutter build web --release

# Production stage for web (using nginx)
FROM nginx:alpine AS web

# Copy built web app
COPY --from=builder /app/build/web /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Development stage (default)
FROM ghcr.io/cirruslabs/flutter:3.16.0 AS development

# Install additional dependencies for Android builds
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME for Android builds
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

WORKDIR /app

# Copy pubspec files first for better caching
COPY pubspec.* ./

# Get Flutter dependencies
RUN flutter pub get

# Copy the entire project
COPY . .

# Default command for development
CMD ["flutter", "run", "--release"]