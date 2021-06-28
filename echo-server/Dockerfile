ARG ERAP_REGISTRY

#-----------------------------------------------
# Base image to use for the other images in
#   build
#-----------------------------------------------
FROM ${ERAP_REGISTRY}erap_node:latest as base
COPY package.json .

#-----------------------------------------------
# Gather the dependencies for the application
#-----------------------------------------------
FROM base as dependencies

RUN npm set progress=false \
&&  npm config set depth 0 \
&&  npm install --only=production

FROM base as verify

COPY . .
RUN echo 'node_modules/' > /usr/src/.gitignore
RUN npm i && npm run lint && npm run test

#-----------------------------------------------
# The main production image which will be stored
#-----------------------------------------------
FROM base

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
ENV PORT 3000

EXPOSE ${PORT}
CMD npm run start
