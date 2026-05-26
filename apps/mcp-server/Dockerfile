FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build typescript
RUN npm run build

# Start the application
EXPOSE 8080
CMD ["npm", "start"]
