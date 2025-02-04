# Production stage
FROM nginx:alpine

WORKDIR /app

# Copy the built React files to Nginx's HTML folder
COPY dist/apps/app-library/browser /usr/share/nginx/html

# Copy nginx.conf file to rewrite to index.html
COPY apps/app-library/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]




