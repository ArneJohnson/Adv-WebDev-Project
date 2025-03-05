# Use official Node.js image as a base
FROM node:16-alpine as build

# Set the working directory
WORKDIR /

# Copy package files for npm install (only package.json and package-lock.json)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend files
COPY backend /backend

# Expose the application port
EXPOSE 3001

# Command to run the app using wait-for-it to wait for DB
CMD ["stores_db:5432", "--", "node", "backend/server.js"]