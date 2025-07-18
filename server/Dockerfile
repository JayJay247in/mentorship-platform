# ---- Stage 1: The Builder ----
# Start with a Node.js image that has the full toolchain
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy the prisma schema to generate the client
COPY prisma ./prisma/

# This is a critical step for Prisma. It ensures the Prisma client is generated for the container's OS (Linux).
RUN npx prisma generate

# Copy the rest of the application source code
COPY . .

# Run the build script from package.json to compile TypeScript to JavaScript
RUN npm run build


# ---- Stage 2: The Runner ----
# Start from a slim Node.js image for a smaller production container
FROM node:20-alpine

WORKDIR /app

# Copy package files again
COPY package*.json ./

# Install ONLY production dependencies. This makes the container much smaller.
RUN npm install --only=production

# Copy the compiled 'dist' folder from the 'builder' stage
COPY --from=builder /app/dist ./dist

# Copy the Prisma schema and the generated client for runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

# Expose the port the server runs on
EXPOSE 5000

# The command to run when the container starts. It runs the compiled JavaScript.
CMD [ "npm", "start" ]