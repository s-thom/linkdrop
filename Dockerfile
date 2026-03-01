ARG HOST=0.0.0.0
ARG PORT=4321

# base node image
FROM node:24-slim AS base

# set for base and all layer that inherit from it
ENV NODE_ENV=production
ENV HOST=${HOST}
ENV PORT=${PORT}

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base AS deps

WORKDIR /myapp

ADD package.json package-lock.json .npmrc ./
RUN npm ci --include=dev

# Setup production node_modules
FROM base AS production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base AS build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma /myapp/prisma
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

COPY --from=build /myapp/prisma /myapp/prisma
COPY --from=build /myapp/dist/server /myapp/dist/server
COPY --from=build /myapp/dist/client /myapp/dist/client
ADD . .

EXPOSE ${PORT}

CMD ["npm", "start"]
