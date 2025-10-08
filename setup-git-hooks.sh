#!/bin/bash
# setup-git-hooks.sh - One-command Git hooks setup

echo "Setting up automatic Git hooks for linting and formatting..."

# Initialize git repository if it doesn't exist
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    if [ $? -ne 0 ]; then
        echo "❌ Failed to initialize git repository"
        exit 1
    fi
fi

# Create package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "Creating package.json..."
    npm init -y
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create package.json"
        exit 1
    fi
fi

# Install dependencies
echo "Installing dependencies..."
npm install --save-dev \
  eslint \
  prettier \
  lint-staged \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-config-prettier \
  eslint-plugin-prettier \
  @eslint/eslintrc \
  @eslint/js \
  typescript-eslint \
  typescript \
  ts-node \
  globals \
  @types/node

# Create src directory if it doesn't exist
mkdir -p src

# Add scripts to package.json
echo "Adding scripts to package.json..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.lint = 'eslint src/**/*.ts';
pkg.scripts['lint:fix'] = 'eslint src/**/*.ts --fix';
pkg.scripts.format = 'prettier --check src/**/*.ts';
pkg.scripts['format:fix'] = 'prettier --write src/**/*.ts';
pkg.scripts.precommit = 'lint-staged';
pkg['lint-staged'] = {
  'src/**/*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  'src/**/*.{json,md}': ['prettier --write']
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Create ESLint configuration if it doesn't exist
if [ ! -f "eslint.config.mjs" ]; then
    echo "Creating eslint.config.mjs..."
    cat > eslint.config.mjs << 'EOF'
// @ts-check
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    // Modern way to ignore files (replaces deprecated .eslintignore)
    ignores: [
      "eslint.config.mjs",
      "dist/**",
      "node_modules/**",
      "build/**",
      "*.js",
      "*.d.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "prettier/prettier": "warn", // Make Prettier issues warnings, not errors
    },
  },
);
EOF
fi



# Create Prettier configuration if it doesn't exist
if [ ! -f ".prettierrc.json" ]; then
    echo "Creating .prettierrc.json..."
    cat > .prettierrc.json << 'EOF'
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "trailingComma": "all",
  "endOfLine": "auto"
}
EOF
fi

# Create .prettierignore if it doesn't exist
if [ ! -f ".prettierignore" ]; then
    echo "Creating .prettierignore..."
    cat > .prettierignore << 'EOF'
node_modules/
dist/
build/
*.json
*.md
EOF
fi

# Create TypeScript configuration if it doesn't exist
if [ ! -f "tsconfig.json" ]; then
    echo "Creating tsconfig.json..."
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2024",
    "sourceMap": true,
    "outDir": "./dist",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << 'EOF'
node_modules
build
dist

# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
EOF
fi

# Create Git hooks
echo "Creating Git hooks..."
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
echo "Running pre-commit hook..."
echo "Running lint-staged (with auto-staging)..."
npx lint-staged

if [ $? -ne 0 ]; then
    echo "❌ Pre-commit hook failed - linting/formatting issues"
    exit 1
fi

echo "✅ Pre-commit hook completed successfully"
EOF

chmod +x .git/hooks/pre-commit

# Windows batch version
cat > .git/hooks/pre-commit.bat << 'EOF'
@echo off
echo Running pre-commit hook...
echo Running lint-staged (with auto-staging)...
npx lint-staged
if %errorlevel% neq 0 (
    echo ❌ Pre-commit hook failed - linting/formatting issues
    exit /b 1
)
echo ✅ Pre-commit hook completed successfully
EOF

echo "✅ Git hooks setup complete!"
echo ""
echo "Everything has been configured automatically:"
echo "  - Git repository initialized"
echo "  - Dependencies installed"
echo "  - ESLint configuration created (with modern ignores property)"
echo "  - Prettier configuration created"
echo "  - TypeScript configuration created"
echo "  - .gitignore created"
echo "  - Package.json scripts added"
echo "  - Git hooks configured"
echo ""
echo "Test with: git add . && git commit -m 'test'"
echo ""
echo "Your commits will now be automatically formatted!"