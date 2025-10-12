# Flutter Mobile Development Dockerfile
# This container is used for building Android APKs and development
# Place this in flutter_frontend/Dockerfile

FROM ghcr.io/cirruslabs/flutter:latest

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

# Pre-download Android dependencies and build tools
RUN flutter doctor --android-licenses || true
RUN flutter precache --android

# Default command for development
CMD ["flutter", "run", "--release"]

# Build commands available:
# docker run --rm -v $(pwd):/app flutter-app flutter build apk --release
# docker run --rm -v $(pwd):/app flutter-app flutter build appbundle --release
# docker run --rm -v $(pwd):/app flutter-app flutter test