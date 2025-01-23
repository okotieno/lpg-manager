FROM docker.io/node:lts-alpine

# Set environment variables for the app
ENV HOST=0.0.0.0
ENV PORT=3000

# Create working directory
WORKDIR /app

# Copy package.json application source code
COPY apps/backend/deploy-package.json package.json
COPY dist/apps/backend/package.json backend/package.json

# Install pnpm globally
RUN npm i -g pnpm

# Install build and runtime dependencies
RUN pnpm add -D nx@latest pg sequelize-cli sequelize @nestjs/config bcrypt

#Change working directory to backend
WORKDIR /app/backend
RUN pnpm i

# Go back to app
WORKDIR /app

# Copy the application source code
COPY apps/backend apps/backend
COPY libs/backend libs/backend

# Copy built application to the final directory
COPY dist/apps/backend backend/

CMD ["pnpm", "db:migrate", "&&", "node", "backend"]

