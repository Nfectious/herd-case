#!/bin/bash

###############################################################################
# Automated Deployment Script for Herd v. Progressive Case Website
# Domain: claim.bsapservices.com
# Server: Contabo VPS with Nginx + Cloudflare + Certbot
###############################################################################

set -e  # Exit on any error

echo "======================================================================"
echo "  Herd v. Progressive - Automated Deployment Script"
echo "  Domain: claim.bsapservices.com"
echo "======================================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="claim.bsapservices.com"
APP_DIR="/var/www/herd-case"
APP_NAME="herd-case"
NODE_VERSION="18"

echo -e "${YELLOW}Step 1: Checking system requirements...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: Please run as root (use: sudo bash deploy.sh)${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}Step 2: Updating system packages...${NC}"
apt update -qq

# Check and install Node.js if needed
echo -e "${YELLOW}Step 3: Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing Node.js ${NODE_VERSION}..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt install -y nodejs
else
    echo "Node.js already installed: $(node --version)"
fi

# Check and install Nginx if needed
echo -e "${YELLOW}Step 4: Checking Nginx installation...${NC}"
if ! command -v nginx &> /dev/null; then
    echo "Nginx not found. Installing Nginx..."
    apt install -y nginx
else
    echo "Nginx already installed: $(nginx -v 2>&1)"
fi

# Install PM2 if needed
echo -e "${YELLOW}Step 5: Checking PM2 installation...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing PM2..."
    npm install -g pm2
else
    echo "PM2 already installed: $(pm2 --version)"
fi

# Install Certbot if needed
echo -e "${YELLOW}Step 6: Checking Certbot installation...${NC}"
if ! command -v certbot &> /dev/null; then
    echo "Certbot not found. Installing Certbot..."
    apt install -y certbot python3-certbot-nginx
else
    echo "Certbot already installed"
fi

# Create application directory
echo -e "${YELLOW}Step 7: Setting up application directory...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

# Install application dependencies
echo -e "${YELLOW}Step 8: Installing application dependencies...${NC}"
if [ -f "package.json" ]; then
    npm install --production
else
    echo -e "${RED}Error: package.json not found. Make sure files are uploaded to $APP_DIR${NC}"
    exit 1
fi

# Find available port (start from 3000)
echo -e "${YELLOW}Step 9: Finding available port...${NC}"
PORT=3000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; do
    echo "Port $PORT is in use, trying next port..."
    PORT=$((PORT + 1))
done
echo "Using port: $PORT"

# Stop existing PM2 process if running
echo -e "${YELLOW}Step 10: Stopping any existing application...${NC}"
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Start application with PM2
echo -e "${YELLOW}Step 11: Starting application with PM2...${NC}"
PORT=$PORT pm2 start server.js --name $APP_NAME
pm2 save
pm2 startup systemd -u root --hp /root | grep -v PM2 | bash || true

# Configure Nginx
echo -e "${YELLOW}Step 12: Configuring Nginx...${NC}"

cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Cloudflare real IP
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    set_real_ip_from 2400:cb00::/32;
    set_real_ip_from 2606:4700::/32;
    set_real_ip_from 2803:f800::/32;
    set_real_ip_from 2405:b500::/32;
    set_real_ip_from 2405:8100::/32;
    set_real_ip_from 2c0f:f248::/32;
    set_real_ip_from 2a06:98c0::/29;
    real_ip_header CF-Connecting-IP;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Access and error logs
    access_log /var/log/nginx/${APP_NAME}_access.log;
    error_log /var/log/nginx/${APP_NAME}_error.log;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/$APP_NAME

# Test Nginx configuration
echo -e "${YELLOW}Step 13: Testing Nginx configuration...${NC}"
nginx -t

# Reload Nginx
echo -e "${YELLOW}Step 14: Reloading Nginx...${NC}"
systemctl reload nginx
systemctl enable nginx

# Configure firewall
echo -e "${YELLOW}Step 15: Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp > /dev/null 2>&1 || true
    ufw allow 443/tcp > /dev/null 2>&1 || true
    echo "Firewall rules updated (ports 80, 443 allowed)"
else
    echo "UFW not installed, skipping firewall configuration"
fi

# Get SSL certificate
echo -e "${YELLOW}Step 16: Setting up SSL with Certbot...${NC}"
echo ""
echo -e "${GREEN}IMPORTANT: Before continuing, make sure:${NC}"
echo "1. DNS record for $DOMAIN points to this server"
echo "2. Cloudflare SSL/TLS mode is set to 'Full' (not 'Full (strict)' yet)"
echo ""
read -p "Press Enter when ready to obtain SSL certificate (or Ctrl+C to skip)..."

certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email --redirect || {
    echo -e "${YELLOW}SSL certificate installation failed or was skipped.${NC}"
    echo "You can run it manually later with: certbot --nginx -d $DOMAIN"
}

echo ""
echo -e "${GREEN}======================================================================"
echo "  Deployment Complete!"
echo "======================================================================${NC}"
echo ""
echo -e "${GREEN}✓${NC} Application running on port: $PORT"
echo -e "${GREEN}✓${NC} PM2 process name: $APP_NAME"
echo -e "${GREEN}✓${NC} Nginx configured for: $DOMAIN"
echo -e "${GREEN}✓${NC} SSL: Enabled (if Certbot succeeded)"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Make sure DNS for claim.bsapservices.com points to this server"
echo "2. Set Cloudflare SSL/TLS to 'Full (strict)' after SSL is working"
echo "3. Visit: https://claim.bsapservices.com"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "  View app status:    pm2 status"
echo "  View app logs:      pm2 logs $APP_NAME"
echo "  Restart app:        pm2 restart $APP_NAME"
echo "  Stop app:           pm2 stop $APP_NAME"
echo "  Nginx status:       systemctl status nginx"
echo "  Nginx reload:       systemctl reload nginx"
echo "  View Nginx logs:    tail -f /var/log/nginx/${APP_NAME}_access.log"
echo ""
echo -e "${GREEN}🎉 Your case documentation website is now live!${NC}"
echo ""
