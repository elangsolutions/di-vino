# Frontend GraphQL Code Generation Guide

## Quick Start

### Generate GraphQL Types (One-Time)
```bash
cd apps/frontend
npm run codegen
```

This will generate/update `src/generated/graphql.ts` from the backend GraphQL schema.

### Watch Mode (During Development)
```bash
cd apps/frontend
npm run codegen:watch
```

This watches for schema changes and automatically regenerates types.

---

## How It Works

### The Setup
1. **Backend GraphQL Schema**: Located at `apps/backend/src/schema.gql`
2. **Codegen Configuration**: `codegen.yml` in frontend directory
3. **Generated Types**: `src/generated/graphql.ts`

### Configuration Details (`codegen.yml`)
```yaml
schema: '../backend/src/schema.gql'  # Points to backend schema
documents: 'src/**/*.ts'              # Finds all queries/mutations
generates:
  src/generated/graphql.ts:           # Output file
    plugins:
      - typescript                     # Generate TypeScript types
      - typescript-resolvers           # Generate resolver types
```

---

## Typical Workflow

### 1. Backend Changes → Frontend Types

**When you modify the backend GraphQL schema:**

```bash
# Build backend (generates schema.gql)
cd apps/backend
npm run build

# Generate frontend types
cd ../frontend
npm run codegen

# Now graphql.ts is updated with new types
```

### 2. During Active Development

**Terminal 1 - Watch backend schema**
```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Watch frontend types**
```bash
cd apps/frontend
npm run codegen:watch
```

**Terminal 3 - Develop frontend**
```bash
cd apps/frontend
npm run dev
```

Now types update automatically whenever schema changes!

### 3. CI/CD Pipeline

```bash
# Build backend with schema generation
cd apps/backend
npm run build:commit

# Generate frontend types
cd ../frontend
npm run codegen

# Commit if types changed
git add src/generated/graphql.ts
git commit -m "chore: update graphql types" || true
```

---

## What Gets Generated

The `graphql.ts` file contains:

✅ **Type Definitions**
```typescript
export type Product = {
  __typename?: 'Product';
  _id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  // ... all fields from schema
};
```

✅ **Query & Mutation Types**
```typescript
export type Query = {
  products: Array<Product>;
  product: Product;
  // ... all queries
};

export type Mutation = {
  addProduct: Product;
  // ... all mutations
};
```

✅ **Input Types**
```typescript
export type AddProductInput = {
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  // ... all input fields
};
```

✅ **Resolver Types** (for backend if needed)
```typescript
export type ProductResolvers<ContextType = any> = {
  _id?: Resolver<...>;
  name?: Resolver<...>;
  // ... type-safe resolvers
};
```

---

## Using Generated Types in Frontend

### In React Components
```typescript
import { Product } from '../generated/graphql';

interface ProductCardProps {
  product: Product;  // ✅ Type-safe!
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </div>
  );
};
```

### In GraphQL Queries
```typescript
import { gql } from '@apollo/client';
import { Product } from '../generated/graphql';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      _id
      name
      price
    }
  }
`;

// Apollo automatically types the response as Product[]
const { data } = useQuery(GET_PRODUCTS);
// data.products is typed as Product[]
```

### In Redux Store
```typescript
import { Product } from '../generated/graphql';

interface ProductState {
  items: Product[];  // ✅ Type-safe products
  loading: boolean;
}
```

---

## Troubleshooting

### Schema not found?
```bash
# Make sure backend schema is generated
cd apps/backend
npm run generate:schema

# Then regenerate frontend types
cd ../frontend
npm run codegen
```

### Types not updating?
```bash
# Clear cache and regenerate
rm -rf src/generated/graphql.ts
npm run codegen
```

### GraphQL Codegen not installed?
```bash
# Install graphql-codegen
npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-resolvers
```

### Watch mode not working?
Make sure you have the watch plugin:
```bash
npm install --save-dev @graphql-codegen/cli
```

Then use:
```bash
npm run codegen:watch
```

---

## Best Practices

✅ **Generate after backend changes**
Every time you modify GraphQL schema/resolvers, run codegen

✅ **Commit generated files**
```bash
git add src/generated/graphql.ts
git commit -m "chore: update graphql types"
```

✅ **Use types for type safety**
Always import and use generated types in components

✅ **Keep schema and types in sync**
Don't manually edit `graphql.ts` - regenerate it

❌ **Don't manually edit graphql.ts**
It's auto-generated and will be overwritten

❌ **Don't commit without running codegen**
Schema changes must have corresponding type updates

---

## Summary

| Command | Purpose |
|---------|---------|
| `npm run codegen` | Generate types once |
| `npm run codegen:watch` | Watch and auto-generate |
| `npm run build` | Build frontend (includes TypeScript check) |

Your frontend now has type-safe GraphQL integration! 🚀

