FROM node:21-alpine3.18

RUN apk update && apk add --no-cache dumb-init

WORKDIR /app

EXPOSE 42069

ADD . .

RUN npm install

ENTRYPOINT ["dumb-init", "node", "index.js"]
