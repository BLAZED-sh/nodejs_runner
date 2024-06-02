FROM node:21-alpine3.18

RUN apk update && apk add --no-cache dumb-init

EXPOSE 42069

ADD . .

USER node

ENTRYPOINT ["dumb-init", "node", "index.js"]
