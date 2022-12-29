FROM node:18 as base
WORKDIR /app
COPY package*.json ./


FROM base as development
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["react-scripts", "start"]

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /