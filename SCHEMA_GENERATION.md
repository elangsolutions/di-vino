# GraphQL Schema Generation & Commit Guide

## Overview
This document explains how to generate and commit the GraphQL schema automatically during your build process.

## Available Commands

### 1. **Build with Schema Generation**
```bash
cd apps/backend
npm run build
```
This will:
- Build the NestJS application
- Generate the GraphQL schema (`src/schema.gql`)
- Output: `dist/` folder + updated `schema.gql`

### 2. **Build with Schema Generation & Auto-Commit**
```bash
cd apps/backend
npm run build:commit
```
This will:
- Build the NestJS application
- Generate the GraphQL schema
- Automatically commit the schema file with message: `chore: update graphql schema`
- ✅ Recommended for CI/CD pipelines

### 3. **Manual Schema Generation Only**
```bash
cd apps/backend
npm run generate:schema
```
This will:
- Only generate the GraphQL schema without building
- Useful for quick schema updates

### 4. **Manual Schema Commit**
```bash
cd apps/backend
npm run schema:commit
```
This will:
- Manually commit any changes to `src/schema.gql`
- Does not fail if there are no changes to commit (`|| true`)

## Workflow

### Development Workflow
1. Make changes to your GraphQL resolvers or types
2. Run the build command:
   ```bash
   npm run build
   ```
3. The schema will be automatically generated
4. Review the changes in `src/schema.gql`
5. Commit manually or use git as usual:
   ```bash
   git add .
   git commit -m "feat: add new GraphQL feature"
   ```

### CI/CD Workflow
For automated pipelines (GitHub Actions, GitLab CI, etc.):
```bash
# In your CI pipeline
cd apps/backend
npm run build:commit
git push origin branch-name
```

This ensures:
- ✅ Schema is always in sync with your code
- ✅ Schema changes are automatically committed
- ✅ No manual steps required in CI

## How It Works

### Schema Generation Script (`generate-schema.ts`)
The script creates a NestJS application context and NestJS GraphQL automatically generates the schema file at `src/schema.gql` based on:
- All `@Resolver()` classes
- All `@ObjectType()` classes
- All input types and mutations

### Auto-Commit Script
The `schema:commit` script:
1. Stages the schema file: `git add src/schema.gql`
2. Commits with a standard message: `chore: update graphql schema`
3. Returns success (0) even if there are no changes thanks to `|| true`

## Frontend Integration

### Sync Schema to Frontend
After building the backend, regenerate frontend types:
```bash
# In frontend directory
npm run codegen
```

This generates TypeScript types from the updated schema at `src/generated/graphql.ts`

### Full Build & Codegen Workflow
```bash
# Build backend with schema generation
cd apps/backend
npm run build:commit

# Generate frontend types
cd ../frontend
npm run codegen
```

## Git Workflow Example

```bash
# 1. Make changes to resolvers or types
git checkout -b feature/new-payment-field

# 2. Build backend (generates schema)
cd apps/backend
npm run build:commit

# 3. Generate frontend types
cd ../frontend
npm run codegen

# 4. Review changes
git status
# You'll see:
# - src/schema.gql (auto-committed)
# - src/generated/graphql.ts (from codegen)

# 5. Commit frontend changes
git add apps/frontend/src/generated/graphql.ts
git commit -m "feat: update graphql types for new payment field"

# 6. Push
git push origin feature/new-payment-field
```

## Troubleshooting

### Schema not being generated?
- Ensure all resolvers are properly decorated with `@Resolver()`
- Check that `app.module.ts` imports all resolver modules
- Verify GraphQL configuration in `main.tsx`

### Commit fails in CI?
- Ensure git is configured: `git config user.email "ci@example.com"`
- Check branch protection rules allow auto-commits
- Verify CI has push permissions

### Schema changes not appearing?
```bash
# Clear cache and rebuild
rm -rf dist/
npm run build
```

## Best Practices

✅ **Always regenerate schema before committing**
```bash
npm run build:commit
```

✅ **Commit schema separately from other changes**
The automatic commit keeps schema changes isolated

✅ **Review schema before merging**
```bash
git diff src/schema.gql
```

✅ **Keep frontend codegen in sync**
Every time schema changes, run frontend codegen

❌ **Don't manually edit `src/schema.gql`**
It's auto-generated and will be overwritten

❌ **Don't skip schema generation**
Stale schema causes frontend issues

## Environment Setup

No additional configuration needed! The setup works out of the box with:
- ✅ Git installed
- ✅ Node.js and npm
- ✅ NestJS CLI
- ✅ GraphQL plugin

## Summary

| Command | Purpose | When to Use |
|---------|---------|-----------|
| `npm run build` | Build + generate schema | Development |
| `npm run build:commit` | Build + generate + commit schema | CI/CD pipelines |
| `npm run generate:schema` | Only generate schema | Quick updates |
| `npm run schema:commit` | Only commit schema | Manual commits |

Your GraphQL schema is now automatically generated and committed! 🚀

