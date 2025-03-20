FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (including bcrypt and its bindings)
RUN npm install

# Copy the rest of the files
COPY . .

# Rebuild bcrypt native bindings for the current architecture (if necessary)
RUN npm rebuild bcrypt --build-from-source

RUN mkdir -p /app/uploads

# Build the app
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Run the app
CMD ["node", "dist/src/main.js"]
