# syntax=docker/dockerfile:1

##### Base #####
FROM node:22-alpine AS base
WORKDIR /app

##### Dependencies (all, needed to run the Nest build) #####
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

##### Build #####
FROM base AS build
COPY package.json yarn.lock ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

##### Production dependencies only #####
FROM base AS prod-deps
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
