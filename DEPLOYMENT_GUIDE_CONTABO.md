# Quick Deployment Guide for Contabo VPS

This guide will help you deploy the case documentation website to your Contabo VPS quickly and easily.

## Prerequisites Checklist

- [ ] Contabo VPS running (Ubuntu/Debian)
- [ ] SSH access to your VPS
- [ ] Root or sudo access
- [ ] Domain name (optional, can use IP address)

## Step-by-Step Deployment

### Step 1: Prepare Your Local Files

1. Make sure you're in the claim folder:
   ```
   C:\Users\nfectious\Downloads\claim
   ```

2. You should see these files:
   - server.js
   - package.json
   - attorney_brief.txt
   - ATTORNEY_BRIEF_COMPREHENSIVE_COMPLETE.docx
   - CRITICAL_CORRECTION_MEMO.txt
   - public/ folder (containing index.html, styles.css, app.js)

### Step 2: Upload Files to VPS

#### Option A: Using WinSCP (Recommended for Windows)

1. Download WinSCP: https://winscp.net/eng/download.php
2. Open WinSCP
3. Enter your VPS details:
   - Host name: [Your Contabo VPS IP]
   - Port: 22
   - User name: root
   - Password: [Your VPS password]
4. Click "Login"
5. Navigate to `/var/www/` on the VPS (right panel)
6. Create folder: Right-click → New → Directory → Name it "claim"
7. Drag and drop ALL files from your local claim folder to `/var/www/claim/`

#### Option B: Using Command Line (if you have SSH tools)

```bash
scp -r C:\Users\nfectious\Downloads\claim root@YOUR_VPS_IP:/var/www/
```

Replace `YOUR_VPS_IP` with your actual Contabo VPS IP address.

### Step 3: Connect to Your VPS

Open Command Prompt or PowerShell and connect:

```bash
ssh root@YOUR_VPS_IP
```

Enter your password when prompted.

### Step 4: Install Node.js on VPS

Run these commands one by one:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

You should see version numbers (e.g., v18.x.x and 9.x.x).

### Step 5: Install Application Dependencies

```bash
# Navigate to the application folder
cd /var/www/claim

# Install dependencies
npm install
```

### Step 6: Test the Application

```bash
# Start the application
node server.js
```

You should see:
```
Server running on http://localhost:3000
Access the website at http://localhost:3000
```

Press `Ctrl+C` to stop the test.

### Step 7: Install PM2 (Process Manager)

PM2 keeps your application running even after you close SSH.

```bash
# Install PM2 globally
npm install -g pm2

# Start your application with PM2
pm2 start server.js --name "herd-case"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command that PM2 shows you
```

### Step 8: Install and Configure Nginx

Nginx will make your website accessible on port 80 (standard web port).

```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration file
nano /etc/nginx/sites-available/herd-case
```

Paste this configuration (replace `YOUR_VPS_IP` or use your domain):

```nginx
server {
    listen 80;
    server_name YOUR_VPS_IP;  # or your-domain.com

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

```bash
# Enable the site
ln -s /etc/nginx/sites-available/herd-case /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Enable Nginx to start on boot
systemctl enable nginx
```

### Step 9: Configure Firewall

```bash
# Allow HTTP traffic
ufw allow 80/tcp

# Allow HTTPS traffic (for future SSL)
ufw allow 443/tcp

# Allow SSH (IMPORTANT - don't lock yourself out!)
ufw allow 22/tcp

# Enable firewall
ufw enable
# Type 'y' when prompted

# Check status
ufw status
```

### Step 10: Access Your Website

Open a web browser and go to:
```
http://YOUR_VPS_IP
```

You should see the case documentation website!

## Optional: Setup SSL (HTTPS)

If you have a domain name pointed to your VPS:

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts
# Choose option 2 to redirect HTTP to HTTPS
```

Your site will now be accessible via `https://your-domain.com`

## Useful Commands

### Check if Application is Running
```bash
pm2 status
```

### View Application Logs
```bash
pm2 logs herd-case
```

### Restart Application
```bash
pm2 restart herd-case
```

### Stop Application
```bash
pm2 stop herd-case
```

### Check Nginx Status
```bash
systemctl status nginx
```

### Restart Nginx
```bash
systemctl restart nginx
```

### Update Application (after making changes)

1. Upload new files via WinSCP (overwrite existing)
2. Restart PM2:
   ```bash
   cd /var/www/claim
   pm2 restart herd-case
   ```

## Troubleshooting

### Website Not Loading

1. **Check PM2 status:**
   ```bash
   pm2 status
   ```
   If stopped, restart: `pm2 restart herd-case`

2. **Check Nginx status:**
   ```bash
   systemctl status nginx
   ```
   If not running: `systemctl start nginx`

3. **Check firewall:**
   ```bash
   ufw status
   ```
   Make sure port 80 is allowed.

4. **Check Node.js process:**
   ```bash
   netstat -tulpn | grep :3000
   ```
   Should show Node.js listening on port 3000.

### Port 3000 Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Cannot Connect via SSH

- Make sure you're using correct IP address
- Make sure you're using correct password
- Contact Contabo support if still having issues

### Nginx Configuration Errors

```bash
# Test configuration
nginx -t

# View error details
tail -f /var/log/nginx/error.log
```

## Performance Optimization (Optional)

### Enable Gzip Compression in Nginx

Edit Nginx config:
```bash
nano /etc/nginx/nginx.conf
```

Add in `http` block:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

Restart Nginx:
```bash
systemctl restart nginx
```

## Security Best Practices

1. **Change SSH Port (Optional but recommended):**
   ```bash
   nano /etc/ssh/sshd_config
   # Change Port 22 to Port 2222 (or any other)
   systemctl restart sshd
   ufw allow 2222/tcp
   ```

2. **Setup Fail2Ban (Prevents brute force attacks):**
   ```bash
   apt install -y fail2ban
   systemctl enable fail2ban
   systemctl start fail2ban
   ```

3. **Regular Updates:**
   ```bash
   apt update && apt upgrade -y
   ```

## Monitoring

### Check Server Resources

```bash
# CPU and memory usage
htop

# Disk space
df -h

# PM2 monitoring
pm2 monit
```

## Backup

### Backup Your Application

```bash
# Create backup
tar -czf /root/herd-case-backup-$(date +%Y%m%d).tar.gz /var/www/claim

# Download backup to local machine (from your Windows machine)
scp root@YOUR_VPS_IP:/root/herd-case-backup-*.tar.gz C:\Users\nfectious\Downloads\
```

## Summary

After completing these steps, your website will be:

✅ Running 24/7 on your Contabo VPS
✅ Accessible via your VPS IP address (or domain)
✅ Automatically restarting if it crashes
✅ Starting automatically when server reboots
✅ Optimized with Nginx reverse proxy
✅ Protected by firewall

## Quick Reference

| Action | Command |
|--------|---------|
| Start app | `pm2 start server.js --name herd-case` |
| Stop app | `pm2 stop herd-case` |
| Restart app | `pm2 restart herd-case` |
| View logs | `pm2 logs herd-case` |
| Check status | `pm2 status` |
| Restart Nginx | `systemctl restart nginx` |
| Check firewall | `ufw status` |

## Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. View application logs: `pm2 logs herd-case`
3. View Nginx logs: `tail -f /var/log/nginx/error.log`
4. Check system resources: `htop`

---

**Deployment Time**: ~30 minutes
**Difficulty**: Beginner-friendly with copy-paste commands
**Last Updated**: November 27, 2025
