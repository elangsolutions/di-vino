# syntax=docker/dockerfile:1

##### Base #####
FROM node:22-alpine AS base
WORKDIR /app

##### Dependencies (all, needed to run the Nest build) #####
FROM base AS deps
# bcrypt needs a native compile on alpine when prebuilds are unavailable.
RUN apk add --no-cache python3 make g++
# Railway injects NODE_ENV=production into the build. Yarn then skips
# devDependencies (@nestjs/cli, typescript, …) and `yarn build` fails.
ENV NODE_ENV=development
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

##### Build #####
FROM base AS build
ENV NODE_ENV=development
COPY package.json yarn.lock ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

##### Production dependencies only #####
FROM base AS prod-deps
RUN apk add --no-cache python3 make g++
ENV NODE_ENV=production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

##### Runtime #####
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Railway injects PORT at runtime; Nest already reads it via process.env.PORT
EXPOSE 3000
CMD ["node", "dist/main"]
