# 🌍 Global Info Explorer

A modern, interactive web application for exploring information about countries worldwide. Built with vanilla JavaScript and powered by the REST Countries API.

![Global Info Explorer](assets/screenshots/homepage.png)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Why This App is Meaningful](#why-this-app-is-meaningful)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Installation & Local Setup](#installation--local-setup)
- [Deployment Instructions](#deployment-instructions)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Security Considerations](#security-considerations)
- [Challenges & Solutions](#challenges--solutions)
- [Future Enhancements](#future-enhancements)
- [Credits](#credits)
- [License](#license)

## 🎯 Overview

Global Info Explorer is a comprehensive web application that provides instant access to detailed information about every country in the world. Users can search, filter, sort, and explore country data including demographics, geography, languages, currencies, and more.

### Live Demo
- **Load Balancer**: http://[YOUR-LB01-IP]
- **Direct Access**: 
  - Web01: http://[YOUR-WEB01-IP]
  - Web02: http://[YOUR-WEB02-IP]

## ✨ Features

### Core Functionality
- 🔍 **Smart Search**: Find any country by name with real-time results
- 🗺️ **Region Filtering**: Filter countries by continent (Africa, Americas, Asia, Europe, Oceania)
- 📊 **Multi-Sort Options**: Sort by:
  - Name (A-Z or Z-A)
  - Population (High to Low or Low to High)
  - Area/Size (Largest to Smallest or vice versa)
- 💳 **Detailed View**: Click any country to see comprehensive information including:
  - Official name and capital
  - Population and area
  - Languages and currencies
  - Timezones and bordering countries
  - National flag

### Technical Features
- ✅ **Robust Error Handling**: Graceful handling of API failures, network issues, and invalid responses
- 🎨 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast Loading**: Optimized data fetching and rendering
- 🔄 **Real-time Updates**: Instant feedback for all user interactions
- ♿ **Accessible**: Semantic HTML and ARIA labels for screen readers

## 💡 Why This App is Meaningful

This application addresses genuine real-world needs:

### Educational Value
- **Students**: Quick access to country data for research papers, projects, and homework
- **Teachers**: Visual tool for teaching geography, demographics, and world cultures
- **Researchers**: Easy comparison of countries for academic studies

### Practical Applications
- **Travel Planning**: Research destinations before booking trips
- **Business Research**: Analyze markets for international expansion
- **General Knowledge**: Satisfy curiosity about different countries

### Beyond Entertainment
Unlike random joke generators or cat fact apps, Global Info Explorer provides:
- **Factual, verified data** from a trusted source
- **Educational content** that enhances knowledge
- **Professional utility** for real-world decision-making
- **Comparative analysis** capabilities for research

## 🎥 Demo

Watch the full demo video: [Demo Video Link]

**What the demo covers:**
1. Running the application locally
2. Searching for countries
3. Using region filters
4. Sorting countries by different criteria
5. Viewing detailed country information
6. Error handling demonstration
7. Accessing via load balancer
8. Traffic distribution verification

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript (ES6+)**: No frameworks or libraries
  - Async/Await for API calls
  - DOM manipulation
  - Event handling

### API
- **REST Countries API v3.1**: https://restcountries.com
  - No authentication required
  - Free tier with reasonable rate limits
  - Comprehensive country data

### Deployment Infrastructure
- **Web Servers**: Nginx on Ubuntu 24.04 LTS
- **Load Balancer**: Nginx reverse proxy with round-robin distribution
- **Hosting**: Linux-based VPS (Web01, Web02, Lb01)

## 💻 Installation & Local Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic text editor (VS Code, Sublime Text, or Notepad++)
- Internet connection (for API access)

### Step 1: Clone or Download the Project

**Option A: Using Git**
```bash
git clone https://github.com/yourusername/global-info-explorer.git
cd global-info-explorer
```

**Option B: Manual Download**
1. Download the ZIP file from GitHub
2. Extract to a folder on your computer
3. Open the folder

### Step 2: View the File Structure

Your folder should look like this:
```
global-info-explorer/
├── index.html
├── style.css
├── script.js
└── README.md
```

### Step 3: Open the Application

**Method 1: Double-click** `index.html` in your file browser

**Method 2: Use a local server** (recommended for best experience)
```bash
# If you have Python installed:
python -m http.server 8000

# Then open in browser:
http://localhost:8000
```

**Method 3: Use VS Code Live Server**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Step 4: Test the Application

1. Wait for countries to load (should take 2-3 seconds)
2. Try searching for "Canada"
3. Select "Europe" from the region filter
4. Sort by "Population (High to Low)"
5. Click on any country to see details

**If you see errors:**
- Check your internet connection
- Open browser console (F12) to see error messages
- Ensure JavaScript is enabled in your browser

## 🚀 Deployment Instructions

### Overview

We'll deploy the application to three servers:
- **Web01**: Primary web server
- **Web02**: Secondary web server
- **Lb01**: Load balancer (distributes traffic between Web01 and Web02)

### Prerequisites

- Access to three servers (Web01, Web02, Lb01)
- SSH access credentials
- Basic command line knowledge

### Part 1: Deploy to Web01

#### Step 1: Connect to Web01
```bash
ssh username@web01-ip-address
```
*Replace `username` with your actual username and `web01-ip-address` with the IP*

#### Step 2: Update System
```bash
sudo apt update
sudo apt upgrade -y
```
**What this does**: Updates the list of available packages and upgrades installed packages

#### Step 3: Install Nginx
```bash
sudo apt install nginx -y
```
**What Nginx is**: A web server that serves your HTML files to visitors

#### Step 4: Start and Enable Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```
**What this does**: 
- `start`: Starts Nginx now
- `enable`: Makes Nginx start automatically when server reboots

#### Step 5: Verify Nginx is Running
```bash
sudo systemctl status nginx
```
You should see "active (running)" in green.

#### Step 6: Create Application Directory
```bash
sudo mkdir -p /var/www/global-info-explorer
```
**What this does**: Creates a folder where your website files will live

#### Step 7: Upload Your Files

**From your local computer**, open a new terminal and run:
```bash
scp -r /path/to/your/project/* username@web01-ip:/tmp/
```

**Example**:
```bash
scp -r ~/Documents/global-info-explorer/* john@192.168.1.100:/tmp/
```

**Then on the server**, move files to the web directory:
```bash
sudo mv /tmp/index.html /var/www/global-info-explorer/
sudo mv /tmp/style.css /var/www/global-info-explorer/
sudo mv /tmp/script.js /var/www/global-info-explorer/
```

#### Step 8: Set Proper Permissions
```bash
sudo chown -R www-data:www-data /var/www/global-info-explorer
sudo chmod -R 755 /var/www/global-info-explorer
```
**What this does**: Gives Nginx permission to read and serve your files

#### Step 9: Configure Nginx

Create a configuration file:
```bash
sudo nano /etc/nginx/sites-available/global-info-explorer
```

**Paste this configuration**:
```nginx
server {
    listen 80;
    server_name _;
    
    root /var/www/global-info-explorer;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    
    # Cache static files
    location ~* \.(css|js|jpg|jpeg|png|gif|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save and exit**: Press `Ctrl+X`, then `Y`, then `Enter`

#### Step 10: Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/global-info-explorer /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site
```

#### Step 11: Test Configuration
```bash
sudo nginx -t
```
You should see "syntax is ok" and "test is successful"

#### Step 12: Restart Nginx
```bash
sudo systemctl restart nginx
```

#### Step 13: Test Web01

Open your browser and visit:
```
http://web01-ip-address
```

You should see your Global Info Explorer application!

### Part 2: Deploy to Web02

**Repeat ALL steps from Part 1** on Web02. The steps are identical - just connect to Web02 instead of Web01.
```bash
ssh username@web02-ip-address
# Then follow steps 2-12 again
```

### Part 3: Configure Load Balancer (Lb01)

#### Step 1: Connect to Lb01
```bash
ssh username@lb01-ip-address
```

#### Step 2: Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
```

#### Step 3: Configure Load Balancer
```bash
sudo nano /etc/nginx/sites-available/loadbalancer
```

**Paste this configuration** (replace IP addresses):
```nginx
upstream backend_servers {
    # Round-robin load balancing (default)
    server WEB01-IP-ADDRESS:80;
    server WEB02-IP-ADDRESS:80;
}

server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

**Replace**:
- `WEB01-IP-ADDRESS` with Web01's actual IP
- `WEB02-IP-ADDRESS` with Web02's actual IP

**Example**:
```nginx
upstream backend_servers {
    server 192.168.1.100:80;
    server 192.168.1.101:80;
}
```

#### Step 4: Enable Load Balancer
```bash
sudo ln -s /etc/nginx/sites-available/loadbalancer /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

#### Step 5: Test Configuration
```bash
sudo nginx -t
```

#### Step 6: Restart Nginx
```bash
sudo systemctl restart nginx
```

### Part 4: Testing Everything

#### Test 1: Direct Server Access

Visit each server directly:
- http://web01-ip-address - Should show the app
- http://web02-ip-address - Should show the app

#### Test 2: Load Balancer Access

Visit the load balancer:
- http://lb01-ip-address - Should show the app

#### Test 3: Verify Load Distribution

**Method 1: Check Nginx logs**

On Web01:
```bash
sudo tail -f /var/www/nginx/access.log
```

On Web02 (in a different terminal):
```bash
sudo tail -f /var/nginx/access.log
```

Reload http://lb01-ip-address multiple times and watch the logs. You should see requests alternating between Web01 and Web02.

**Method 2: Temporary modification**

Temporarily add a server identifier to each server:

On Web01:
```bash
sudo nano /var/www/global-info-explorer/index.html
# Add <p>Server: Web01</p> in the header
sudo systemctl reload nginx
```

On Web02:
```bash
sudo nano /var/www/global-info-explorer/index.html
# Add <p>Server: Web02</p> in the header
sudo systemctl reload nginx
```

Now refresh the load balancer URL multiple times - you should see "Web01" and "Web02" alternating!

**Remember to remove these test modifications after verifying!**

#### Test 4: Failover Test

Stop Nginx on Web01:
```bash
sudo systemctl stop nginx
```

Visit http://lb01-ip-address - Should still work (served by Web02)!

Restart Web01:
```bash
sudo systemctl start nginx
```

## 📚 API Documentation

### REST Countries API v3.1

**Official Documentation**: https://restcountries.com

### Endpoints Used

#### 1. Get All Countries
```
GET https://restcountries.com/v3.1/all
```
**Returns**: Array of all 250+ countries with full data

**Response Example**:
```json
[
  {
    "name": {
      "common": "Canada",
      "official": "Canada"
    },
    "capital": ["Ottawa"],
    "region": "Americas",
    "population": 38005238,
    "area": 9984670,
    "flags": {
      "png": "https://flagcdn.com/w320/ca.png",
      "svg": "https://flagcdn.com/ca.svg"
    }
  }
]
```

#### 2. Search by Name
```
GET https://restcountries.com/v3.1/name/{name}
```
**Example**: `/name/canada`

**Returns**: Countries matching the search term

#### 3. Filter by Region
```
GET https://restcountries.com/v3.1/region/{region}
```
**Available Regions**:
- africa
- americas
- asia
- europe
- oceania

### Data Fields Available

| Field | Description | Example |
|-------|-------------|---------|
| `name.common` | Common country name | "Canada" |
| `name.official` | Official country name | "Canada" |
| `capital` | Capital city(ies) | ["Ottawa"] |
| `region` | Geographic region | "Americas" |
| `subregion` | Geographic subregion | "Northern America" |
| `population` | Population count | 38005238 |
| `area` | Area in km² | 9984670 |
| `languages` | Spoken languages | {"eng": "English", "fra": "French"} |
| `currencies` | Used currencies | {"CAD": {"name": "Canadian dollar", "symbol": "$"}} |
| `timezones` | Timezones | ["UTC-08:00", "UTC-07:00", ...] |
| `borders` | Bordering countries | ["USA"] |
| `flags` | Flag image URLs | {"png": "...", "svg": "..."} |

### Rate Limits

The REST Countries API has the following limits:
- **Rate Limit**: Generous, no strict limits for reasonable use
- **Recommendation**: Cache responses to reduce unnecessary requests
- **Best Practice**: Don't hammer the API with rapid-fire requests

### Error Handling

**Status Codes**:
- `200 OK`: Success
- `404 Not Found`: Country doesn't exist
- `500 Internal Server Error`: API is having issues

**Example Error Handling**:
```javascript
try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    // Use data
} catch (error) {
    console.error('Failed to fetch:', error);
    // Show user-friendly error message
}
```

## 📁 Project Structure
```
global-info-explorer/
│
├── index.html              # Main HTML structure
├── style.css               # All styling and visual design
├── script.js               # Application logic and API calls
│
├── assets/                 # Media and resources
│   └── screenshots/
│       ├── homepage.png
│       ├── search.png
│       ├── filter.png
│       └── details.png
│
├── docs/                   # Additional documentation
│   ├── API_GUIDE.md
│   └── DEPLOYMENT_GUIDE.md
│
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── LICENSE                 # MIT License
```

## 🔒 Security Considerations

### What We Did

1. **No API Keys Required**: REST Countries API doesn't require authentication, so no sensitive credentials to manage

2. **Input Validation**: Search input is sanitized before sending to API

3. **HTTPS Ready**: Application works over HTTPS when deployed with SSL certificates

4. **XSS Prevention**: Using `textContent` instead of `innerHTML` where possible

5. **Error Handling**: Never exposing internal errors to users

### What You Should Do

1. **Enable HTTPS**: 
```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
```

2. **Firewall Configuration**:
```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
```

3. **Regular Updates**:
```bash
   sudo apt update && sudo apt upgrade -y
```

4. **Monitor Logs**:
```bash
   sudo tail -f /var/log/nginx/error.log
```

## 🐛 Challenges & Solutions

### Challenge 1: API Rate Limiting

**Problem**: Initial implementation made too many API calls, causing slowdowns.

**Solution**: 
- Fetch all countries once on page load
- Store data locally in JavaScript
- Filter and sort locally instead of making new API calls

**Code**:
```javascript
let allCountries = []; // Store once, use many times

// Fetch once
fetchAllCountries().then(data => {
    allCountries = data;
});

// Filter locally (fast!)
const filtered = allCountries.filter(c => c.region === 'Europe');
```

### Challenge 2: Missing Data Fields

**Problem**: Some countries don't have all data fields (e.g., landlocked countries have no borders).

**Solution**: Use optional chaining and fallback values

**Code**:
```javascript
const capital = country.capital?.[0] || 'N/A';
const borders = country.borders?.join(', ') || 'None';
```

### Challenge 3: Large Flag Images

**Problem**: Flag images were large and slow to load.

**Solution**: 
- Used lazy loading
- Provided fallback SVG
- Implemented error handling for missing images

**Code**:
```html
<img src="${flag}" onerror="this.src='fallback.svg'">
```

### Challenge 4: Load Balancer Configuration

**Problem**: Requests weren't distributing evenly between servers.

**Solution**: 
- Used Nginx's built-in round-robin algorithm
- Added proper health checks
- Configured appropriate timeouts

### Challenge 5: Mobile Responsiveness

**Problem**: Layout broke on mobile devices.

**Solution**: 
- Used CSS Grid with `auto-fill`
- Added media queries for small screens
- Made touch targets large enough

**Code**:
```css
.countries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

@media (max-width: 768px) {
    .countries-grid {
        grid-template-columns: 1fr;
    }
}
```

## 🚀 Future Enhancements

Possible improvements for future versions:

1. **Advanced Filtering**:
   - Filter by population range
   - Filter by language
   - Filter by currency

2. **Comparison Tool**:
   - Select multiple countries
   - View side-by-side comparison

3. **Favorites System**:
   - Save favorite countries
   - Use localStorage for persistence

4. **Data Visualization**:
   - Population charts
   - Interactive maps
   - Regional statistics

5. **Offline Support**:
   - Service Worker implementation
   - Cache API responses
   - Work without internet

6. **Accessibility**:
   - Screen reader optimization
   - Keyboard navigation
   - High contrast mode

## 🙏 Credits

### API
- **REST Countries API**: https://restcountries.com
  - Maintained by Alejandro Matos
  - Data sourced from multiple public databases

### Technologies
- **Nginx**: Web server and load balancer
- **Ubuntu**: Server operating system

### Resources
- MDN Web Docs: JavaScript and API references
- CSS-Tricks: Layout and styling techniques
- Stack Overflow Community: Problem-solving assistance

## 📄 License

This project is licensed under the MIT License.
```
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact

- **Project Repository**: https://github.com/yourusername/global-info-explorer
- **Issues**: https://github.com/yourusername/global-info-explorer/issues
- **Email**: your.email@example.com

---

**Built with ❤️ for educational purposes**
