# CI/CD Security Pipeline - Präsentation

## Universitätsprojekt IT-Sicherheit 2025

---

## Agenda

1. Projektübersicht
2. CI/CD Pipeline Architektur
3. Sicherheits-Tools im Detail
4. Pipeline-Phasen
5. Automatisierte Workflows
6. Sicherheitsberichte & Monitoring
7. Demo & Ergebnisse
8. Zusammenfassung

---

## 1. Projektübersicht

### Projektziel

Entwicklung einer **produktionsreifen CI/CD-Pipeline** mit umfassenden Sicherheitsprüfungen für eine moderne Monorepo-Anwendung.

### Technologie-Stack

**Backend:**

- NestJS (TypeScript)
- Node.js 20
- pnpm Package Manager
- PostgreSQL
- Redis

**Frontend:**

- Flutter
- Dart

**Infrastructure:**

- Docker & Docker Compose
- GitHub Actions
- Multi-Container Setup

---

### Kernziele des Projekts

**Automatisierte Sicherheitsprüfungen**

- Mehrere Security-Tools in CI/CD integriert

**Shift-Left Security**

- Schwachstellen früh im Entwicklungsprozess finden

**Quality Assurance**

- Automatisierte Tests & Code-Qualitätsprüfungen

**Dependency Management**

- Automatische Updates mit Sicherheitschecks

**DevSecOps Best Practices**

- Sicherheit in jeder Pipeline-Phase

---

## 2. CI/CD Pipeline Architektur

### Repository-Struktur

```
IT-Security-CI-CD/
├── .github/workflows/
│   ├── monorepo-pipeline.yml       # Haupt-Pipeline
│   ├── scheduled-scans.yml         # Wöchentliche Scans
│   └── dependabot-auto-merge.yml   # Dependency Updates
│
├── nestjs_backend/                 # Backend-Anwendung
│   ├── src/                       # Quellcode
│   ├── test/                      # Tests
│   └── Dockerfile                 # Container-Definition
│
├── flutter_frontend/               # Frontend-Anwendung
│
└── docker-compose.yml              # Service-Orchestrierung
```

---

### Pipeline-Übersicht

**3 Workflows:**

1. **Monorepo Pipeline** - Haupt-CI/CD (11 Jobs)
2. **Scheduled Scans** - Wöchentliche Audits
3. **Dependabot Auto-Merge** - Dependency-Automatisierung

**100+ Pipeline-Schritte**

**Durchschnittliche Laufzeit:**

- Vollständig: 25-40 Minuten
- Mit Smart Skipping: 10-15 Minuten

---

### Workflow-Trigger

**Monorepo Pipeline:**

```yaml
Push auf Branches:
  - development
  - release

Pull Requests auf:
  - development
  - release
```

**Scheduled Scans:**

```yaml
Zeitplan:
  - Jeden Montag um 2:00 UTC
  - Manueller Trigger möglich
```

---

## 3. Sicherheits-Tools im Detail

### 6-Schichten Sicherheitsarchitektur

```
┌─────────────────────────────────────┐
│ 1. Gitleaks - Secret Scanning      │
├─────────────────────────────────────┤
│ 2. OWASP - Dependency Check        │
├─────────────────────────────────────┤
│ 3. CodeQL - Static Analysis        │
├─────────────────────────────────────┤
│ 4. Trivy - Container Security      │
├─────────────────────────────────────┤
│ 5. Checkov - IaC Security          │
├─────────────────────────────────────┤
│ 6. SonarCloud - Quality Gate       │
└─────────────────────────────────────┘
```

---

### Tool 1: Gitleaks

**Funktion:**

- Durchsucht Git-Historie nach Secrets
- Erkennt API-Keys, Passwörter, Tokens
- Verhindert Credential-Leaks

**Erkennungsmuster:**

```
✓ AWS Access Keys
✓ GitHub Tokens
✓ Private SSH Keys
✓ Datenbank-Credentials
✓ OAuth Client Secrets
```

**Integration:**

- Läuft bei jedem Commit
- Blockiert Pipeline bei Fund
- SARIF-Upload zu GitHub Security

---

### Tool 2: OWASP Dependency-Check

**Funktion:**

- Scannt npm-Pakete auf CVE-Schwachstellen
- Prüft gegen National Vulnerability Database (NVD)
- Identifiziert veraltete Abhängigkeiten

**Beispiel-Ausgabe:**

