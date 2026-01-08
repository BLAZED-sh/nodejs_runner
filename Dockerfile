FROM node:21-alpine3.18

RUN apk update && apk add --no-cache dumb-init

ARG UNAME=runner
ARG UID=1001
ARG GID=1001
RUN adduser -D $UNAME -g $GID -u $UID

# Add user to eth rpc group
RUN addgroup -g 1654 eth
RUN addgroup $UNAME eth

USER $UNAME

WORKDIR /app

# Code exec
EXPOSE 42069
# Debug
EXPOSE 42070

ADD . .

RUN corepack pnpm install

ENTRYPOINT ["dumb-init", "node", "--inspect=0.0.0.0:42070", "index.js"]
