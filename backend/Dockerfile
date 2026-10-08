FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
COPY .env.example ./.env.example
EXPOSE 5000
CMD ["sh","-c","npx prisma db push && node prisma/seed.js && node src/server.js"]
