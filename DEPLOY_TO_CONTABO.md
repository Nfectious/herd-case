# Deploy to Contabo VPS - Complete Guide
## Domain: claim.bsapservices.com

This guide provides **copy-paste commands** for deploying to your Contabo VPS with Nginx + Cloudflare + Certbot SSL.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [x] Contabo VPS running (Ubuntu/Debian)
- [x] Root/SSH access to VPS
- [x] VPS IP address
- [x] WinSCP or SCP access for file upload
- [ ] Cloudflare account with domain bsapservices.com
- [ ] DNS access to create subdomain

---

## 🌐 Step 1: Configure Cloudflare DNS (DO THIS FIRST!)

1. **Login to Cloudflare Dashboard**
2. **Select your domain**: bsapservices.com
3. **Go to DNS settings**
4. **Add a new DNS record**:
   - **Type**: A
   - **Name**: claim
   - **IPv4 address**: [YOUR_VPS_IP_ADDRESS]
   - **Proxy status**: ✅ Proxied (orange cloud)
   - **TTL**: Auto
   - Click **Save**

5. **Configure SSL/TLS Settings**:
   - Go to **SSL/TLS** → **Overview**
   - Set mode to: **Full** (for now, we'll change to "Full (strict)" after SSL is installed)

**DNS will take 1-5 minutes to propagate.**

---

## 📤 Step 2: Upload Files to VPS

### Option A: Using WinSCP (Recommended for Windows)

1. **Download WinSCP**: https://winscp.net/eng/download.php (if not installed)

2. **Open WinSCP** and connect:
   - **Host name**: [Your VPS IP]
   - **Port**: 22
   - **User name**: root
   - **Password**: [Your VPS password]
   - Click **Login**

3. **Upload files**:
   - Left panel: Navigate to `C:\Users\nfectious\Downloads\claim`
   - Right panel: Navigate to `/root/` (or `/tmp/`)
   - Select ALL files and folders
   - Drag from left to right
   - Wait for upload to complete

4. **Note the upload location** (usually `/root/claim/` or `/tmp/claim/`)

### Option B: Using Command Line SCP

Open **PowerShell** or **Command Prompt** on Windows:

```powershell
# Replace YOUR_VPS_IP with your actual VPS IP address
scp -r C:\Users\nfectious\Downloads\claim root@YOUR_VPS_IP:/root/
```

Enter your VPS password when prompted.

---

## 🚀 Step 3: Connect to VPS and Run Deployment

### 3.1 Connect via SSH

**Windows (PowerShell or Command Prompt):**
```bash
ssh root@YOUR_VPS_IP
```

Enter your password when prompted.

### 3.2 Move Files to Correct Location

```bash
# If uploaded to /root/claim
mv /root/claim /var/www/herd-case

# OR if uploaded to /tmp/claim
mv /tmp/claim /var/www/herd-case

# Verify files are there
ls -la /var/www/herd-case
```

You should see: `server.js`, `package.json`, `public/`, etc.

### 3.3 Make Deployment Script Executable

```bash
cd /var/www/herd-case
chmod +x deploy.sh
```

### 3.4 Run Automated Deployment Script

```bash
sudo bash deploy.sh
```

**The script will automatically:**
- ✅ Install Node.js (if needed)
- ✅ Install Nginx (if needed)
- ✅ Install PM2 (if needed)
- ✅ Install Certbot (if needed)
- ✅ Install application dependencies
- ✅ Find available port (starts at 3000)
- ✅ Start application with PM2
- ✅ Configure PM2 auto-start on reboot
- ✅ Configure Nginx with Cloudflare real IP
- ✅ Configure firewall
- ✅ Get SSL certificate from Let's Encrypt
- ✅ Configure HTTPS redirect

**When prompted about SSL certificate:**
- Make sure DNS is configured (Step 1)
- Press **Enter** to continue

**Deployment takes ~5 minutes.**

---

## ✅ Step 4: Verify Deployment

### 4.1 Check Application Status

```bash
pm2 status
```

You should see `herd-case` with status **online**.

### 4.2 Check Nginx Status

```bash
systemctl status nginx
```

Should show **active (running)**.

### 4.3 Test the Website

Open your browser and visit:
```
https://claim.bsapservices.com
```

You should see your professional case documentation website! 🎉

---

## 🔧 Post-Deployment (Optional but Recommended)

### Update Cloudflare SSL to Full (Strict)

Now that SSL is installed:

1. Go to Cloudflare Dashboard
2. **SSL/TLS** → **Overview**
3. Change mode to: **Full (strict)**
4. Save

This provides maximum security.

### Enable Cloudflare Additional Security (Optional)

1. **Security** → **WAF** → Enable
2. **Security** → **DDoS** → Already enabled
3. **Speed** → **Optimization** → Enable Auto Minify (HTML, CSS, JS)

---

## 📊 Management Commands

### Application Management

```bash
# View application status
pm2 status

# View application logs (live)
pm2 logs herd-case

# View last 100 log lines
pm2 logs herd-case --lines 100

# Restart application
pm2 restart herd-case

# Stop application
pm2 stop herd-case

# Start application
pm2 start herd-case

# Monitor application
pm2 monit
```

### Nginx Management

```bash
# Check Nginx status
systemctl status nginx

# Restart Nginx
systemctl restart nginx

# Reload Nginx (without downtime)
systemctl reload nginx

# Test Nginx configuration
nginx -t

# View access logs
tail -f /var/log/nginx/herd-case_access.log

# View error logs
tail -f /var/log/nginx/herd-case_error.log
```

### SSL Certificate Management

```bash
# Check certificate status
certbot certificates

# Renew certificate (auto-renews, but can test)
certbot renew --dry-run

# Renew all certificates
certbot renew

# Force renewal
certbot renew --force-renewal
```

### System Management

```bash
# Check server resources
htop

# Check disk space
df -h

# Check port usage
netstat -tulpn | grep LISTEN

# Check processes
ps aux | grep node
```

---

## 🔄 Update Application (When You Make Changes)

### Method 1: Using WinSCP

1. Upload updated files via WinSCP to `/var/www/herd-case/`
2. SSH to server:
   ```bash
   cd /var/www/herd-case
   pm2 restart herd-case
   ```

### Method 2: Edit Directly on Server

```bash
# Edit server.js
nano /var/www/herd-case/server.js

# Make your changes, then Ctrl+X, Y, Enter to save

# Restart application
pm2 restart herd-case
```

---

## 🆘 Troubleshooting

### Website Not Loading

**Check DNS:**
```bash
nslookup claim.bsapservices.com
```
Should return your VPS IP.

**Check application:**
```bash
pm2 status
```
Should show "online". If not:
```bash
pm2 restart herd-case
pm2 logs herd-case
```

**Check Nginx:**
```bash
systemctl status nginx
nginx -t
```

**Check firewall:**
```bash
ufw status
```
Ports 80 and 443 should be allowed.

### Port Already in Use

The script automatically finds an available port. If you need to manually change:

```bash
# Stop current process
pm2 stop herd-case
pm2 delete herd-case

# Start on specific port
PORT=3001 pm2 start server.js --name herd-case
pm2 save

# Update Nginx config
nano /etc/nginx/sites-available/herd-case
# Change the port in: proxy_pass http://localhost:3001;

# Reload Nginx
nginx -t
systemctl reload nginx
```

### SSL Certificate Failed

If SSL installation failed:

```bash
# Make sure DNS is configured
nslookup claim.bsapservices.com

# Try again manually
certbot --nginx -d claim.bsapservices.com

# Or for testing
certbot --nginx -d claim.bsapservices.com --dry-run
```

### Application Crashes

```bash
# View error logs
pm2 logs herd-case --err --lines 50

# Common issues:
# - Missing files: Make sure all files uploaded
# - Port in use: Script handles this automatically
# - Permissions: Run as root or with sudo
```

---

## 🔐 Security Best Practices

### 1. Change SSH Port (Optional)

```bash
nano /etc/ssh/sshd_config
# Change: Port 22 to Port 2222
systemctl restart sshd
ufw allow 2222/tcp
```

### 2. Setup Fail2Ban

```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Regular Updates

```bash
apt update && apt upgrade -y
```

### 4. Monitor Logs

```bash
# Check for unusual activity
tail -f /var/log/nginx/herd-case_access.log
```

---

## 📈 Performance Monitoring

### Setup PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Monitor Resources

```bash
# Install htop if not present
apt install htop

# Monitor in real-time
htop

# Or use pm2 monitor
pm2 monit
```

---

## 🔄 Backup

### Backup Application Files

```bash
# Create backup
tar -czf /root/herd-case-backup-$(date +%Y%m%d).tar.gz /var/www/herd-case

# Download to Windows (from Windows PowerShell)
scp root@YOUR_VPS_IP:/root/herd-case-backup-*.tar.gz C:\Users\nfectious\Downloads\
```

### Restore from Backup

```bash
cd /var/www
tar -xzf /root/herd-case-backup-YYYYMMDD.tar.gz
pm2 restart herd-case
```

---

## 📞 Quick Reference

### Important Files
- **Application**: `/var/www/herd-case/`
- **Nginx Config**: `/etc/nginx/sites-available/herd-case`
- **SSL Certificates**: `/etc/letsencrypt/live/claim.bsapservices.com/`
- **Logs**: `/var/log/nginx/herd-case_*.log`

### Important Commands
| Task | Command |
|------|---------|
| Application status | `pm2 status` |
| Application logs | `pm2 logs herd-case` |
| Restart app | `pm2 restart herd-case` |
| Nginx status | `systemctl status nginx` |
| Reload Nginx | `systemctl reload nginx` |
| Test Nginx | `nginx -t` |
| SSL status | `certbot certificates` |
| Renew SSL | `certbot renew` |

---

## ✅ Success Checklist

- [ ] Cloudflare DNS configured (claim.bsapservices.com → VPS IP)
- [ ] Files uploaded to VPS
- [ ] Deployment script executed successfully
- [ ] PM2 shows "online" status
- [ ] Nginx running
- [ ] SSL certificate installed
- [ ] Website loads at https://claim.bsapservices.com
- [ ] All 7 sections work
- [ ] Search functionality works
- [ ] Documents download successfully
- [ ] Mobile responsive (test on phone)
- [ ] Cloudflare SSL set to "Full (strict)"

---

## 🎉 Congratulations!

Your professional case documentation website is now live at:

**https://claim.bsapservices.com**

**Deployment time:** ~10-15 minutes
**Status:** Production-ready, secure, optimized

Share this URL with attorneys, family, or anyone who needs to review the case documentation!

---

**Last Updated:** November 27, 2025
**Support:** See troubleshooting section above
