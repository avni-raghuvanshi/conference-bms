FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate && npx next build

EXPOSE 8080

# Migrations run at container start (DATABASE_URL is injected by Cloud Run at this point)
CMD sh -c "npx prisma migrate deploy && npx next start -p ${PORT:-8080}"
