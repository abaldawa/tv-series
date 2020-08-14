FROM node:14-alpine
WORKDIR /usr/src/tv-series/server
COPY ./server/package*.json ./
RUN npm i
WORKDIR /usr/src/tv-series
COPY . .
WORKDIR /usr/src/tv-series/server
EXPOSE 3000
CMD ["npm", "start"]