```
Package: lodash@4.17.15
CVE: CVE-2020-8203
Severity: HIGH
Description: Prototype Pollution Vulnerability
```

**Berichte:**

- SARIF-Format für GitHub
- JSON für Parsing
- Detaillierte CVE-Informationen

---

### Tool 3: CodeQL

**Funktion:**

- Semantische Code-Analyse
- Erkennt Sicherheitslücken in TypeScript
- Findet SQL Injection, XSS, etc.

**Query-Packs:**

```yaml
security-extended:
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Command Injection
  - Path Traversal

security-and-quality:
  - Code Quality Issues
  - Performance Problems
  - Best Practice Violations
```

**Vorteile:**

- Keine False Positives
- Deep Semantic Analysis
- GitHub-Integration

---

### Tool 4: Trivy

**Funktion:**

- Container & Filesystem Security
- Scannt Docker Images
- Erkennt OS-Package Schwachstellen

**Doppelte Scan-Strategie:**

```yaml
1. Filesystem Scan: ├── Anwendungs-Dependencies
  ├── Konfigurationsdateien
  └── Quellcode-Schwachstellen

2. Container Image Scan: ├── Base Image Layers
  ├── OS-Pakete
  └── Docker-Konfiguration
```

**Severity-Level:**

- CRITICAL, HIGH, MEDIUM, LOW

---

### Tool 5: Checkov

**Funktion:**

- Infrastructure as Code (IaC) Security
- Validiert Docker, docker-compose
- Prüft Sicherheitskonfigurationen

**Prüfungen:**

**Docker:**

```
✓ Container läuft nicht als Root
✓ Keine exponierten Secrets
✓ Health Checks vorhanden
```

**Docker Compose:**

```
✓ Security Options gesetzt
✓ Netzwerk-Konfiguration sicher
✓ Resource Limits definiert
```

---

### Tool 6: SonarCloud

**Funktion:**

- Code-Qualität & Wartbarkeit
- Security Hotspot Detection
- Test Coverage Tracking
- Technical Debt Messung

**Metriken:**

```
┌──────────────────────────┬──────────┐
│ Metrik                   │ Ziel     │
├──────────────────────────┼──────────┤
│ Code Coverage            │ > 80%    │
│ Maintainability Rating   │ A        │
│ Security Rating          │ A        │
│ Reliability Rating       │ A        │
│ Duplicated Code          │ < 3%     │
└──────────────────────────┴──────────┘
```

---

## 4. Pipeline-Phasen

### Phase 1: Initialisierung

**Aufgabe:**  
Änderungserkennung & Konfiguration

**Schritte:**

1. Code auschecken
2. Datei-Änderungen erkennen
3. Backend/Frontend Änderungen prüfen
4. Versionsnummer generieren
5. Deployment-Bedingungen prüfen

**Outputs:**

```yaml
backend_changed: true/false
should_deploy: true/false
version: "2025.10.16-abc1234"
```

**Smart Change Detection:**

- Nur relevante Jobs ausführen
- Spart Zeit & Ressourcen
- Parallele Ausführung optimieren

---

### Phase 2: Security Scanning

**Aufgabe:**  
Umfassende Sicherheitsvalidierung

**Parallele Ausführung:**

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Gitleaks   │  │    OWASP    │  │   CodeQL    │
│   ~1-2min   │  │   ~3-5min   │  │  ~5-10min   │
└─────────────┘  └─────────────┘  └─────────────┘

┌─────────────┐
│   Checkov   │
│   ~1-2min   │
└─────────────┘
```

**Resultat:**

- Alle Scans laufen parallel
- SARIF-Upload zu GitHub Security
- Blockiert bei kritischen Findings

---

### Phase 3: Build & Compile

**Aufgabe:**  
Anwendung bauen & validieren

**Build-Schritte:**

1. **Setup:**

   ```bash
   - pnpm installieren
   - Node.js 20 konfigurieren
   - Dependencies installieren (cached)
   ```

2. **Validierung:**

   ```bash
   - Deprecated Packages prüfen
   - License Compliance Check
   - NestJS Build
   ```

3. **Artifact Upload:**
   ```bash
   - Build-Artefakte speichern
   - Reports hochladen
   ```

---

### License Compliance Check

**Blockierte Lizenzen:**

```
❌ GPL    - Erfordert Source Disclosure
❌ AGPL   - Erfordert Source Disclosure
❌ LGPL   - Erfordert Source Disclosure
❌ CPAL   - Erfordert Source Disclosure
❌ OSL    - Erfordert Source Disclosure
```

**Erlaubte Lizenzen:**

```
MIT
Apache 2.0
BSD
ISC
UNLICENSED (nur eigener Code)
```

**Berichte:**

- license-report.json
- license-report.csv
- license-summary.txt

---

### Phase 4: Docker Build & Scan

**Aufgabe:**  
Container bauen & scannen

**Prozess:**

```
1. Build-Artefakte herunterladen
         ↓
