# stage1- base
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# stage2- install dev dependices (for building)
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude -d)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# stag3- BUILD BINARY
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
## build and make binary
RUN mkdir -p bin && \
    bun build src/index.ts \
    --compile \
    --outfile bin/llm

# stage4- Runtime (tiny final image)
FROM debian:bookworm-slim
 RUN apt-get update && \
    apt-get install -y \
    --no-install-recommends \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# create non-root user for security
RUN useradd -m -u 1001 llmuser

# copy only compiled binary 
COPY --from=prerelease /usr/src/app/bin/llm /usr/local/bin/llm

USER llmuser

ENTRYPOINT [ "llm" ]
CMD ["--help"]

