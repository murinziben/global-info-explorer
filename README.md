#  Global Info Explorer

Global Info Explorer provides instant access to comprehensive information about 250+ countries worldwide. It serves students researching for assignments, travelers planning trips, and business professionals analyzing international markets. Features include advanced search and filtering, country comparison, interactive quiz mode, global statistics, and favorites management. The application utilizes REST Countries API and is professionally deployed with load-balanced Nginx servers ensuring fast, reliable access for users globally.

**link to website (subdomain name )**(https://globalinfoexplorer.murinziben.tech/)
[![API]](https://restcountries.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Live Application:** [https://globalinfoexplorer.murinziben.tech/](https://globalinfoexplorer.murinziben.tech/)

**YouTube demo video for how this web application works:** https://youtu.be/YwNAAdT1Vus

---

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Project Purpose](#project-purpose)
- [Installation & Local Setup](#installation--local-setup)
- [Deployment Architecture](#deployment-architecture)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Challenges & Solutions](#challenges--solutions)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

---

##  Overview

Global Info Explorer is a modern, interactive web application that provides comprehensive information about 250+ countries worldwide. Users can search, filter, compare, and explore detailed data including demographics, geography, economy, languages, currencies, and historical background.

### Why This Application?

This application addresses real-world needs:

- **Educational**: Students and researchers can quickly access country data for projects and homework
- **Travel Planning**: Travelers can research destinations before visiting
- **Business Research**: Professionals can analyze markets for international expansion
- **General Knowledge**: Anyone can explore and learn about different countries

Unlike basic country information apps, Global Info Explorer provides:
-  Comprehensive historical context
-  Advanced filtering and comparison tools
-  Interactive features (favorites, quiz, statistics)
-  Professional deployment with load balancing
-  User-friendly interface with smart error handling

---

##  Features

### Core Features

-  **Advanced Search**: Search by country name, capital, or language with intelligent error handling
-  **Region Filtering**: Filter countries by continent (Africa, Americas, Asia, Europe, Oceania, Antarctic)
-  **Multi-Sort Options**: Sort by name, population, or area
-  **Detailed Information**: Comprehensive country data including:
  - Official names and capitals
  - Population and demographics
  - Geographic data and coordinates
  - Languages and currencies
  - Timezones and calling codes
  - Historical background and interesting facts
  - Neighboring countries

### Interactive Features

-  **Favorites System**: Save favorite countries with localStorage persistence
-  **Country Comparison**: Compare 2-4 countries side-by-side with detailed metrics
-  **Global Statistics**: View rankings and statistics including:
  - Most populous countries
  - Largest countries by area
  - Most dense countries
  - Regional distribution
  - Most spoken languages
-  **Quiz Mode**: Test your knowledge with an interactive 10-question quiz
-  **Dark Mode**: Toggle between light and dark themes
-  **Responsive Design**: Seamless experience on desktop, tablet, and mobile

### Advanced Features

-  **Advanced Filters**: Filter by population range, area, language, landlocked status, UN membership, and independence
-  **Fun Facts Generator**: Discover interesting facts about countries
-  **Share Functionality**: Share country information with others
-  **Print Support**: Print country information
-  **Smart Error Handling**: Helpful suggestions when searching for cities instead of countries

---


##  Technologies Used

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid layout
- **Vanilla JavaScript (ES6+)**: No frameworks or libraries
  - Async/Await for API calls
  - LocalStorage for data persistence
  - DOM manipulation
  - Event handling

### API
- **REST Countries API v3.1**: [https://restcountries.com](https://restcountries.com)
  - Comprehensive country data
  - No authentication required
  - Free and open source

### Infrastructure
- **Web Servers**: Nginx on Ubuntu 24.04 LTS
- **Load Balancer**: Nginx reverse proxy with round-robin algorithm
- **Hosting**: Linux-based Virtual Private Servers
- **Domain**: Custom domain with SSL/TLS

---

##  Project Purpose

This project was developed as a university assignment demonstrating:

1. **API Integration**: Effective use of external APIs with proper error handling
2. **User Experience**: Intuitive interface with meaningful interactions
3. **Scalability**: Professional deployment with load balancing
4. **Documentation**: Comprehensive technical documentation
5. **Real-World Application**: Solving genuine user needs beyond basic entertainment

### Assignment Requirements Met

 Meaningful purpose (educational and research tool)  
 External API integration (REST Countries API)  
 User interaction (search, filter, sort, compare)  
 Error handling (network issues, invalid inputs, city searches)  
 Deployment to multiple servers  
 Load balancer configuration  
 Professional documentation  
 Demo video presentation  

---

##  Installation & Local Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API access
- Optional: Python 3.x or Node.js for local server

### Quick Start

1. **Clone the repository**
```bash
   git clone https://github.com/murinziben/global-info-explorer.git
   cd global-info-explorer
```

2. **Open the application**
   
   **Option A: Direct File Access**
   - Simply open `index.html` in your browser

   **Option B: Local Server (Recommended)**
```bash
   # Using Python
   python -m http.server 8000
   
   # Then open: http://localhost:8000
```

3. **Start exploring!**
   - Search for countries
   - Use filters and sorting
   - Click countries for detailed information
   - Try the comparison tool and quiz

### Project Structure
```
global-info-explorer/
├── index.html          # Main HTML structure
├── style.css           # Styling and visual design
├── script.js           # Application logic and API integration
├── README.md           # This file
├── .gitignore          # Git ignore rules
└── assets/             # Images and screenshots
    └── screenshots/
```

---

##  Deployment Architecture

The application is deployed using a professional infrastructure setup:

### Architecture Overview
```
                    Internet
                        │
                        ▼
                [Load Balancer]
                [IP:3.94.54.145]
               (Nginx - Lb01)
              Round-Robin Distribution
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
       [Web Server 1]
       [IP:3.87.65.230]          [Web Server 2]
                                  [IP:3.88.145.59]
      (Nginx - Web01)         (Nginx - Web02)
```

### Servers

- **Load Balancer (Lb01)**
  - Distributes incoming traffic between web servers
  - Algorithm: Round-robin
  - Health checks enabled
  - URL: [https://globalinfoexplorer.murinziben.tech/](https://globalinfoexplorer.murinziben.tech/)

- **Web Server 1 (Web01)**
  - Nginx on Ubuntu 24.04 LTS
  - Serves static files (HTML, CSS, JS)
  - Gzip compression enabled

- **Web Server 2 (Web02)**
  - Nginx on Ubuntu 24.04 LTS
  - Identical configuration to Web01
  - Provides redundancy and load distribution

### Deployment Steps

#### 1. Deploy to Web Servers (Web01 & Web02)
```bash
#connecting to the server web01
ssh -i ~/.ssh/id_rsa ubuntu@3.87.65.230
Enter passphrase for key '/root/.ssh/id_rsa': [my passphrase key]
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Create application directory
sudo mkdir -p /var/www/global-info-explorer

# clone files (from github)
scp index.html user@server-ip:/tmp/
scp style.css user@server-ip:/tmp/
scp script.js user@server-ip:/tmp/

# Move files to web directory
sudo mv /tmp/*.html /tmp/*.css /tmp/*.js /var/www/global-info-explorer/

# Set permissions
sudo chown -R www-data:www-data /var/www/global-info-explorer
sudo chmod -R 755 /var/www/global-info-explorer

# Configure Nginx
sudo nano /etc/nginx/sites-available/global-info-explorer
```

**Server Configuration:**
```server {
    listen 80 ;
    listen [::]:80 ;

    root /var/www/global-info-explorer;
    index index.html;

    add_header X-Served-By $HOSTNAME;

    server_name globalinfoexplorer.murinziben.tech;
    location / {
        try_files $uri $uri/ =404;
    }
}
```
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/global-info-explorer /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 2. Configure Load Balancer (Lb01)
```bash
# Install Nginx
sudo apt update
sudo apt install nginx -y

# Configure load balancer
sudo nano /etc/nginx/sites-available/loadbalancer
```

**Load Balancer Configuration:**

```# Backend servers
upstream global_info_explorer_backend {
    server 3.87.65.230;
    server 3.88.145.59;
    keepalive 32;
}

# Load balancer server
server {
    server_name globalinfoexplorer.murinziben.tech;

    access_log /var/log/nginx/lb-access.log;
    error_log /var/log/nginx/lb-error.log;

    location / {
        proxy_pass http://global_info_explorer_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Load-Balancer lb01-nginx;

    }



    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/globalinfoexplorer.murinziben.tech/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/globalinfoexplorer.murinziben.tech/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
```
```bash
# Enable load balancer
sudo ln -s /etc/nginx/sites-available/loadbalancer /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### genarating the certificate

### Verification
```bash
sudo apt update
sudo apt install certbot 
sudo apt install python3-certbot-nginx
sudo certbot --nginx -d globalinfoexplorer.murinziben.tech

```
Test the deployment:
```bash

# Test load balancer
curl http://globalinfoexplorer.murinziben.tech

# Monitor load distribution
# On each server:
sudo tail -f /var/log/nginx/access.log
```

---

##  API Documentation

### REST Countries API v3.1

**Official Documentation**: [https://restcountries.com](https://restcountries.com)

### Endpoints Used

#### Get All Countries
```
GET https://restcountries.com/v3.1/all
```
Returns all 250+ countries with complete data.

#### Search by Name
```
GET https://restcountries.com/v3.1/name/{name}
```
Search for countries by name (e.g., `/name/japan`).

#### Filter by Region
```
GET https://restcountries.com/v3.1/region/{region}
```
Filter countries by region: africa, americas, asia, europe, oceania.

### Data Structure

Each country object includes:
- `name`: Common and official names
- `capital`: Capital city(ies)
- `region` & `subregion`: Geographic location
- `population`: Population count
- `area`: Land area in km²
- `languages`: Spoken languages
- `currencies`: Used currencies
- `flags`: Flag images (SVG and PNG)
- `timezones`: All timezones
- `borders`: Bordering countries
- `maps`: Google Maps and OpenStreetMap links

### Rate Limits

- No authentication required
- Reasonable use recommended
- Caching implemented for performance

### Error Handling

The application handles:
- 404 Not Found (country doesn't exist)
- Network errors (connection issues)
- Invalid responses (malformed data)
- Timeout errors (slow connections)

---

##  Usage Guide

### Basic Search

1. Enter a country name in the search bar
2. Click "Search" or press Enter
3. View results instantly

**Tips:**
- Search by country name: "Japan", "France"
- Search by capital: "Tokyo", "Paris" (app will suggest the country)
- Search by language: "Spanish", "Arabic"

### Filtering

1. Use the **Region** dropdown to filter by continent
2. Use **Advanced Filters** for more options:
   - Population range
   - Area range
   - Language
   - Landlocked status
   - UN membership
   - Independence status

### Sorting

Choose from sorting options:
- Name (A-Z or Z-A)
- Population (High to Low or Low to High)
- Area (Largest to Smallest or vice versa)

### Viewing Details

1. Click any country card
2. View comprehensive information:
   - Historical background
   - Basic information
   - Geography & location
   - Demographics
   - Languages
   - Economy & currency
   - Connectivity
   - Timezones
   - Borders

### Comparing Countries

1. Click the  icon on 2-4 country cards
2. Click "Compare (X)" in the header
3. View side-by-side comparison table
4. Compare population, area, languages, currencies, and more

### Using Favorites

1. Click the  icon on any country card
2. Access favorites anytime via "Favorites" button
3. Favorites persist across browser sessions

### Taking the Quiz

1. Click "Quiz Mode" in the header
2. Answer 10 random questions about countries
3. Get immediate feedback (correct/incorrect)
4. See your final score
5. Play again to improve!

### Viewing Statistics

1. Click "Statistics" in the header
2. Explore:
   - Global overview
   - Regional distribution
   - Top 10 by population
   - Top 10 by area
   - Most dense countries
   - Most spoken languages

---

##  Challenges & Solutions

### Challenge 1: API Rate Limiting & Performance

**Problem**: Making too many API calls caused slow performance and potential rate limiting.

**Solution**: 
- Fetch all countries once on page load
- Store data in JavaScript memory
- Perform filtering and sorting locally
- Result: Instant filtering and sorting with no additional API calls

### Challenge 2: Missing or Inconsistent Data

**Problem**: Some countries lack certain data fields (e.g., landlocked countries have no borders).

**Solution**:
- Implemented optional chaining (`?.`)
- Added fallback values for missing data
- Example: `country.capital?.[0] || 'N/A'`

### Challenge 3: User-Friendly Error Messages

**Problem**: Users searching for cities (e.g., "Tokyo") got generic "not found" errors.

**Solution**:
- Built a database of common city-to-country mappings
- Provide helpful suggestions: "Tokyo is a city! Did you mean Japan?"
- Added input validation for numbers and invalid characters

### Challenge 4: Load Balancer Configuration

**Problem**: Traffic wasn't distributing evenly between servers.

**Solution**:
- Used Nginx's built-in round-robin algorithm
- Added health checks
- Configured proper timeouts
- Result: Efficient traffic distribution and failover support

### Challenge 5: Mobile Responsiveness

**Problem**: Layout broke on smaller screens.

**Solution**:
- Used CSS Grid with `auto-fill`
- Implemented responsive breakpoints
- Made touch targets appropriately sized
- Tested on multiple device sizes

### Challenge 6: Dark Mode Persistence

**Problem**: Dark mode setting didn't persist after page reload.

**Solution**:
- Used `localStorage` to save theme preference
- Check and apply theme on page load
- Result: Theme persists across sessions

---

##  Future Enhancements

Potential improvements for future versions:

### Features
- [ ] Multi-language support (translate interface)
- [ ] Export data to PDF/CSV
- [ ] Advanced data visualizations (charts, graphs)
- [ ] Country news integration
- [ ] Weather information integration
- [ ] Currency converter
- [ ] Distance calculator between countries

### Technical
- [ ] Progressive Web App (PWA) support
- [ ] Offline functionality with Service Workers
- [ ] Performance optimization with lazy loading
- [ ] Implement caching strategies
- [ ] Add end-to-end testing
- [ ] CI/CD pipeline automation
- [ ] Docker containerization
- [ ] Kubernetes orchestration

### UX Improvements
- [ ] Animated transitions
- [ ] Tour guide for first-time users
- [ ] Keyboard shortcuts
- [ ] Advanced search suggestions
- [ ] Recent searches history
- [ ] Custom country lists/collections

---

##  Contributing

Contributions are welcome! If you'd like to improve Global Info Explorer:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write clean, readable code
- Comment complex logic
- Test thoroughly before submitting
- Follow existing code style
- Update documentation as needed

---

##  Credits

### Data Source
- **REST Countries API**: [https://restcountries.com](https://restcountries.com)
  - Maintained by Alejandro Matos
  - Data from multiple public sources

### Technologies & Tools
- **Nginx**: Web server and load balancer
- **Ubuntu**: Server operating system
- **Git**: Version control
- **GitHub**: Repository hosting

### Inspiration
- Built for educational purposes as a university project
- Inspired by the need for comprehensive, accessible country information

---

##  License

This project is licensed under the MIT License.
```
MIT License

Copyright (c) 2025 Murinzi Ben

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

---

##  Contact

**Project Repository**: [https://github.com/murinziben/global-info-explorer](https://github.com/murinziben/global-info-explorer)

**Live Application**: [https://globalinfoexplorer.murinziben.tech/](https://globalinfoexplorer.murinziben.tech/)

**Issues & Feedback**: [GitHub Issues](https://github.com/murinziben/global-info-explorer/issues)

---

##  Acknowledgments

Special thanks to:
- REST Countries API for providing free, comprehensive data
- The open-source community for tools and resources
- University instructors for project guidance
- All users and testers who provided feedback

---

<div align="center">

**Built with  for educational purposes**

 Star this repository if you find it helpful!

[Live Demo](https://globalinfoexplorer.murinziben.tech/) • [Report Bug](https://github.com/murinziben/global-info-explorer/issues) • [Request Feature](https://github.com/murinziben/global-info-explorer/issues)

</div>
