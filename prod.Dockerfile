# First stage to build only one image backend that using for all services
FROM node:12-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install
COPY . .
RUN npm run build

# Second stage use the output from first stage and start service with env
FROM node:12-alpine
ENV NODE_ENV=production
COPY --from=builder /usr/src/app .
EXPOSE ${PORT}
EXPOSE ${TCP}
