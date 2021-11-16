FROM node:16-alpine

WORKDIR /app

# Copying the packge.json to the container
COPY package*.json ./

RUN npm install

# Copying everything inside the container
COPY . .

# Builkd the application to get the main.js file
RUN npm run build

# Exposing the port
EXPOSE 3000

CMD ["node","dist/main"]