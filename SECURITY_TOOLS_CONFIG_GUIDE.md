# Security Scanning Tool Configurations

This document explains the configuration files for each security scanning tool in the CI/CD pipeline.

## Quick Answer: Do You Need Config Files?

**NO** - All tools work perfectly with their **default settings** and will detect the vulnerabilities without any custom configuration.

**HOWEVER** - These config files are provided to:

- Demonstrate advanced configuration options in your presentation
- Fine-tune detection rules
- Reduce false positives in production use
- Show best practices for enterprise deployments

---

## Configuration Files Overview

| Tool                       | Config File                        | Required? | Purpose                            |
| -------------------------- | ---------------------------------- | --------- | ---------------------------------- |
| **Gitleaks**               | `.gitleaks.toml`                   | ❌ No     | Custom secret patterns, allowlists |
| **OWASP Dependency-Check** | None                               | ❌ No     | Uses CLI arguments in workflow     |
| **CodeQL**                 | `.github/codeql/codeql-config.yml` | ❌ No     | Custom queries (uses defaults)     |
| **Trivy**                  | `.trivy.yaml`                      | ❌ No     | Vuln/config scanning only          |
| **Checkov**                | `.checkov.yml`                     | ❌ No     | Framework selection, policies      |
| **SonarCloud**             | `sonar-project.properties`         | ✅ Yes\*  | Project configuration              |

\*SonarCloud needs basic project configuration, which you already have.

**Note:** Trivy's secret scanning has been disabled - Gitleaks handles all secret detection to avoid redundancy.

---

## 1. Gitleaks Configuration (`.gitleaks.toml`)

### Purpose

Customizes secret detection patterns and reduces false positives.

### Default Behavior (WITHOUT config file)

✅ **Gitleaks will still work perfectly!**

- Uses built-in rules for ~100 secret patterns
- Detects AWS keys, GitHub tokens, API keys, passwords
- Scans entire Git history
- **Will detect all the hardcoded secrets you added**

### With Custom Config

The `.gitleaks.toml` file we created adds:

- Custom regex patterns for demo purposes
- Specific AWS and GitHub token patterns
- Allowlists for test files
- Entropy detection for high-randomness strings

### Example Detection (with or without config)

```typescript
// This WILL be detected by default Gitleaks:
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const API_TOKEN = "ghp_1234567890abcdefghijklmnopqrstuvwxyz";
const DB_PASSWORD = "MySecretP@ssw0rd123!";
```

### Workflow Integration

```yaml
- name: Run Gitleaks
  uses: gitleaks/gitleaks-action@v2
  # Automatically uses .gitleaks.toml if present
  # Otherwise uses default rules
```

---

## 2. OWASP Dependency-Check (No config file needed)

### Configuration Method

Uses **command-line arguments** in the workflow file.

### Current Configuration

```yaml
- name: Run OWASP Dependency Check
  uses: dependency-check/Dependency-Check_Action@main
  with:
    project: "nestjs-backend"
    path: "./nestjs_backend"
    format: "SARIF"
    args: >
      --enableRetired
      --enableExperimental
      --noupdate
```

### What It Does (DEFAULT)

✅ **Scans all npm packages automatically**

- Checks against National Vulnerability Database (NVD)
- Identifies CVEs in dependencies
- **Will detect all vulnerable packages you added:**
  - lodash@4.17.15 → CVE-2020-8203
  - axios@0.21.0 → CVE-2021-3749
  - express@4.17.1 → CVE-2022-24999
  - moment@2.29.1 → CVE-2022-31129

### Optional: Suppression File

If you wanted to ignore specific CVEs (not recommended for demo):

```xml
<!-- dependency-check-suppressions.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<suppressions xmlns="https://jeremylong.github.io/DependencyCheck/dependency-suppression.1.3.xsd">
    <suppress>
        <cve>CVE-2020-8203</cve>
        <notes>Example suppression</notes>
    </suppress>
</suppressions>
```

**For your demo: Don't create this file!** You want to show the findings.

---

## 3. CodeQL Configuration (Uses defaults)

### Default Behavior (WITHOUT config file)

✅ **CodeQL works out-of-the-box!**

- Automatically detects TypeScript/JavaScript
- Uses `security-extended` and `security-and-quality` query packs
- **Will detect your SQL injection and command injection vulnerabilities**

### Current Workflow Setup

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v4
  with:
    languages: typescript
    queries: security-extended,security-and-quality
```

### What It Detects (DEFAULT)

- SQL Injection (CWE-89) ✅
- Command Injection (CWE-78) ✅
- XSS (CWE-79)
- Path Traversal (CWE-22)
- Insecure randomness
- And 200+ other security patterns

### Optional: Custom Queries

Only needed for very specific use cases:

```yaml
# .github/codeql/codeql-config.yml
name: "Custom CodeQL Config"
queries:
  - uses: security-extended
  - uses: security-and-quality
paths-ignore:
  - node_modules
  - test
