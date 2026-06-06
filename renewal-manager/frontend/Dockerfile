FROM node:20-alpine

WORKDIR /app

# نصب وابستگی‌ها
COPY package.json ./
RUN npm install

# کپی سورس‌کدها
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]