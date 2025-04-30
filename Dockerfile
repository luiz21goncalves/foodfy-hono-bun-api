FROM oven/bun:1.2.11-alpine AS base
WORKDIR /usr/src/app

FROM base AS dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --ignore-scripts --production

FROM base AS release
COPY --from=dependencies /temp/prod/node_modules node_modules
COPY src src
COPY package.json .
COPY tsconfig.json .
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
