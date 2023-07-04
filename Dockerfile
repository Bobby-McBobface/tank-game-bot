FROM node:lts-slim as base
WORKDIR /usr/src/app

ENV HUSKY=0 \ 
    CI=true \
    LOG_LEVEL=info

COPY --chown=node:node pnpm-lock.yaml package.json .npmrc ./
RUN corepack enable

FROM base as builder
WORKDIR /usr/src/app

RUN pnpm install --frozen-lockfile

COPY --chown=node:node tsconfig.base.json ./
COPY --chown=node:node src/ src/

RUN pnpm run build

FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV="production"

COPY --chown=node:node assets/ assets/
COPY --chown=node:node --from=builder /usr/src/app/dist dist

RUN pnpm prune --prod

USER node
CMD [ "pnpm", "run", "start"]
