FROM node:20-alpine

# Install PM2 globally
RUN npm install -g pm2

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3001

# Start with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]