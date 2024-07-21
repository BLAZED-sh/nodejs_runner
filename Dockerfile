FROM node:21-alpine3.18

RUN apk update && apk add --no-cache dumb-init

ARG UNAME=node
ARG UID=1000
ARG GID=1000
RUN groupadd -g $GID -o $UNAME
RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME
USER $UNAME

EXPOSE 42069

ADD . .

ENTRYPOINT ["dumb-init", "node", "index.js"]
