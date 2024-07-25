FROM node:21-alpine3.18

RUN apk update && apk add --no-cache dumb-init

WORKDIR /app

# Code exec
EXPOSE 42069
# Debug
EXPOSE 42070

ADD . .

RUN corepack pnpm install

ENTRYPOINT ["dumb-init", "node", "--inspect", "127.0.0.1:42070", "index.js"]