2. Docker Image mit BuildKit bauen
         ↓
3. Image mit Version taggen
         ↓
4. Trivy Filesystem Scan
         ↓
5. Trivy Container Image Scan
         ↓
6. SARIF-Upload zu GitHub
```

**Layer Caching:**

- GitHub Actions Cache
- Schnellere Builds
- Effiziente Ressourcennutzung

---

### Phase 5: Complete Test Suite

**Aufgabe:**  
Alle Tests in produktionsähnlicher Umgebung

**Testumgebung:**

```yaml
Services:
  - PostgreSQL (Datenbank)
  - Redis (Cache)
  - NestJS Backend (API)
```

**Test-Arten:**

**Unit Tests:**

```
✓ Service Layer Tests
✓ Controller Tests
✓ Module Tests
✓ Utility Functions
```

**E2E Tests:**

```
✓ API Endpoint Tests
✓ Datenbank-Integration
✓ Redis-Integration
✓ Full Request/Response Cycle
```

---

### Test Coverage Metriken

**Erfasste Metriken:**

```
┌─────────────────────┬──────────┐
│ Metrik              │ Ziel     │
├─────────────────────┼──────────┤
│ Line Coverage       │ > 80%    │
│ Branch Coverage     │ > 75%    │
│ Function Coverage   │ > 85%    │
│ Statement Coverage  │ > 80%    │
└─────────────────────┴──────────┘
```

**Berichte:**

- lcov.info für SonarCloud
- JSON für Archivierung
- HTML für menschliche Lesbarkeit

---

### Phase 6: Code Quality Analysis

**Aufgabe:**  
Code-Qualität & Wartbarkeit analysieren

**SonarCloud Integration:**

1. Coverage-Berichte herunterladen
2. SonarCloud Scan ausführen
3. Quality Gate prüfen
4. Ergebnisse hochladen

**Quality Gate Kriterien:**

```yaml
Neue Code-Änderungen:
  - Coverage: ≥ 80%
  - Duplicationen: ≤ 3%
  - Maintainability Rating: A
  - Reliability Rating: A
  - Security Rating: A
```

**Hinweis:**  
Quality Gate-Fehler blockieren Pipeline nicht, sollten aber untersucht werden.

---

### Phase 7: Security Summary

**Aufgabe:**  
Alle Sicherheitsergebnisse aggregieren

**Prozess:**

```
1. Alle Artefakte herunterladen
         ↓
2. SARIF-Dateien parsen
         ↓
3. Schwachstellen nach Severity zählen
         ↓
4. Summary-Report generieren
         ↓
5. PR-Kommentar erstellen (falls PR)
         ↓
6. Issue bei kritischen Findings
```

---

### Security Summary Report

**Beispiel-Report:**

```markdown
# Security Scan Summary

## Vulnerability Overview

| Severity    | Count |
| ----------- | ----- |
| 🔴 Critical | 0     |
| 🟠 High     | 2     |
| 🟡 Medium   | 5     |
| 🔵 Low      | 12    |

## 🔍 Scan Results

### Gitleaks: No secrets detected

### OWASP: 2 high, 5 medium

### CodeQL: No issues

### Trivy: 0 critical, 2 high

### Checkov: 5 medium findings
```

---

### Phase 8: Final Quality Gate

**Aufgabe:**  
Finale Validierung vor Abschluss

**Prüfungen:**

```yaml
Kritische Checks: Security Summary erfolgreich
  Build erfolgreich
  Tests bestanden
  Keine blockierenden Sicherheitsprobleme

Warnungen (nicht blockierend): SonarCloud Quality Gate
  Code Coverage unter Ziel
```

**Ergebnisse:**

```
SUCCESS: Alle Checks bestanden
WARNING: Nicht-kritische Probleme
FAILURE: Kritische Probleme gefunden
```

---

## 5. Automatisierte Workflows

### Workflow 1: Monorepo Pipeline

**Hauptpipeline für CI/CD**

**Trigger:**

- Push auf `development` oder `release`
- Pull Requests

**Jobs:**

```
11 Jobs insgesamt:
  1. Initialize
  2. Gitleaks Scan
  3. OWASP Dependency Check
  4. CodeQL Analysis
  5. Build Backend
  6. Checkov IaC Scan
  7. Docker Build & Trivy
  8. Integration Tests
  9. SonarCloud Quality
 10. Security Summary
 11. Final Quality Gate
