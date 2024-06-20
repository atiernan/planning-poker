# syntax=docker.io/docker/dockerfile:1.4

ARG NODE_VERSION=20

FROM node:${NODE_VERSION} AS build
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build


FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12
WORKDIR /opt/app
COPY --from=build /opt/app/.output ./.output
CMD ["/opt/app/.output/server/index.mjs"]
EXPOSE 3000/tcp