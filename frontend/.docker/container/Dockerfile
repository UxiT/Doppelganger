FROM node:24-alpine3.20

ARG DEBIAN_FRONTEND=noninteractive

ENV ENV_SUBSTITUTION_ENABLE=true
ENV TZ=UTC
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

RUN apk update
RUN apk add --no-cache make python3 py3-pip gcc g++

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]