```

---

### Workflow 2: Scheduled Security Scans

**Wöchentliche Sicherheitsaudits**

**Zeitplan:**

```yaml
Jeden Montag um 2:00 UTC
+ Manueller Trigger möglich
```

**Scans:**

1. Trivy Filesystem Scan
2. OWASP Dependency Check

**Automatische Issue-Erstellung:**

```markdown
Weekly Security Scan Report - 2025-10-16

## Scans Performed

- Trivy Filesystem Scan
- OWASP Dependency Check

## Results

Check the Security tab for detailed findings.
```

---

### Workflow 3: Dependabot Auto-Merge

**Automatische Dependency-Updates**

**Logik:**

```yaml
Patch Updates (1.0.X): Auto-Approve
  Auto-Merge Label
  Automatisches Mergen

Minor Updates (1.X.0): Auto-Approve
  Manuelles Mergen

Major Updates (X.0.0): Warnkommentar
  Manuelle Review erforderlich
```

**Vorteile:**

- Weniger manueller Aufwand
- Schnellere Sicherheitsupdates
- Kontrollierter Update-Prozess

---

## 6️⃣ Sicherheitsberichte & Monitoring

### GitHub Security Tab

**Integrierte Features:**

```
Code Scanning Alerts (CodeQL)
   ↓
Secret Scanning (Gitleaks)
   ↓
Dependabot Alerts
   ↓
Security Advisories
```

**SARIF-Upload:**

- Alle Tools laden SARIF hoch
- Zentrale Sicherheitsübersicht
- Trendanalyse möglich

---

### Artefakte & Reports

**Pro Pipeline-Lauf generiert:**

| Artefakt                       | Inhalt          | Zweck             |
| ------------------------------ | --------------- | ----------------- |
| `backend-build-artifacts`      | Kompilierte App | Deployment        |
| `backend-dependency-check`     | CVE-Reports     | Security Review   |
| `backend-license-compliance`   | Lizenz-Reports  | Legal Compliance  |
| `complete-test-suite-coverage` | Coverage        | Qualitätsmetriken |
| `trivy-backend-reports`        | Container Scans | Security          |
| `checkov-report`               | IaC Findings    | Infrastructure    |
| `security-summary`             | Gesamtübersicht | Assessment        |

**Retention:** 90 Tage

---

### Performance-Metriken

**Durchschnittliche Job-Zeiten:**

```
┌────────────────────────┬──────────┬──────────────┐
│ Job                    │ Dauer    │ Überspringen │
├────────────────────────┼──────────┼──────────────┤
│ Initialize             │ ~30s     │ Nein         │
│ Gitleaks               │ ~1-2min  │ Ja (1)       │
│ OWASP Dependency Check │ ~3-5min  │ Ja (2)       │
│ CodeQL                 │ ~5-10min │ Ja (2)       │
│ Build Backend          │ ~2-3min  │ Ja (2)       │
│ Docker Build & Trivy   │ ~3-5min  │ Ja (3)       │
│ Integration Tests      │ ~5-8min  │ Ja (3)       │
│ SonarCloud             │ ~2-3min  │ Ja (4)       │
│ Checkov                │ ~1-2min  │ Ja (1)       │
│ Security Summary       │ ~1min    │ Ja (5)       │
│ Quality Gate           │ ~30s     │ Nein         │
└────────────────────────┴──────────┴──────────────┘

(1) Wenn keine Änderungen
(2) Wenn Backend unverändert
(3) Wenn Build übersprungen
(4) Wenn Tests übersprungen
(5) Wenn keine Scans
```

---

### Smart Change Detection

**Path-Filter-Logik:**

```yaml
backend:
  - "nestjs_backend/**"
  - ".env"
  - "docker-compose.yml"
  - ".github/workflows/**"

frontend:
  - "flutter_frontend/**"

infrastructure:
  - "docker-compose.yml"
  - "Dockerfile"
  - ".github/**"
