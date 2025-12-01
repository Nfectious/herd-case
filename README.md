# Travis Herd v. Progressive Insurance - Case Documentation Website

A professional, responsive website documenting the legal case of Travis Herd v. Progressive Insurance Company, including systematic bad faith insurance practices, policy manipulation, and regulatory corruption.

## Features

- **Comprehensive Documentation**: Complete case overview, timeline, evidence, legal claims, and personal impact
- **Search Functionality**: Full-text search across all documents
- **Document Downloads**: Original legal documents available for download (DOCX and TXT formats)
- **Responsive Design**: Works on all devices (desktop, tablet, mobile) and all modern browsers
- **Professional Layout**: Clean, organized presentation suitable for legal professionals and general audience
- **Cross-linking**: Easy navigation between related sections
- **Accessibility**: Screen reader friendly, keyboard navigable

## Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no framework dependencies)
- **No Database Required**: All data served from JSON API and static files
- **Minimal Dependencies**: Only Express and CORS required

## Installation & Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Local Development

1. **Install Dependencies**
   ```bash
   cd C:\Users\nfectious\Downloads\claim
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Website**
   - Open your browser and navigate to: `http://localhost:3000`

### Production Deployment

The application is ready for deployment to any hosting service that supports Node.js applications.

## Deployment Options

### Option 1: Contabo VPS (Your Current Server)

#### Requirements
- Ubuntu/Debian VPS
- Node.js 14+ installed
- Domain name (optional but recommended)

#### Deployment Steps

1. **Connect to Your VPS**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Install Node.js (if not already installed)**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

4. **Upload Files to VPS**

   From your local machine:
   ```bash
   scp -r C:\Users\nfectious\Downloads\claim root@your-vps-ip:/var/www/
   ```

   Or use SFTP/WinSCP to transfer the entire `claim` folder to your VPS.

5. **Install Dependencies on VPS**
   ```bash
   cd /var/www/claim
   npm install --production
   ```

6. **Start with PM2**
   ```bash
   pm2 start server.js --name "herd-case"
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx (Recommended)**

   Install Nginx:
   ```bash
   sudo apt-get install nginx
   ```

   Create Nginx configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/herd-case
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # Replace with your domain or VPS IP

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/herd-case /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Configure Firewall**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

9. **Optional: Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 2: Heroku (Free/Easy Alternative)

1. **Install Heroku CLI**
   - Download from: https://devcenter.heroku.com/articles/heroku-cli

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd C:\Users\nfectious\Downloads\claim
   git init
   git add .
   git commit -m "Initial commit"
   heroku create herd-progressive-case
   ```

4. **Deploy**
   ```bash
   git push heroku master
   ```

5. **Open App**
   ```bash
   heroku open
   ```

### Option 3: Vercel (Free, Fast)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd C:\Users\nfectious\Downloads\claim
   vercel
   ```

3. **Follow prompts** - Vercel will automatically detect Node.js and deploy

### Option 4: Railway (Modern, Easy)

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Connect your repository (or upload the folder)
6. Railway will automatically deploy

## File Structure

```
claim/
├── server.js                      # Express server (backend)
├── package.json                   # Dependencies
├── attorney_brief.txt             # Converted attorney brief
├── ATTORNEY_BRIEF_COMPREHENSIVE_COMPLETE.docx  # Original document
├── CRITICAL_CORRECTION_MEMO.txt   # Critical memo
└── public/
    ├── index.html                 # Main HTML page
    ├── styles.css                 # Styling
    └── app.js                     # Frontend JavaScript
```

## Environment Configuration

The application uses environment variables for configuration:

- `PORT`: Server port (default: 3000)

To set custom port:
```bash
PORT=8080 npm start
```

Or create a `.env` file (for production):
```
PORT=3000
NODE_ENV=production
```

## Browser Compatibility

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Features Breakdown

### 1. Overview Section
- Case summary
- Key points highlighting
- Medical status information
- Family conflict documentation

### 2. Timeline Section
- Chronological events
- Visual timeline design
- Critical event highlighting
- Significance explanations

### 3. Evidence Section
- 7 critical evidence items
- 10-point systematic bad faith pattern
- Violations documentation
- Supporting evidence lists

### 4. Legal Claims Section
- Bad faith claim (TCA §56-7-105)
- Unfair practices (TCA §56-8-105)
- Insurance fraud (TCA §56-53-101)
- Estoppel
- Federal civil rights (42 USC §1983)
- Damages breakdown (Economic, Statutory, Punitive, Personal)

### 5. Impact Section
- Medical impact
- Family conflict
- Daughter's military service interference
- Timeline of suffering
- Case evolution and conclusion

### 6. Documents Section
- Download Attorney Brief (DOCX)
- Download Critical Memo (TXT)
- Professional document descriptions

### 7. Search Section
- Real-time document search
- Highlights matching terms
- Shows context around matches
- Line number references

## API Endpoints

### GET /api/case-data
Returns complete case data in JSON format

### GET /api/search?q={query}
Searches documents for specified query
- Returns: Array of search results with line numbers and context

### GET /api/download/:filename
Downloads original documents
- Supported: ATTORNEY_BRIEF_COMPREHENSIVE_COMPLETE.docx, CRITICAL_CORRECTION_MEMO.txt

## Customization

### Changing Colors
Edit `public/styles.css` and modify CSS variables at the top:
```css
:root {
    --primary-color: #1a365d;
    --secondary-color: #2563eb;
    --accent-color: #dc2626;
    /* etc. */
}
```

### Adding Content
Edit `server.js` in the `/api/case-data` endpoint to modify or add content.

## Security Considerations

1. **No Sensitive Data Exposure**: All data is public case documentation
2. **CORS Enabled**: Allows cross-origin requests (can be restricted if needed)
3. **File Download Whitelist**: Only specific documents can be downloaded
4. **No Database**: No SQL injection vulnerabilities
5. **Static File Serving**: Express serves files securely

## Performance

- **Lightweight**: Minimal JavaScript, no heavy frameworks
- **Fast Loading**: All content loads in single API call
- **Optimized CSS**: Efficient styling with CSS Grid and Flexbox
- **Mobile Optimized**: Responsive design loads quickly on mobile

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Cannot Access from Other Devices
Make sure firewall allows traffic on port 3000, and use server's IP address instead of localhost.

### Documents Not Downloading
Ensure the document files are in the same directory as `server.js`.

## Support & Updates

This is a self-contained application. All case data is embedded in the server code for easy maintenance and updates.

To update case information:
1. Edit the case data in `server.js` (line ~25)
2. Restart the server

## License

This documentation website is created for legal proceedings. All case information is factual documentation of events.

## Contact

For questions about deployment or technical issues, refer to this README or consult the hosting provider's documentation.

---

**Last Updated**: November 27, 2025
**Version**: 1.0.0
