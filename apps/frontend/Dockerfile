# syntax=docker/dockerfile:1

##### Build #####
FROM node:22-alpine AS build
WORKDIR /app

# Vite inlines VITE_* variables into the static bundle at build time, so they must be
# passed in as Docker build args (set them as Variables on the Railway service; Railway
# forwards them to `docker build` as build args with matching names).
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

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
