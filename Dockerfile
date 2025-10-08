# SECURITY: Using old Node.js version
FROM node:14-alpine

# SECURITY: Running as root
WORKDIR /app

# SECURITY: Copying everything including sensitive files
COPY package*.json ./

# SECURITY: npm install instead of npm ci
RUN npm install --production

COPY . .

RUN npm run build

# SECURITY: No non-root user
# SECURITY: Exposing port information
EXPOSE 3000

# SECURITY: No healthcheck
CMD ["node", "dist/index.js"]