# Production stage
FROM nginx:alpine

WORKDIR /app

# Copy the built React files to Nginx's HTML folder
COPY dist/apps/admin-portal /usr/share/nginx/html/lpg_manager_admin_portal

# Copy nginx.conf file to rewrite to index.html
COPY apps/admin-portal/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]




