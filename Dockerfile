# Stage 1: Build Stage
FROM node:18-slim AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Runtime Stage
FROM node:18-slim AS runtime

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app/package.json /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public

# Install production dependencies only
RUN npm install --production

# Expose the port your application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]