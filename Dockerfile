FROM node:lts-slim as base
WORKDIR /usr/src/app

ENV HUSKY=0 \ 
    CI=true \
    LOG_LEVEL=info

COPY --chown=node:node yarn.lock package.json .yarnrc.yml ./
COPY --chown=node:node .yarn/ .yarn/

FROM base as builder
WORKDIR /usr/src/app

COPY --chown=node:node tsconfig.base.json ./
COPY --chown=node:node src/ src/

RUN yarn install --immutable
RUN yarn run build

FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV="production"

RUN yarn workspaces focus --all --production
COPY --chown=node:node --from=builder /usr/src/app/dist dist

USER node
CMD [ "yarn", "run", "start"]