```

**Vorteile:**

- Nur relevante Jobs laufen
- 40-60% Zeitersparnis möglich
- Ressourcen-effizient

---

## 7. Demo & Ergebnisse

### Beispiel-Pipeline-Lauf

**Szenario:**  
Backend-Code geändert, Push auf `development`

**Ausgeführte Jobs:**

```
Initialize (30s)
   ├── Änderungen erkannt: backend
   └── Version: dev-abc1234

Parallele Security Scans:
   ├── Gitleaks (1m 15s) - Keine Secrets
   ├── OWASP (4m 30s) - 2 HIGH gefunden
   ├── CodeQL (8m 45s) - Keine Issues
   └── Checkov (1m 45s) - 3 MEDIUM

Build Backend (2m 30s)
   ├── Dependencies installiert
   ├── License Check bestanden
   └── Build erfolgreich

Docker Build & Trivy (4m 15s)
   ├── Image gebaut
   ├── FS Scan: 1 HIGH
   └── Image Scan: 0 CRITICAL

Integration Tests (6m 30s)
   ├── Unit Tests: 45 passed
   ├── E2E Tests: 12 passed
   └── Coverage: 82%

SonarCloud (2m 45s)
   └── Quality Gate: PASSED (A)

Security Summary (45s)
   └── Report generiert

Quality Gate (15s)
   └── Pipeline SUCCESSFUL
```

**Gesamtzeit:** 18 Minuten 30 Sekunden

---

### Beispiel: Gefundene Schwachstellen

**OWASP Dependency Check:**

```
Package: lodash@4.17.19
CVE: CVE-2020-8203
Severity: HIGH
CVSS Score: 7.4

Beschreibung:
Prototype Pollution vulnerability ermöglicht
Angreifern, Object-Properties zu manipulieren.

Lösung:
Update auf lodash@4.17.21 oder höher
```

**Trivy Container Scan:**

```
Package: openssl (OS Package)
CVE: CVE-2024-XXXXX
Severity: HIGH
CVSS Score: 8.1

Beschreibung:
Buffer Overflow in OpenSSL-Bibliothek

Lösung:
Base Image aktualisieren
```

---

### Security Summary Dashboard

**Visualisierung der Ergebnisse:**

```
Vulnerability Dashboard

╔═══════════════════════════════════════╗
║  🔴 Critical: 0                       ║
║  🟠 High:     3                       ║
║  🟡 Medium:   8                       ║
║  🔵 Low:      15                      ║
╚═══════════════════════════════════════╝

Scan-Details:
├── Gitleaks:        ✅ 0 Secrets
├── OWASP:           ⚠️ 2 High, 5 Medium
├── CodeQL:          ✅ 0 Issues
├── Trivy (FS):      ⚠️ 1 High, 3 Medium
├── Trivy (Image):   ✅ 0 Critical
└── Checkov:         ⚠️ 5 Medium

Trend:
  Letzte Woche: 4 High → Diese Woche: 3 High
  Verbesserung: -25%
```

---

### PR-Kommentar Beispiel

**Automatischer Kommentar auf Pull Request:**

```markdown
## Monorepo Security Scan Summary

**Pipeline Run:** #123
**Branch:** feature/new-endpoint
**Backend Changed:** Yes

### Vulnerability Overview

| Severity    | Count |
| ----------- | ----- |
| 🔴 Critical | 0     |
| 🟠 High     | 2     |
| 🟡 Medium   | 5     |
| 🔵 Low      | 12    |

### Scan Results

#### Gitleaks: No secrets detected

#### Backend OWASP: 2 high, 5 medium

- lodash@4.17.19 (HIGH - CVE-2020-8203)
- axios@0.21.0 (HIGH - CVE-2021-3749)

#### CodeQL: No issues

#### Trivy: 1 high, 3 medium

#### Checkov: 5 medium findings

### Detailed Reports

All reports available as artifacts in workflow run.

---

