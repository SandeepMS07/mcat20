
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY next.config.mjs tailwind.config.js postcss.config.mjs jsconfig.json ./
COPY public ./public
COPY src ./src

# Build the static site (includes export automatically)
RUN npm run build

# ---------- Stage 2: Serve the static site ----------
FROM node:18-alpine AS runner

RUN npm install -g serve

WORKDIR /app

# Copy static output from build stage
COPY --from=builder /app/out ./

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]
