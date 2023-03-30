FROM node:lts-alpine3.17 as development

WORKDIR /src/frontend

COPY package* /src/frontend/

RUN npm ci

EXPOSE 5173

CMD ["npm", "run", "dev"]