_Generated by NestJS Monorepo CI/CD Pipeline_
```

---

## 8. Zusammenfassung

### Erreichte Ziele

**Umfassende Sicherheit**

- 6-Schichten Sicherheitsarchitektur
- Automatisierte Schwachstellenerkennung
- Kontinuierliches Monitoring

**Automatisierung**

- Vollständig automatisierte Pipeline
- Dependabot-Integration
- Wöchentliche Audits

**Qualitätssicherung**

- Automatisierte Tests
- Code Coverage Tracking
- SonarCloud-Integration

**DevSecOps Best Practices**

- Security in jeder Phase
- Shift-Left-Ansatz
- SARIF-Standardisierung

---

### Wichtigste Features

**1. Multi-Tool Security Stack**

```
Gitleaks + OWASP + CodeQL + Trivy + Checkov + SonarCloud
= Umfassende Abdeckung aller Sicherheitsaspekte
```

**2. Smart Change Detection**

```
Nur relevante Jobs ausführen
= 40-60% schnellere Pipeline-Läufe
```

**3. Automatische Reporting**

```
PR-Kommentare + GitHub Issues + Security Tab
= Vollständige Transparenz
```

**4. Parallele Ausführung**

```
Unabhängige Jobs parallel
= Optimale Ressourcennutzung
```

---

### Gelernte Lektionen

**1. Sicherheits-Tools Kombination**

- Kein Tool findet alles
- Mehrschichtige Verteidigung essentiell
- SARIF-Format als Standard

**2. Pipeline-Performance**

- Caching ist kritisch
- Change Detection spart Zeit
- Parallele Ausführung wichtig

**3. Automatisierung**

- Manuelle Reviews reduzieren
- Aber: Kritische Checks bleiben manuell
- Balance zwischen Automation & Control

**4. Reporting & Visibility**

- Klare Reports essentiell
- GitHub Security Tab nutzen
- Automatische Issue-Erstellung

---

### Zahlen & Fakten

```
Pipeline-Statistiken:

  11   Jobs in Hauptpipeline
  100+ Pipeline-Schritte
  6    Sicherheits-Tools
  3    Automatisierte Workflows
  10   Artefakt-Typen
  90   Tage Aufbewahrung

Zeiten:

  25-40min  Volle Pipeline
  10-15min  Mit Smart Skipping
  2min      Schnellster Job (SonarCloud)
  10min     Langsamster Job (CodeQL)

Sicherheit:

  100%  Secret Scanning Coverage
  100%  Dependency Scanning
  100%  Container Scanning
  100%  IaC Scanning
```

---

### Weiterentwicklung

**Geplante Erweiterungen:**

**1. Flutter Frontend Pipeline**

```
- Dart Code-Analyse
- Widget Tests
- Mobile App Security
```

**2. Deployment-Automation**

```
- Kubernetes Deployment
- Helm Chart Validation
- Blue/Green Deployment
```

**3. Advanced Monitoring**

```
- Performance Testing
- Load Testing
- Runtime Security
```

**4. Notifications**

```
- Slack Integration
- Email Reports
- Discord Webhooks
```

---

### Best Practices

**1. Security First**

```yaml
✓ Secrets nie im Code
✓ Dependencies aktuell halten
✓ Regelmäßige Audits
✓ Mehrschichtige Verteidigung
```

**2. Pipeline-Design**

```yaml
✓ Modulare Jobs
✓ Wiederverwendbare Actions
✓ Smart Change Detection
✓ Parallele Ausführung
```

**3. Testing**

```yaml
✓ Unit + E2E Tests
✓ Coverage > 80%
✓ Produktionsähnliche Umgebung
✓ Automatisierte Regression
```

**4. Monitoring**

```yaml
✓ Zentrale Dashboards
✓ Automatische Reports
✓ Trend-Analyse
✓ Proaktive Alerts
```

---

### Compliance & Standards

**Erfüllte Standards:**

```
OWASP Top 10
  - Injection
  - Broken Authentication
  - Sensitive Data Exposure
  - XML External Entities
  - Broken Access Control
  - Security Misconfiguration
  - XSS
  - Insecure Deserialization
  - Using Components with Known Vulnerabilities
  - Insufficient Logging & Monitoring
