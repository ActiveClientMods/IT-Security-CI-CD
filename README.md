# Vulnerable Express API - CI/CD Test Project

This is an intentionally vulnerable Node.js/TypeScript Express API designed to test enterprise CI/CD security scanning tools.

## ⚠️ WARNING

This project contains intentional security vulnerabilities for testing purposes. **DO NOT use this code in production!**

## Known Vulnerabilities

### Dependencies

- Old versions of Express, Lodash, Axios with known CVEs
- Outdated npm packages

### Code Issues

- SQL Injection patterns
- XSS vulnerabilities
- Hardcoded secrets
- Plain text password storage
- Insecure deserialization
- Path traversal
- Information disclosure

### Infrastructure

- Insecure Docker configuration
- Missing security contexts in Kubernetes
- No resource limits

## Setup

```bash
npm install
npm run build
npm test
npm start
```
