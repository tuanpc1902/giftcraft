# Next.js — development image (hot reload via bind mount)
FROM node:20-alpine

WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci

# App source (overridden by bind mount in compose for hot reload)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