```

**Weitere:**

- CWE (Common Weakness Enumeration)
- CVE (Common Vulnerabilities and Exposures)
- SARIF (Static Analysis Results Format)

---

### Kosten-Nutzen-Analyse

**Investition:**

- Pipeline-Setup: ~40 Stunden
- Konfiguration: ~10 Stunden
- Dokumentation: ~8 Stunden

**Nutzen:**

- Automatische Schwachstellenerkennung
- 90% weniger manuelle Security-Reviews
- Früherkennung von Problemen
- Compliance-Nachweise
- Reduziertes Sicherheitsrisiko

**ROI:**

```
Zeit für manuelle Reviews gespart: ~20h/Monat
Frühzeitige Fehlererkennung: Unbezahlbar
Automatisierte Compliance: Prüfungskosten -50%
```

---

### Technische Herausforderungen

**1. Tool-Integration**

```
Problem: Verschiedene Output-Formate
Lösung: SARIF als Standard
```

**2. Performance-Optimierung**

```
Problem: Lange Pipeline-Laufzeiten
Lösung: Caching + Change Detection
```

**3. False Positives**

```
Problem: Zu viele unwichtige Warnungen
Lösung: Tool-Konfiguration + Severity-Filter
```

**4. Dependency-Konflikte**

```
Problem: Breaking Changes bei Updates
Lösung: Staged Update-Strategie
```

---

### Skalierbarkeit

**Aktuell:**

```
1 Backend (NestJS)
1 Frontend (Flutter - vorbereitet)
1 Monorepo
```

**Skalierbar auf:**

```
✓ Mehrere Microservices
✓ Mehrere Frontends
✓ Multi-Cloud Deployment
✓ Polyrepo-Architektur
```

**Design-Prinzipien:**

- Wiederverwendbare Actions
- Modulare Job-Struktur
- Flexible Trigger-Konfiguration
- Matrix-Strategien

---

### Sicherheits-Metriken

**Erfasste Metriken:**

```
┌─────────────────────────────┬────────────┐
│ Metrik                      │ Aktuell    │
├─────────────────────────────┼────────────┤
│ Secrets gefunden            │ 0          │
│ Critical Vulnerabilities    │ 0          │
│ High Vulnerabilities        │ 3          │
│ Code Coverage               │ 82%        │
│ SonarCloud Rating           │ A          │
│ License Compliance          │ 100%       │
│ IaC Security Score          │ 95%        │
└─────────────────────────────┴────────────┘
```

**Trends:**

- Keine kritischen Findings seit 4 Wochen
- Coverage-Steigerung von 75% → 82%
- High-Schwachstellen von 7 → 3

---

### Vergleich: Vorher vs. Nachher

**Vorher (Manuell):**

```
Security-Reviews: Manuell, unregelmäßig
Dependency-Updates: Vergessen
Tests: Lokal, nicht konsistent
Code-Qualität: Nicht gemessen
Deployment: Manuell, fehleranfällig
Zeit pro Release: ~4 Stunden
```

**Nachher (Automatisiert):**

```
Security-Reviews: Automatisch, jeden Commit
Dependency-Updates: Wöchentlich, automatisch
Tests: CI/CD, konsistent
Code-Qualität: Kontinuierlich gemessen
Deployment: Automatisiert (geplant)
Zeit pro Release: ~15 Minuten
```

**Verbesserung:** 94% Zeitersparnis

---

### Lessons Learned - Praxistipps

**1. Start Simple, Scale Gradually**

```
Beginne mit essentiellen Tools
  → Füge schrittweise mehr hinzu
  → Lerne aus Ergebnissen
```

**2. False Positives managen**

```
Konfiguriere Tools präzise
  → Filtere nach Severity
  → Dokumentiere Ausnahmen
```

**3. Team-Buy-In**

```
Zeige Mehrwert früh
  → Involviere Team in Prozess
  → Schulungen anbieten
```

**4. Monitoring ist essentiell**

```
Richte Dashboards ein
  → Überwache Trends
  → Reagiere proaktiv
```

---

### Toolvergleich

**Secret Scanning:**

```
Gitleaks vs. TruffleHog vs. git-secrets
→ Gitleaks gewählt: GitHub-Integration
```

**Dependency Scanning:**

```
OWASP vs. Snyk vs. npm audit
→ OWASP gewählt: Open-Source, umfassend
```

**Container Scanning:**

```
Trivy vs. Clair vs. Anchore
→ Trivy gewählt: Schnell, einfach
```

**SAST:**

```
CodeQL vs. SonarQube vs. Semgrep
→ CodeQL gewählt: GitHub-native
```

---

### Integration mit GitHub

**GitHub Features genutzt:**

```
GitHub Actions (CI/CD)
GitHub Security Tab
Dependabot Alerts
SARIF Upload
Issue Automation
PR Comments
Branch Protection
Status Checks
```

**Vorteile:**

- Zentrale Platform
- Native Integration
- Keine zusätzlichen Tools nötig
- Team-Kollaboration vereinfacht

---

### Empfehlungen für andere Projekte

**1. Klein anfangen:**

```
Phase 1: Basic CI/CD + Tests
Phase 2: Security Scanning hinzufügen
Phase 3: Erweiterte Features
```

**2. Priorisierung:**

```
Must-Have:
  - Secret Scanning
  - Dependency Scanning
  - Automated Tests

