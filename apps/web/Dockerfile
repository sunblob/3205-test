FROM node:latest AS base

FROM base AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm add -g turbo
COPY . .

RUN turbo prune web --docker

FROM base AS installer
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo

WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm install

COPY --from=builder /app/out/full .
RUN turbo build --filter=web

FROM nginx as production-stage
RUN mkdir /app
COPY --from=installer /app/apps/web/dist /app
COPY --from=installer /app/apps/web/nginx.conf /etc/nginx/nginx.conf