FROM node:14-slim

WORKDIR /user/src/app

COPY ./package.json ./

COPY ./package-lock.json ./

COPY . .

RUN npm install

# port inside container
EXPOSE 3000

CMD ["npm", "start"]
