# ---------- Stage 1: Build the Next.js app ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY next.config.mjs tailwind.config.js postcss.config.mjs jsconfig.json ./
COPY public ./public
COPY src ./src

# Build and export the static site
RUN npm run build && npm run export

# ---------- Stage 2: Serve the static site ----------
FROM node:18-alpine AS runner

# Install serve globally
RUN npm install -g serve

WORKDIR /app

# Copy exported static site
COPY --from=builder /app/out ./

# Expose the port Next.js will run on
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", ".", "-l", "3000"]

