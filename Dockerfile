FROM node:18-alpine

WORKDIR /app

# Установка зависимостей Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 5001

CMD ["npm", "run", "start:prod"]