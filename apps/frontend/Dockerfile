# syntax=docker/dockerfile:1

##### Build #####
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

##### Runtime #####
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g serve

COPY --from=build /app/dist ./dist

# Railway injects PORT at runtime; fall back to 3000 for local `docker run`
EXPOSE 3000
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