```

**For your demo: Not needed!** Default queries are excellent.

---

## 4. Trivy Configuration (`.trivy.yaml`)

### Purpose

Configure scan types, severity levels, and output formats.

### Default Behavior (WITHOUT config file)

✅ **Trivy works perfectly without config!**

- Scans for OS vulnerabilities
- Scans for library vulnerabilities
- Scans for secrets
- Scans for misconfigurations
- **Will detect:**
  - Old Node.js 16.13.0 vulnerabilities
  - Vulnerable npm packages
  - Container security issues

### With Custom Config

The `.trivy.yaml` file we created:

- Explicitly sets severity levels
- Defines scan types
- Configures output format
- Sets timeout values

### Workflow Integration

```yaml
- name: Run Trivy Container Image Scan
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: "image"
    format: "sarif"
    severity: "CRITICAL,HIGH,MEDIUM"
    # Trivy will auto-detect .trivy.yaml if present
```

### Detection Examples (with or without config)

```dockerfile
# Old Node.js version - DETECTED
FROM node:16.13.0-alpine

# Running as root - DETECTED
# USER nodejs  # commented out

# These will all be flagged!
```

---

## 5. Checkov Configuration (`.checkov.yml`)

### Purpose

Select which IaC frameworks to scan and which policies to enforce.

### Default Behavior (WITHOUT config file)

✅ **Checkov scans everything automatically!**

- Detects Dockerfile issues
- Detects docker-compose.yml issues
- Detects GitHub Actions issues
- **Will detect:**
  - Hardcoded secrets in docker-compose
  - Privileged mode enabled
  - Missing resource limits
  - Container running as root

### With Custom Config

The `.checkov.yml` file we created:

- Explicitly enables Docker security checks
- Enables secret detection
- Configures output format
- Sets scan directories

### Workflow Integration

```yaml
- name: Run Checkov
  uses: bridgecrewio/checkov-action@master
  with:
    directory: .
    framework: all
    output_format: sarif,json
    # Checkov will auto-detect .checkov.yml if present
```

### Detection Examples (with or without config)

```yaml
# docker-compose.yml issues - ALL DETECTED:
privileged: true # CKV_DOCKER_8
environment:
  - DB_PASSWORD=MyPassword123! # CKV_SECRET_*
# No resource limits                # CKV_DOCKER_9
```

---

## 6. SonarCloud Configuration (`sonar-project.properties`)

### Required Configuration

✅ **You already have this file!**

```properties
sonar.projectKey=ActiveClientMods_IT-Security-CI-CD
sonar.organization=your-org
sonar.sources=nestjs_backend/src
sonar.tests=nestjs_backend/test
sonar.typescript.lcov.reportPaths=nestjs_backend/coverage/lcov.info
```

### What It Does

- Analyzes code quality
- Detects security hotspots
- Tracks code coverage
- Measures technical debt
- Identifies code smells

---

## Summary: What Do You Actually Need?

### For Basic Demo (All tools work!)

```
✅ NO custom config files required!
✅ All tools use excellent default rules
✅ Will detect all vulnerabilities you added
```

### For Enhanced Demo (Show advanced features)

```
📁 .gitleaks.toml          - Optional, shows custom patterns
📁 .trivy.yaml             - Optional, shows configuration options
📁 .checkov.yml            - Optional, shows policy selection
📁 sonar-project.properties - Required (you already have it!)
```

### Recommendation for Your Presentation

**Option 1: Without Custom Configs (Simpler)**

- Delete all config files
- Tools use defaults
- Everything still works perfectly
- Simpler to explain

**Option 2: With Custom Configs (Advanced)**

- Keep the config files we created
- Show that you can customize detection
- Demonstrate enterprise-level configuration
- More impressive for presentation

---

## Testing Detection Without Config Files

Want to verify tools work without configs? Try this:

```bash
# Remove all config files
rm .gitleaks.toml .trivy.yaml .checkov.yml .trivy-secret.yaml

# Commit and push
git add .
git commit -m "Test: Remove config files to show default detection"
git push

# Watch the pipeline - everything will still be detected!
```

Then restore configs:

```bash
git revert HEAD
git push
```

---

## Presentation Talking Points

### If Asked: "Do you need configuration files?"

**Answer:**

> "No, all these tools work out-of-the-box with excellent default rules. However, I've created custom configuration files to demonstrate:
>
> 1. How to fine-tune detection patterns for specific needs
> 2. How to reduce false positives in production
> 3. Enterprise-grade security pipeline configuration
> 4. Best practices for team collaboration
>
> The tools would detect all these vulnerabilities even without the config files - they're just that good!"

### If Asked: "What if I delete the config files?"

**Answer:**

> "The pipeline would still work perfectly! The config files are for customization and fine-tuning, not for basic functionality. This shows how easy it is to get started with security scanning - just add the GitHub Actions and you're protected."

---

## Config File Priority

When tools look for configuration:

1. **Command-line arguments** (highest priority)
2. **Config file in repository root** (`.gitleaks.toml`, `.trivy.yaml`, etc.)
3. **Default built-in rules** (what tools use without config)

For your pipeline:

- Gitleaks: Uses `.gitleaks.toml` if present, else defaults
- OWASP: Uses workflow args only
- CodeQL: Uses workflow args, no config needed
- Trivy: Uses `.trivy.yaml` if present, else defaults
- Checkov: Uses `.checkov.yml` if present, else defaults
- SonarCloud: **Requires** `sonar-project.properties`

---

## Conclusion

**You DON'T need any config files except `sonar-project.properties` (which you already have).**

The config files provided are **optional enhancements** that:

- Show advanced features
- Demonstrate best practices
- Can be used as talking points in your presentation

All security tools will detect your intentional vulnerabilities with or without custom configurations! 🎯
