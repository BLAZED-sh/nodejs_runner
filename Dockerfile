FROM node:21-alpine3.18

EXPOSE 42069

ADD . .

ENTRYPOINT ["node", "index.js"]
