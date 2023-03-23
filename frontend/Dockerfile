FROM node:lts-alpine3.17 as development

WORKDIR /frontend

COPY package* /frontend/

RUN npm ci

EXPOSE 5173

CMD ["npm", "run", "dev"]
