# IT Security CI/CD Pipeline - University Project

[![NestJS Monorepo CI/CD Pipeline](https://github.com/ActiveClientMods/IT-Security-CI-CD/actions/workflows/monorepo-pipeline.yml/badge.svg)](https://github.com/ActiveClientMods/IT-Security-CI-CD/actions/workflows/monorepo-pipeline.yml)
[![Scheduled Security Scans](https://github.com/ActiveClientMods/IT-Security-CI-CD/actions/workflows/scheduled-scans.yml/badge.svg)](https://github.com/ActiveClientMods/IT-Security-CI-CD/actions/workflows/scheduled-scans.yml)

A comprehensive, security-focused CI/CD pipeline demonstrating industry best practices for modern full-stack application development. This project showcases automated security scanning, quality assurance, and deployment workflows for a NestJS backend and Flutter frontend monorepo.

## Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Pipeline Features](#-pipeline-features)
- [Security Scanning Tools](#-security-scanning-tools)
- [Pipeline Stages](#-pipeline-stages)
- [Workflows](#-workflows)
- [Key Components](#-key-components)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Artifacts & Reports](#-artifacts--reports)

---

## Project Overview

This project demonstrates a **production-ready CI/CD pipeline** with comprehensive security scanning, automated testing, and quality gates for a modern monorepo containing:

- **Backend**: NestJS API server (TypeScript)
- **Frontend**: Flutter mobile/web application
- **Infrastructure**: Docker containerization, PostgreSQL, Redis

### Key Objectives

✅ **Automated Security Scanning** - Multiple security tools integrated into CI/CD  
✅ **Shift-Left Security** - Find vulnerabilities early in development  
✅ **Quality Assurance** - Automated testing, code quality, and compliance checks  
✅ **Dependency Management** - Automated updates with safety checks  
✅ **Continuous Integration** - Build, test, and validate on every commit  
✅ **Infrastructure as Code** - Security scanning for Docker and IaC configurations

---

## Architecture

```
IT-Security-CI-CD/
├── .github/
│   ├── workflows/
│   │   ├── monorepo-pipeline.yml      # Main CI/CD pipeline
│   │   ├── scheduled-scans.yml        # Weekly security audits
│   │   └── dependabot-auto-merge.yml  # Automated dependency updates
│   └── actions/
│       └── setup-pnpm/                 # Reusable action for Node.js setup
├── nestjs_backend/                     # NestJS API Backend
│   ├── src/                           # Application source code
│   ├── test/                          # Unit & E2E tests
│   ├── Dockerfile                     # Container definition
│   └── package.json                   # Dependencies
├── flutter_frontend/                   # Flutter Frontend
│   ├── lib/                           # Dart source code
│   ├── test/                          # Widget & integration tests
│   └── pubspec.yaml                   # Dependencies
├── docker-compose.yml                  # Multi-service orchestration
├── sonar-project.properties            # SonarCloud configuration
└── README.md                          # This file
```

---

## Pipeline Features

### Multi-Layer Security Scanning

| Tool                       | Purpose                                | Severity Levels                 |
| -------------------------- | -------------------------------------- | ------------------------------- |
| **Gitleaks**               | Secret scanning in code & history      | Critical                        |
| **OWASP Dependency-Check** | Vulnerable dependencies (CVE database) | Critical, High, Medium, Low     |
| **CodeQL**                 | Static code analysis (SAST)            | Error, Warning, Note            |
| **Trivy**                  | Container & filesystem vulnerabilities | Critical, High, Medium, Low     |
| **Checkov**                | Infrastructure as Code (IaC) security  | High, Medium, Low               |
| **SonarCloud**             | Code quality & security hotspots       | Blocker, Critical, Major, Minor |

### Performance Optimizations

- **Smart Change Detection**: Only runs relevant jobs based on file changes
- **Parallel Execution**: Independent jobs run simultaneously
- **Caching**: pnpm dependencies and Docker layers cached
- **Concurrency Control**: Prevents duplicate pipeline runs
- **Incremental Builds**: Reuses artifacts between jobs

### Automation Features

- **Automated Dependency Updates**: Dependabot integration
- **Auto-Approval**: Minor/patch updates auto-approved
- **Weekly Security Audits**: Scheduled scans every Monday
- **Security Reports**: Automated issue creation for findings
- **PR Comments**: Security summary posted on pull requests

---

## Security Scanning Tools

### 1. Gitleaks - Secret Detection

**What it does:**

- Scans entire Git history for exposed secrets
- Detects API keys, passwords, tokens, credentials
- Prevents credential leaks before deployment

**Integration:**

- Runs on every commit
- Blocks pipeline if secrets found
- SARIF results uploaded to GitHub Security tab

**Example Findings:**

```yaml
- AWS Access Keys
- API Tokens
- Private SSH Keys
- Database Credentials
- OAuth Client Secrets
```

---

### 2. OWASP Dependency-Check

**What it does:**

- Scans npm packages for known CVE vulnerabilities
- Checks against National Vulnerability Database (NVD)
- Identifies outdated dependencies with security issues

**Integration:**

- Runs for backend (NestJS)
- Generates SARIF, JSON reports
- Uploads to GitHub Security tab

**Example Vulnerabilities:**

```
Package: lodash@4.17.15
CVE: CVE-2020-8203
Severity: High
Description: Prototype pollution vulnerability
```

---

### 3. CodeQL Analysis

**What it does:**

- Advanced semantic code analysis
- Detects security vulnerabilities in TypeScript code
- Finds SQL injection, XSS, path traversal, etc.

**Integration:**

- Analyzes NestJS backend codebase
- Uses `security-extended` and `security-and-quality` query packs
- Automated code scanning

**Example Queries:**

- SQL Injection detection
- Cross-Site Scripting (XSS)
- Command Injection
- Path Traversal
- Insecure Randomness

---

### 4. Trivy - Container Security

**What it does:**

- Scans Docker images for vulnerabilities
- Checks filesystem for security issues
- Detects OS package vulnerabilities

**Integration:**

- Filesystem scan (source code)
- Container image scan (built Docker images)
- Dual-layer security validation

**Scan Types:**

```yaml
1. Filesystem Scan:
  - Scans application dependencies
  - Checks configuration files

2. Image Scan:
  - Scans base image layers
  - Checks OS packages
  - Validates Docker configuration
```

---

### 5. Checkov - IaC Security

**What it does:**

- Scans Infrastructure as Code configurations
- Validates Docker, docker-compose, Kubernetes
- Checks for security misconfigurations

**Integration:**

- Scans entire repository
- Multiple framework support
- Soft-fail to not block pipeline

**Example Checks:**

```yaml
Docker:
  - Ensure container runs as non-root
  - Check for exposed secrets
  - Validate health checks

Docker Compose:
  - Check security options
  - Validate network configurations
  - Verify resource limits
```

---

### 6. SonarCloud - Code Quality

**What it does:**

- Code quality and maintainability analysis
- Security hotspot detection
- Code coverage tracking
- Technical debt measurement

**Integration:**

- Analyzes TypeScript backend
- Requires test coverage reports
- Quality gate enforcement

**Metrics Tracked:**

```
- Code Coverage (%)
- Bugs
- Vulnerabilities
- Code Smells
- Security Hotspots
- Duplicated Code (%)
- Technical Debt
```

---

## Pipeline Stages

### Stage 1: Initialize Pipeline

**Purpose**: Detect changes and determine what needs to run

**Actions:**

- Checkout code repository
- Detect which files changed
- Determine if backend/frontend modified
- Generate version numbers
- Check deployment conditions

**Outputs:**

```yaml
backend_changed: true/false
shared_changed: true/false
should_deploy: true/false
version: "2025.10.16-abc1234" or "dev-abc1234"
```

---

### Stage 2: Security Scanning

**Purpose**: Comprehensive security validation

**Parallel Jobs:**

1. **Gitleaks Scan**

   - Secret detection
   - Full Git history scan
   - SARIF upload to GitHub

2. **OWASP Dependency Check**

   - Backend npm packages
   - CVE database lookup
   - Vulnerability reports

3. **CodeQL Analysis**

   - TypeScript static analysis
   - Security pattern detection
   - Advanced query packs

4. **Checkov IaC Scan**
   - Docker configuration
   - docker-compose security
   - Infrastructure validation

---

### Stage 3: Build & Compile

**Purpose**: Build application and verify compilation

**Actions:**

- Setup Node.js and pnpm
- Install dependencies (cached)
- Check for deprecated packages
- Build NestJS application
- License compliance check
- Upload build artifacts

**Validations:**

```
✅ Build successful
✅ No deprecated dependencies
✅ License compliance passed
✅ Artifacts ready for testing
```

---

### Stage 4: Docker Build & Scan

**Purpose**: Containerize application and scan for vulnerabilities

**Actions:**

- Download build artifacts
- Build Docker image with BuildKit
- Tag with version number
- Run Trivy filesystem scan
- Run Trivy container scan
- Upload SARIF results

**Security Checks:**

```
1. Filesystem vulnerabilities
2. Container image vulnerabilities
3. Base image security
4. Configuration issues
```

---

### Stage 5: Complete Test Suite

**Purpose**: Execute all tests in production-like environment

**Actions:**

- Start docker-compose services (PostgreSQL, Redis, Backend)
- Wait for services to be ready
- Run NestJS unit tests
- Run E2E integration tests
- Generate coverage reports
- Collect service logs

**Tests Executed:**

```
Unit Tests:
  - Service layer tests
  - Controller tests
  - Module tests

E2E Tests:
  - API endpoint tests
  - Database integration
  - Redis integration
  - Full request/response cycle
```

**Coverage Metrics:**

- Line Coverage
- Branch Coverage
- Function Coverage
- Statement Coverage

---

### Stage 6: Code Quality Analysis

**Purpose**: Analyze code quality and maintainability

**Actions:**

- Download test coverage
- Run SonarCloud scan
- Check quality gate
- Upload results

**Quality Metrics:**

```
Maintainability Rating: A-E
Reliability Rating: A-E
Security Rating: A-E
Coverage: Percentage
Duplications: Percentage
```

---

### Stage 7: Security Summary

**Purpose**: Aggregate all security findings

**Actions:**

- Download all security artifacts
- Parse SARIF results
- Count vulnerabilities by severity
- Generate summary report
- Comment on Pull Request (if applicable)
- Create issue for critical findings

**Report Includes:**

```markdown
# Security Scan Summary

Vulnerability Overview:
Critical: X
High: Y
Medium: Z
Low: W

Scan Results:
✅ Gitleaks: No secrets
✅ OWASP: X vulnerabilities
✅ CodeQL: Y issues
✅ Trivy: Z vulnerabilities
✅ Checkov: W misconfigurations
```

---

### Stage 8: ✅ Final Quality Gate

**Purpose**: Final validation before completion

**Checks:**

```
✅ All critical jobs passed
✅ No blocking security issues
✅ Build successful
✅ Tests passed
✅ Quality metrics met
```

**Outcomes:**

- **Success**: All checks pass, ready for deployment
- **Warning**: Non-critical issues found, investigate
- **Failure**: Critical issues found, pipeline blocked

---

## Workflows

### 1. Main Pipeline (`monorepo-pipeline.yml`)

**Triggers:**

```yaml
Push to:
  - development
  - release

Pull Requests to:
  - development
  - release
```

**11 Jobs, 100+ Steps**

**Execution Flow:**

```
Initialize
    ↓
┌───────────────────────────┐
│ Parallel Security Scans   │
│ - Gitleaks                │
│ - OWASP Dependency Check  │
│ - CodeQL                  │
│ - Checkov                 │
└───────────────────────────┘
    ↓
Build Backend
    ↓
Docker Build & Trivy Scan
    ↓
Integration Tests
    ↓
SonarCloud Quality Gate
    ↓
Security Summary
    ↓
Final Quality Gate
```

---

### 2. Scheduled Security Scans (`scheduled-scans.yml`)

**Triggers:**

```yaml
Schedule:
  - Every Monday at 2 AM UTC
  - Manual trigger (workflow_dispatch)
```

**Purpose:**

- Weekly security audit
- Catch new CVEs in dependencies
- Monitor for security regressions

**Actions:**

1. Run Trivy filesystem scan
2. Run OWASP Dependency Check
3. Upload SARIF to GitHub Security
4. Create weekly report issue

**Report Example:**

```markdown
Weekly Security Scan Report - 2025-10-16

## Scans Performed

- ✅ Trivy Filesystem Scan
- ✅ OWASP Dependency Check

## Results

Check the Security tab for detailed findings.
```

---

### 3. Dependabot Auto-Merge (`dependabot-auto-merge.yml`)

**Triggers:**

```yaml
Pull Request opened by dependabot[bot]
```

**Purpose:**

- Automate dependency updates
- Reduce manual review overhead
- Keep dependencies current

**Logic:**

```yaml
Patch Updates (1.0.X): ✅ Auto-approve
  ✅ Add auto-merge label

Minor Updates (1.X.0): ✅ Auto-approve
  Manual merge

Major Updates (X.0.0): Comment warning
  Requires manual review
```

---

## Key Components

### Custom GitHub Action: `setup-pnpm`

**Location**: `.github/actions/setup-pnpm/`

**Purpose**: Reusable action for Node.js and pnpm setup

**Inputs:**

```yaml
working-directory: nestjs_backend (default)
node-version: 20 (default)
install-deps: true (default)
```

**Features:**

- Installs latest pnpm
- Configures Node.js with caching
- Installs dependencies with frozen lockfile
- Cached across pipeline runs

**Usage in Pipeline:**

```yaml
- name: Setup pnpm and Node.js
  uses: ./.github/actions/setup-pnpm
```

---

### License Compliance Check

**Purpose**: Ensure all dependencies have acceptable licenses

**Process:**

1. Install `license-checker`
2. Generate license reports (JSON, CSV, summary)
3. Check for UNLICENSED packages (except own code)
4. Detect copyleft licenses (GPL, AGPL, LGPL)
5. Fail pipeline if violations found

**Blocked Licenses:**

```
❌ GPL (requires source disclosure)
❌ AGPL (requires source disclosure)
❌ LGPL (requires source disclosure)
❌ CPAL (requires source disclosure)
❌ OSL (requires source disclosure)
```

**Reports Generated:**

- `license-report.json` - Full details
- `license-report.csv` - Spreadsheet format
- `license-summary.txt` - Quick overview

---

### Deprecated Dependencies Check

**Purpose**: Identify outdated and deprecated npm packages

**Process:**

1. Run `pnpm outdated`
2. Run `npm-check-updates --doctor`
3. Check for deprecated packages
4. Generate report
5. Upload artifact

**Benefits:**

- Proactive maintenance
- Security vulnerability prevention
- Keep dependencies modern
- Avoid breaking changes

---

## Getting Started

### Prerequisites

```bash
# Required Software
- Node.js 20+
- pnpm (latest)
- Docker & Docker Compose
- Git
```

### Local Setup

```bash
# Clone repository
git clone https://github.com/ActiveClientMods/IT-Security-CI-CD.git
cd IT-Security-CI-CD

# Setup backend
cd nestjs_backend
pnpm install
pnpm run build
pnpm run test

# Run with Docker
cd ..
docker-compose up -d

# Check health
curl http://localhost:3000/health
```

### Environment Variables

Create `.env` file in root:

```env
NODE_ENV=development
PORT=3000
DB_NAME=appdb
DB_USER=appuser
DB_PASSWORD=apppass
REDIS_PASSWORD=redispass
```

---

## Configuration

### GitHub Secrets Required

```yaml
GITHUB_TOKEN: Automatic (provided by GitHub)
GITLEAKS_LICENSE: Optional (for Gitleaks Enterprise)
SONAR_TOKEN: Required for SonarCloud integration
```

### SonarCloud Configuration

File: `sonar-project.properties`

```properties
sonar.projectKey=ActiveClientMods_IT-Security-CI-CD
sonar.organization=your-org
sonar.sources=nestjs_backend/src
sonar.tests=nestjs_backend/test
sonar.typescript.lcov.reportPaths=nestjs_backend/coverage/lcov.info
```

### Dependabot Configuration

File: `.github/dependabot.yml` (optional)

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/nestjs_backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

---

## Artifacts & Reports

### Generated Artifacts

Each pipeline run produces the following artifacts:

| Artifact Name                     | Content                      | Purpose                 |
| --------------------------------- | ---------------------------- | ----------------------- |
| `backend-build-artifacts`         | Compiled NestJS dist/ folder | Deployment package      |
| `backend-dependency-check-report` | OWASP vulnerability reports  | Security review         |
| `backend-deprecated-packages`     | List of deprecated packages  | Maintenance             |
| `backend-license-compliance`      | License reports              | Legal compliance        |
| `complete-test-suite-coverage`    | Test coverage reports        | Quality metrics         |
| `complete-test-suite-results`     | Unit & E2E test logs         | Test verification       |
| `trivy-backend-reports`           | Container scan results       | Security review         |
| `checkov-report`                  | IaC security findings        | Infrastructure security |
| `security-summary`                | Aggregated security report   | Overall assessment      |
| `docker-compose-logs`             | Service logs from tests      | Debugging               |

### Artifact Retention

- Default retention: **90 days**
- Available for download from Actions tab
- SARIF results uploaded to Security tab permanently

---

## Monitoring & Observability

### GitHub Security Tab

**Features:**

- Automated security advisories
- Dependabot alerts
- Code scanning alerts (CodeQL)
- Secret scanning alerts (Gitleaks)
- SARIF results from all tools

**Access:**

```
Repository → Security → Code scanning alerts
Repository → Security → Dependabot alerts
Repository → Security → Secret scanning
```

### Workflow Monitoring

**Metrics Tracked:**

- Pipeline success rate
- Average execution time
- Job failure patterns
- Artifact sizes
- Coverage trends

**Dashboard:**

```
Repository → Actions → Workflows
Select workflow → Click on run
View job details, logs, artifacts
```

---

## Educational Value

### Learning Outcomes

This project demonstrates:

1. **DevSecOps Principles**

   - Security integrated into every stage
   - Shift-left security approach
   - Automated security validation

2. **CI/CD Best Practices**

   - Pipeline as code
   - Modular job design
   - Artifact management
   - Parallel execution

3. **Modern Development Tools**

   - GitHub Actions workflows
   - Container security scanning
   - Static code analysis
   - Dynamic testing

4. **Security Tools Integration**

   - Multiple scanning layers
   - SARIF format standardization
   - Automated reporting

5. **Quality Engineering**
   - Automated testing
   - Coverage tracking
   - Code quality metrics
   - License compliance

---

## Security Features Summary

### Multi-Layer Defense

```
Layer 1: Secret Scanning (Gitleaks)
         ↓
Layer 2: Dependency Scanning (OWASP)
         ↓
Layer 3: Static Analysis (CodeQL)
         ↓
Layer 4: Container Scanning (Trivy)
         ↓
Layer 5: IaC Scanning (Checkov)
         ↓
Layer 6: Quality Analysis (SonarCloud)
```

### Compliance & Standards

- **OWASP Top 10** - Vulnerability detection
- **CWE** - Common Weakness Enumeration
- **CVE** - Common Vulnerabilities and Exposures
- **SARIF** - Standard format for analysis results
- **License Compliance** - Legal risk mitigation

---

## Pipeline Metrics

### Typical Execution Time

| Job                    | Duration  | Can Skip             |
| ---------------------- | --------- | -------------------- |
| Initialize             | ~30s      | No                   |
| Gitleaks               | ~1-2 min  | If no changes        |
| OWASP Dependency Check | ~3-5 min  | If backend unchanged |
| CodeQL                 | ~5-10 min | If backend unchanged |
| Build Backend          | ~2-3 min  | If backend unchanged |
| Docker Build & Trivy   | ~3-5 min  | If build skipped     |
| Integration Tests      | ~5-8 min  | If docker skipped    |
| SonarCloud             | ~2-3 min  | If tests skipped     |
| Checkov                | ~1-2 min  | If no changes        |
| Security Summary       | ~1 min    | If no scans          |
| Quality Gate           | ~30s      | No                   |

**Total Duration:**

- Full pipeline: ~25-40 minutes
- With smart skipping: ~10-15 minutes

---

## Future Enhancements

### Planned Features

- [ ] **Flutter Frontend Pipeline**

  - Dart code analysis
  - Flutter widget tests
  - Mobile app security scanning

- [ ] **Deployment Automation**

  - Kubernetes deployment
  - Helm chart validation
  - Production rollout strategies

- [ ] **Advanced Monitoring**

  - Performance testing
  - Load testing integration
  - Runtime security monitoring

- [ ] **Enhanced Reporting**
  - Slack/Discord notifications
  - Email summaries
  - Dashboard integration

---

## References & Documentation

### Tools Documentation

- [GitHub Actions](https://docs.github.com/en/actions)
- [Gitleaks](https://github.com/gitleaks/gitleaks)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [CodeQL](https://codeql.github.com/)
- [Trivy](https://trivy.dev/)
- [Checkov](https://www.checkov.io/)
- [SonarCloud](https://sonarcloud.io/)

### Best Practices

- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)

---

## Contributors

**Project Author**: ActiveClientMods  
**Purpose**: University IT Security Project  
**Academic Year**: 2025

---

## License

This project is for educational purposes as part of a university IT security course.

---

## Acknowledgments

- GitHub Actions team for excellent CI/CD platform
- OWASP for open-source security tools
- Aqua Security for Trivy
- Zricethezav for Gitleaks
- NestJS community for framework excellence

---

**Built with ❤️ for IT Security education**
