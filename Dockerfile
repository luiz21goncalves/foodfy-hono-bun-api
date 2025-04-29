FROM oven/bun:1.2.11-alpine AS base
WORKDIR /usr/src/app

FROM base AS dependencies
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile --ignore-scripts

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --ignore-scripts --production

FROM base AS builder
COPY --from=dependencies /temp/dev/node_modules node_modules
COPY . .
RUN bun run build

FROM base AS release
COPY --from=dependencies /temp/prod/node_modules node_modules
COPY --from=builder /usr/src/app/dist dist
COPY --from=builder /usr/src/app/package.json .
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
