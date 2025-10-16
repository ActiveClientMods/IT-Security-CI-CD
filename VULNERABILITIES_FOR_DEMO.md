# Intentional Vulnerabilities for CI/CD Pipeline Demonstration

This document lists all intentional security issues introduced to demonstrate the various security scanning tools in the pipeline.

## Summary of Introduced Vulnerabilities

### 1. Gitleaks - Secret Scanning Detection

**File:** `nestjs_backend/src/main.ts`

**Vulnerabilities:**

- Hardcoded database password: `MySecretP@ssw0rd123!`
- Hardcoded AWS secret key: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
- Hardcoded GitHub API token: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`

**Expected Detection:**

- ✅ Gitleaks will detect all three hardcoded secrets
- ✅ Pipeline will be blocked
- ✅ SARIF report uploaded to GitHub Security tab

---

### 2. OWASP Dependency-Check - Vulnerable Dependencies

**File:** `nestjs_backend/package.json`

**Vulnerable Packages Added:**

1. **lodash@4.17.15**

   - CVE-2020-8203 (High): Prototype Pollution
   - CVE-2019-10744 (Critical): Prototype Pollution

2. **axios@0.21.0**

   - CVE-2021-3749 (High): Regular Expression Denial of Service (ReDoS)

3. **express@4.17.1**

   - CVE-2022-24999 (High): Open Redirect
   - Multiple medium severity issues

4. **moment@2.29.1**
   - CVE-2022-31129 (High): Path Traversal
   - Deprecated package (maintenance mode)

**Expected Detection:**

- ✅ OWASP will identify all CVEs
- ⚠️ Warning about deprecated package (moment)
- ✅ Multiple HIGH and CRITICAL severity findings

---

### 3. CodeQL - Static Code Analysis

**File:** `nestjs_backend/src/app.controller.ts`

**Vulnerabilities:**

1. **SQL Injection (CWE-89)**

   ```typescript
   const query = `SELECT * FROM users WHERE id = ${userId}`;
   ```

   - Directly concatenating user input into SQL query
   - No parameterization or sanitization

2. **Command Injection (CWE-78)**
   ```typescript
   exec(command, (error: any, stdout: any) => {
     console.log(stdout);
   });
   ```
   - Executing arbitrary commands from user input
   - No input validation

**Expected Detection:**

- ✅ CodeQL will flag SQL injection vulnerability
- ✅ CodeQL will flag command injection vulnerability
- ✅ TypeScript linter errors for unsafe `any` types

---

### 4. Trivy - Container Image Scanning

**File:** `nestjs_backend/Dockerfile`

**Vulnerabilities:**

1. **Old Node.js Version**

   - Using `node:16.13.0-alpine` (released Nov 2021)
   - Multiple known CVEs in this version
   - Missing security patches

2. **Running as Root User**
   - Commented out non-root user creation
   - Container runs as root (UID 0)
   - Security best practice violation

**Expected Detection:**

- ✅ Trivy will detect OS package vulnerabilities in old Node.js
- ✅ Filesystem scan will show npm package issues
- ✅ Container image scan will identify base image CVEs

---

### 5. Checkov - Infrastructure as Code Security

**File:** `docker-compose.yml`

**Misconfigurations:**

1. **Hardcoded Secrets in Environment Variables**

   ```yaml
   environment:
     - DB_PASSWORD=MyHardcodedPassword123!
     - API_KEY=sk-1234567890abcdefghijklmnopqrstuvwxyz
   ```

2. **Privileged Mode Enabled**

   ```yaml
   privileged: true
   ```

   - Gives container root access to host
   - Major security risk

3. **No Resource Limits**

   - No memory limits defined
   - No CPU limits defined
   - Can lead to resource exhaustion

4. **Old PostgreSQL Version**

   - Using `postgres:12.0-alpine` (Oct 2019)
   - Multiple known CVEs

5. **Old Redis Version**

   - Using `redis:5.0.0-alpine` (Oct 2018)
   - Missing security updates

6. **Redis Without Password**

   - Removed `--requirepass` flag
   - Unauthenticated access possible

7. **Exposed Database Ports**
   - PostgreSQL exposed on 5432
   - Redis exposed on 6379
   - Should use internal networking only

**Expected Detection:**

- ✅ Checkov will flag hardcoded secrets
- ✅ Checkov will warn about privileged mode
- ✅ Checkov will detect missing resource limits
- ✅ Checkov will identify security misconfigurations

---

## Pipeline Stage Expected Results

### Stage 1: Initialize

- ✅ Detects changes in backend
- ✅ All files marked as changed

### Stage 2: Security Scanning

**Gitleaks:**

- ❌ FAIL - 3 secrets detected
- Pipeline should block

**OWASP Dependency Check:**

- ⚠️ WARNING - 10+ vulnerabilities
- 2-3 CRITICAL
- 4-5 HIGH
- Multiple MEDIUM

**CodeQL:**

- ❌ FAIL - 2+ security issues
- SQL Injection detected
- Command Injection detected

**Checkov:**

- ⚠️ WARNING - 7+ findings
- Hardcoded secrets
- Privileged containers
- Missing security controls

### Stage 3: Build & Compile

- ⚠️ May have linter warnings
- Build should succeed (if secrets are ignored)

### Stage 4: Docker Build & Scan

**Trivy Filesystem:**

- ⚠️ WARNING - Vulnerable dependencies
- Matches OWASP findings

**Trivy Container:**

- ⚠️ WARNING - Old Node.js base image
- 5-10 HIGH/CRITICAL findings

### Stage 5: Integration Tests

- May fail due to code issues
- Database connection issues possible

### Stage 6: SonarCloud

- ⚠️ Quality Gate may fail
- Code smells from vulnerabilities
- Security hotspots identified

### Stage 7: Security Summary

- ❌ CRITICAL findings present
- Automatic issue creation
- PR comment with detailed report

### Stage 8: Final Quality Gate

- ❌ FAIL - Critical issues found
- Pipeline blocked

---

## Presentation Talking Points

### 1. Multi-Layer Defense in Action

"As you can see, we introduced vulnerabilities across different layers, and our multi-tool approach caught them all."

### 2. Shift-Left Security

"The pipeline detected these issues before any code reached production - this is shift-left security in practice."

### 3. Complementary Tools

"Notice how different tools caught different issues:

- Gitleaks found secrets
- OWASP found dependency CVEs
- CodeQL found code vulnerabilities
- Trivy found container issues
- Checkov found infrastructure problems"

### 4. Automated Prevention

"Without this pipeline, these vulnerabilities could have reached production. Automation prevents human error."

### 5. Actionable Reports

"Each tool provides SARIF reports, detailed CVE information, and remediation guidance."

---

## Cleanup Instructions

To restore the repository to secure state:

1. **Remove hardcoded secrets from main.ts:**

   ```bash
   git checkout nestjs_backend/src/main.ts
   ```

2. **Remove vulnerable dependencies from package.json:**

   ```bash
   git checkout nestjs_backend/package.json
   ```

3. **Restore secure Dockerfile:**

   ```bash
   git checkout nestjs_backend/Dockerfile
   ```

4. **Remove vulnerable code from app.controller.ts:**

   ```bash
   git checkout nestjs_backend/src/app.controller.ts
   ```

5. **Restore secure docker-compose.yml:**
   ```bash
   git checkout docker-compose.yml
   ```

Or simply:

```bash
git reset --hard HEAD
```

---

## Expected Pipeline Behavior

**Before Security Fixes:**

- ❌ Gitleaks: FAIL
- ❌ OWASP: Multiple HIGH/CRITICAL
- ❌ CodeQL: Security vulnerabilities detected
- ⚠️ Trivy: Vulnerable images
- ⚠️ Checkov: Multiple misconfigurations
- ❌ Final Quality Gate: BLOCKED

**After Security Fixes:**

- ✅ Gitleaks: No secrets found
- ✅ OWASP: No critical vulnerabilities
- ✅ CodeQL: No security issues
- ✅ Trivy: Clean scans
- ✅ Checkov: Configurations secure
- ✅ Final Quality Gate: PASSED

---

## Demo Script

1. **Show clean state** - Run pipeline, all passes
2. **Introduce vulnerabilities** - Apply these changes
3. **Trigger pipeline** - Push to branch
4. **Watch failures** - Show each tool catching issues
5. **Review reports** - GitHub Security tab, SARIF files
6. **Show remediation** - Fix issues one by one
7. **Final success** - Clean pipeline run

---

**Note:** This is for educational purposes only. Never commit real secrets or vulnerabilities to production code!