Nice-to-Have:
  - Code Quality
  - IaC Scanning
  - Advanced Metrics
```

**3. Tool-Auswahl:**

```
Kriterien:
  ✓ GitHub-Integration
  ✓ Open-Source bevorzugt
  ✓ SARIF-Support
  ✓ Community & Support
```

---

### Ressourcen & Links

**Dokumentation:**

```
GitHub Actions: docs.github.com/actions
OWASP: owasp.org
Trivy: trivy.dev
Gitleaks: github.com/gitleaks/gitleaks
CodeQL: codeql.github.com
```

**Best Practices:**

```
OWASP DevSecOps Guideline
GitHub Security Best Practices
Docker Security Best Practices
NestJS Documentation
```

**Community:**

```
GitHub Discussions
OWASP Community
NestJS Discord
```

---

### Projektmetriken

**Code-Statistiken:**

```
Backend (NestJS):
  ├── TypeScript Files: ~50
  ├── Lines of Code: ~2,500
  ├── Test Files: ~30
  └── Test Coverage: 82%

Infrastructure:
  ├── Workflows: 3
  ├── Jobs: 11
  ├── Steps: 100+
  └── Reusable Actions: 1

Documentation:
  ├── README.md: ~1,200 Zeilen
  ├── PRESENTATION_DE.md: ~1,500 Zeilen
  └── Inline Comments: Umfassend
```

---

### Q&A - Häufige Fragen

**Q: Wie lange dauert ein durchschnittlicher Pipeline-Lauf?**

```
A: 25-40 Minuten vollständig
   10-15 Minuten mit Smart Skipping
```

**Q: Was passiert bei kritischen Schwachstellen?**

```
A: - Pipeline schlägt fehl
   - Automatisches Issue wird erstellt
   - PR kann nicht gemerged werden
```

**Q: Kosten der Pipeline?**

```
A: GitHub Actions: 2,000 Minuten/Monat kostenlos
   Für dieses Projekt: Innerhalb Free Tier
   SonarCloud: Kostenlos für Open Source
```

**Q: Wie werden False Positives behandelt?**

```
A: - Tool-spezifische Ignorier-Dateien
   - Dokumentierte Ausnahmen
   - Regelmäßige Reviews
```

---

### Live-Demo Checkliste

**Vorbereitung für Demo:**

```
☐ Repository auf GitHub öffnen
☐ Actions Tab zeigen
☐ Workflow-Run auswählen
☐ Job-Details durchgehen
☐ Artefakte zeigen
☐ Security Tab demonstrieren
☐ PR mit Kommentar zeigen
☐ Scheduled Scan Issue zeigen
☐ SonarCloud Dashboard (optional)
```

**Demo-Ablauf:**

1. Pipeline-Übersicht
2. Security Scans in Detail
3. Test-Ergebnisse
4. Security Summary
5. GitHub Security Tab
6. Artefakte

---

### Fazit

**Kernaussagen:**

**Automatisierung ist essentiell**

- Manuelle Prozesse sind fehleranfällig
- CI/CD ermöglicht Konsistenz
- Zeit- und Kostenersparnis

**Security muss integriert sein**

- Nicht nachträglich hinzufügen
- In jeder Phase berücksichtigen
- Mehrschichtige Verteidigung

**Tools richtig kombinieren**

- Kein Tool findet alles
- SARIF als Standard nutzen
- GitHub-Integration bevorzugen

**Continuous Improvement**

- Pipeline ist nie "fertig"
- Regelmäßige Reviews
- An neue Bedrohungen anpassen

---

### Projektabschluss

**Projektziele erreicht:**

Produktionsreife Pipeline entwickelt  
6 Security-Tools integriert  
Vollständige Automatisierung  
Umfassende Dokumentation  
Best Practices demonstriert

**Technologien gemeistert:**

GitHub Actions  
Docker & Containerization  
NestJS Framework  
Security Scanning Tools  
DevSecOps Workflows

**Lernziele erfüllt:**

CI/CD Pipeline Design  
Security Integration  
Automation Patterns  
Quality Assurance

---

## Vielen Dank für Ihre Aufmerksamkeit!

### Kontakt & Ressourcen

**Projekt-Repository:**  
https://github.com/ActiveClientMods/IT-Security-CI-CD

**Dokumentation:**  
README.md im Repository

**Tools & Ressourcen:**  
Siehe Links in der Präsentation

---

**Fragen?**

---

**Built with ❤️ for IT Security Education**

_Universitätsprojekt 2025_
