FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Remove cached directory that can cause EBUSY on some platforms
RUN rm -rf node_modules/.cache || true

# Build the app
RUN npm run build

EXPOSE 3000

# Start the app (bind to all interfaces)
CMD ["npm", "run", "start"]
