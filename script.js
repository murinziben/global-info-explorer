// ========================================
// GLOBAL VARIABLES
// ========================================

let allCountries = [];
let filteredCountries = [];
let compareList = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentView = 'grid';
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let quizQuestions = [];
let currentQuizIndex = 0;
let quizScore = 0;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const regionFilter = document.getElementById('regionFilter');
const sortSelect = document.getElementById('sortSelect');
const resetBtn = document.getElementById('resetBtn');
const countriesGrid = document.getElementById('countriesGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');
const resultsCount = document.getElementById('resultsCount');
const countryModal = document.getElementById('countryModal');
const modalClose = document.getElementById('modalClose');
const countryDetails = document.getElementById('countryDetails');

// New Feature Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const compareBtn = document.getElementById('compareBtn');
const compareCount = document.getElementById('compareCount');
const favoritesBtn = document.getElementById('favoritesBtn');
const favCount = document.getElementById('favCount');
const statsBtn = document.getElementById('statsBtn');
const quizBtn = document.getElementById('quizBtn');
const advancedFiltersToggle = document.getElementById('advancedFiltersToggle');
const advancedFilters = document.getElementById('advancedFilters');
const applyAdvancedFilters = document.getElementById('applyAdvancedFilters');
const clearAdvancedFilters = document.getElementById('clearAdvancedFilters');
const gridView = document.getElementById('gridView');
const listView = document.getElementById('listView');

// Modals
const compareModal = document.getElementById('compareModal');
const compareModalClose = document.getElementById('compareModalClose');
const compareContent = document.getElementById('compareContent');
const favoritesModal = document.getElementById('favoritesModal');
const favoritesModalClose = document.getElementById('favoritesModalClose');
const favoritesContent = document.getElementById('favoritesContent');
const statsModal = document.getElementById('statsModal');
const statsModalClose = document.getElementById('statsModalClose');
const statsContent = document.getElementById('statsContent');
const quizModal = document.getElementById('quizModal');
const quizModalClose = document.getElementById('quizModalClose');
const quizContent = document.getElementById('quizContent');

// ========================================
// INITIALIZATION (OPTIMIZED WITH LAZY LOADING)
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Global Info Explorer...');
    initializeApp();
    setupEventListeners();
    
    // DON'T load all countries immediately
    // Show welcome screen instead
    showWelcomeScreen();
});

function initializeApp() {
    // Apply dark mode if enabled
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
    
    // Update favorites count
    updateFavoritesCount();
    
    // Check if we have cached data
    checkCache();
}

function checkCache() {
    const cachedData = localStorage.getItem('countriesCache');
    const cacheTime = localStorage.getItem('countriesCacheTime');
    
    if (cachedData && cacheTime) {
        const cacheAge = Date.now() - parseInt(cacheTime);
        const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
        
        if (cacheAge < SEVEN_DAYS) {
            console.log(' Cache available (age: ' + Math.floor(cacheAge / 1000 / 60 / 60) + ' hours)');
            // Load from cache silently in background
            try {
                allCountries = JSON.parse(cachedData);
                filteredCountries = allCountries;
                console.log(' Loaded ' + allCountries.length + ' countries from cache');
            } catch (e) {
                console.warn('Cache corrupted:', e);
                localStorage.removeItem('countriesCache');
                localStorage.removeItem('countriesCacheTime');
            }
        }
    }
}

// ========================================
// WELCOME SCREEN (REPLACES AUTO-LOAD)
// ========================================

function showWelcomeScreen() {
    countriesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 30px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); border-radius: 15px;">
            <h2 style="color: var(--primary-color); margin-bottom: 20px; font-size: 2.5rem;">
                🌍 Welcome to Global Info Explorer
            </h2>
            <p style="font-size: 1.3rem; color: var(--text-secondary); margin-bottom: 40px; line-height: 1.6;">
                Discover comprehensive information about countries worldwide
            </p>
            
            <!-- Quick Search Buttons -->
            <div style="background: var(--background-white); padding: 30px; border-radius: 12px; max-width: 700px; margin: 0 auto 30px; box-shadow: var(--shadow-md);">
                <p style="color: var(--text-primary); font-size: 1.2rem; font-weight: 600; margin-bottom: 20px;">
                     Try searching for a country:
                </p>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px;">
                    <button class="btn btn-primary" onclick="quickSearch('Japan')" style="font-size: 1rem; padding: 12px 24px;">
                        Japan 🇯🇵
                    </button>
                    <button class="btn btn-primary" onclick="quickSearch('France')" style="font-size: 1rem; padding: 12px 24px;">
                        France 🇫🇷
                    </button>
                    <button class="btn btn-primary" onclick="quickSearch('Brazil')" style="font-size: 1rem; padding: 12px 24px;">
                        Brazil 🇧🇷
                    </button>
                    <button class="btn btn-primary" onclick="quickSearch('Canada')" style="font-size: 1rem; padding: 12px 24px;">
                        Canada 🇨🇦
                    </button>
                </div>
                <p style="color: var(--text-light); font-size: 0.95rem; margin-top: 10px;">
                    Or use the search bar above for any country
                </p>
            </div>
            
            <!-- Browse All Button -->
            <div style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); padding: 30px; border-radius: 12px; max-width: 700px; margin: 0 auto; box-shadow: var(--shadow-lg);">
                <p style="color: white; font-size: 1.2rem; font-weight: 600; margin-bottom: 15px;">
                     Want to browse all countries?
                </p>
                <p style="color: rgba(255,255,255,0.9); font-size: 1rem; margin-bottom: 20px;">
                    Load and explore all 250+ countries with filters and sorting
                </p>
                <button class="btn" onclick="loadAllCountries()" style="background: white; color: var(--primary-color); font-size: 1.1rem; padding: 14px 32px; font-weight: 600; border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                     Load All Countries
                </button>
            </div>
            
            ${allCountries.length > 0 ? `
                <div style="margin-top: 20px;">
                    <p style="color: var(--success-color); font-size: 0.9rem;">
                        ✅ Countries data cached and ready!
                    </p>
                </div>
            ` : ''}
        </div>
    `;
    
    resultsCount.textContent = '';
}

// Quick search from welcome screen
window.quickSearch = function(countryName) {
    searchInput.value = countryName;
    handleSearch();
}

// Load all countries when user clicks button
window.loadAllCountries = function() {
    // If already loaded from cache, just display
    if (allCountries.length > 0) {
        console.log('Using cached data');
        filteredCountries = allCountries;
        displayCountries(filteredCountries);
        updateResultsCount(filteredCountries.length);
    } else {
        // Fetch from API
        fetchAllCountries();
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Basic Controls
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    regionFilter.addEventListener('change', handleFilter);
    sortSelect.addEventListener('change', handleSort);
    resetBtn.addEventListener('click', handleReset);
    retryBtn.addEventListener('click', () => {
        hideError();
        fetchAllCountries();
    });
    
    // Modal Controls
    modalClose.addEventListener('click', closeModal);
    countryModal.addEventListener('click', (e) => {
        if (e.target === countryModal) closeModal();
    });
    
    // New Features
    darkModeToggle.addEventListener('click', toggleDarkMode);
    compareBtn.addEventListener('click', openCompareModal);
    compareModalClose.addEventListener('click', closeCompareModal);
    compareModal.addEventListener('click', (e) => {
        if (e.target === compareModal) closeCompareModal();
    });
    
    favoritesBtn.addEventListener('click', openFavoritesModal);
    favoritesModalClose.addEventListener('click', closeFavoritesModal);
    favoritesModal.addEventListener('click', (e) => {
        if (e.target === favoritesModal) closeFavoritesModal();
    });
    
    statsBtn.addEventListener('click', openStatsModal);
    statsModalClose.addEventListener('click', closeStatsModal);
    statsModal.addEventListener('click', (e) => {
        if (e.target === statsModal) closeStatsModal();
    });
    
    quizBtn.addEventListener('click', openQuizModal);
    quizModalClose.addEventListener('click', closeQuizModal);
    quizModal.addEventListener('click', (e) => {
        if (e.target === quizModal) closeQuizModal();
    });
    
    // Advanced Filters
    advancedFiltersToggle.addEventListener('click', () => {
        advancedFilters.classList.toggle('hidden');
    });
    applyAdvancedFilters.addEventListener('click', handleAdvancedFilters);
    clearAdvancedFilters.addEventListener('click', () => {
        document.getElementById('populationMin').value = '';
        document.getElementById('populationMax').value = '';
        document.getElementById('areaMin').value = '';
        document.getElementById('areaMax').value = '';
        document.getElementById('languageFilter').value = '';
        document.getElementById('landlockFilter').value = 'all';
        document.getElementById('unMemberFilter').value = 'all';
        document.getElementById('independentFilter').value = 'all';
        handleFilter();
    });
    
    // View Mode
    if (gridView) {
        gridView.addEventListener('click', () => {
            currentView = 'grid';
            countriesGrid.classList.remove('list-view');
            gridView.classList.add('active');
            listView.classList.remove('active');
        });
    }
    
    if (listView) {
        listView.addEventListener('click', () => {
            currentView = 'list';
            countriesGrid.classList.add('list-view');
            listView.classList.add('active');
            gridView.classList.remove('active');
        });
    }
}

// ========================================
// API FUNCTIONS (OPTIMIZED WITH CACHING)
// ========================================

async function fetchAllCountries() {
    // Check if already in memory
    if (allCountries && allCountries.length > 0) {
        console.log('Countries already loaded in memory');
        filteredCountries = allCountries;
        displayCountries(filteredCountries);
        updateResultsCount(filteredCountries.length);
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        console.log('🌍 Fetching countries from API...');
        
        const response = await fetch('https://restcountries.com/v3.1/all');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('No countries data received');
        }
        
        console.log(`✅ Successfully loaded ${data.length} countries`);
        
        // Save to memory
        allCountries = data;
        filteredCountries = data;
        
        // Cache the data (with expiry after 7 days)
        try {
            localStorage.setItem('countriesCache', JSON.stringify(data));
            localStorage.setItem('countriesCacheTime', Date.now().toString());
            console.log('Data cached for 7 days');
        } catch (e) {
            console.warn('Could not cache data (storage full?)');
        }
        
        hideLoading();
        displayCountries(filteredCountries);
        updateResultsCount(filteredCountries.length);
        
    } catch (error) {
        console.error('❌ Error fetching countries:', error);
        hideLoading();
        showError('Unable to load countries. Please try searching for a specific country instead.');
    }
}

async function searchCountry(countryName) {
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Country not found');
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        hideLoading();
        return data;
        
    } catch (error) {
        hideLoading();
        
        if (error.message === 'Country not found') {
            showSearchNotFound(countryName);
        } else {
            showError('Type in the search bar to find country information');
        }
        
        console.error('Error searching country:', error);
        return [];
    }
}

// ========================================
// DISPLAY FUNCTIONS
// ========================================

function displayCountries(countries) {
    countriesGrid.innerHTML = '';
    
    if (countries.length === 0) {
        countriesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--background-white); border-radius: 10px;">No countries found. Try adjusting your search or filters.</p>';
        return;
    }
    
    countries.forEach(country => {
        const countryCard = createCountryCard(country);
        countriesGrid.appendChild(countryCard);
    });
}

function createCountryCard(country) {
    const card = document.createElement('div');
    card.className = 'country-card';
    
    const name = country.name?.common || 'Unknown';
    const capital = country.capital?.[0] || 'N/A';
    const region = country.region || 'N/A';
    const subregion = country.subregion || 'N/A';
    const population = country.population?.toLocaleString() || 'N/A';
    const area = country.area ? country.area.toLocaleString() + ' km²' : 'N/A';
    const flag = country.flags?.svg || country.flags?.png || '';
    const cca3 = country.cca3 || '';
    
    // Check if in favorites or compare list
    const isFavorite = favorites.includes(cca3);
    const isInCompare = compareList.some(c => c.cca3 === cca3);
    
    // Get languages
    const languages = country.languages ? Object.values(country.languages).slice(0, 2).join(', ') : 'N/A';
    
    card.innerHTML = `
        <div class="country-card-actions">
            <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" 
                    onclick="window.toggleFavorite('${cca3}', event)" 
                    title="Add to Favorites">
                ${isFavorite ? '⭐' : '☆'}
            </button>
            <button class="action-btn compare-btn ${isInCompare ? 'active' : ''}" 
                    onclick="window.toggleCompare('${cca3}', event)" 
                    title="Add to Compare">
                ${isInCompare ? '✓' : '⚖'}
            </button>
        </div>
        <img src="${flag}" alt="Flag of ${name}" class="country-flag" 
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23ddd%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>No Flag</text></svg>'">
        <div class="country-info">
            <h2 class="country-name">${name}</h2>
            <p class="country-detail"><strong> Capital:</strong> ${capital}</p>
            <p class="country-detail"><strong> Region:</strong> ${region}</p>
            <p class="country-detail"><strong> Subregion:</strong> ${subregion}</p>
            <p class="country-detail"><strong> Population:</strong> ${population}</p>
            <p class="country-detail"><strong> Area:</strong> ${area}</p>
            <div class="country-badges">
                <span class="country-badge"> ${languages}</span>
            </div>
        </div>
    `;
    
    // Click on card to show details
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.action-btn')) {
            showCountryDetails(country);
        }
    });
    
    return card;
}

function showCountryDetails(country) {
    const name = country.name?.common || 'Unknown';
    const officialName = country.name?.official || 'N/A';
    const nativeName = country.name?.nativeName ? Object.values(country.name.nativeName)[0]?.common : 'N/A';
    const capital = country.capital?.[0] || 'N/A';
    const region = country.region || 'N/A';
    const subregion = country.subregion || 'N/A';
    const population = country.population?.toLocaleString() || 'N/A';
    const area = country.area ? country.area.toLocaleString() + ' km²' : 'N/A';
    const flag = country.flags?.svg || country.flags?.png || '';
    const coatOfArms = country.coatOfArms?.svg || country.coatOfArms?.png || '';
    const cca3 = country.cca3 || '';
    
    // Demographics
    const populationDensity = country.population && country.area ? 
        (country.population / country.area).toFixed(2) + ' people/km²' : 'N/A';
    
    // Languages
    const languages = country.languages ? 
        Object.values(country.languages).map(lang => `<span class="detail-badge">${lang}</span>`).join(' ') : 
        '<span>N/A</span>';
    
    // Currencies
    const currencies = country.currencies ? 
        Object.values(country.currencies).map(curr => 
            `<span class="detail-badge">${curr.name} (${curr.symbol || 'N/A'})</span>`
        ).join(' ') : '<span>N/A</span>';
    
    // Timezones
    const timezones = country.timezones ? 
        country.timezones.map(tz => `<span class="detail-badge">${tz}</span>`).join(' ') : 
        '<span>N/A</span>';
    
    // Geographic info
    const landlocked = country.landlocked ? 'Yes (Landlocked)' : 'No (Has coastline)';
    const latlng = country.latlng ? `${country.latlng[0].toFixed(4)}°, ${country.latlng[1].toFixed(4)}°` : 'N/A';
    
    // Borders
    const borders = country.borders && country.borders.length > 0 ? 
        country.borders.map(code => `<span class="detail-badge">${code}</span>`).join(' ') : 
        '<span>None (Island nation or no land borders)</span>';
    
    // Driving side
    const drivingSide = country.car?.side ? 
        `${country.car.side === 'right' ? 'Right side' : 'Left side'}` : 'N/A';
    
    // Internet & Phone
    const tld = country.tld ? country.tld.join(', ') : 'N/A';
    const callingCode = country.idd?.root ? 
        `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}` : 'N/A';
    
    // UN Membership
    const unMember = country.unMember ? 'Yes' : 'No';
    
    // Independent status
    const independent = country.independent ? 'Independent Nation' : 'Dependent Territory';
    
    // Start of week
    const startOfWeek = country.startOfWeek ? 
        country.startOfWeek.charAt(0).toUpperCase() + country.startOfWeek.slice(1) : 'N/A';
    
    // Maps
    const googleMaps = country.maps?.googleMaps || '#';
    const openStreetMaps = country.maps?.openStreetMaps || '#';
    
    // Demonyms
    const demonym = country.demonyms?.eng?.m || 'N/A';
    
    // FIFA code
    const fifa = country.fifa || 'N/A';
    
    // Check if favorite
    const isFavorite = favorites.includes(cca3);
    
    // Create comprehensive details HTML
    countryDetails.innerHTML = `
        <img src="${flag}" alt="Flag of ${name}" class="detail-flag">
        
        <div class="detail-header">
            <h2 class="detail-title">${name}</h2>
            <p class="detail-subtitle">${officialName}</p>
            <p class="detail-subtitle">${independent}</p>
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="window.toggleFavorite('${cca3}', event)">
                    ${isFavorite ? '⭐ Remove from Favorites' : '☆ Add to Favorites'}
                </button>
                <button class="btn btn-secondary" onclick="window.shareCountry('${name}', '${googleMaps}')">
                    📤 Share
                </button>
                <button class="btn btn-secondary" onclick="window.printCountryInfo()">
                    🖨️ Print
                </button>
                <button class="btn btn-secondary" onclick="window.generateFunFact('${cca3}')">
                     Fun Fact
                </button>
            </div>
        </div>

        <div class="detail-sections">
            
            <!-- BASIC INFORMATION -->
            <div class="detail-section">
                <h3 class="section-title"> Basic Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Native Name</strong>
                        <span>${nativeName}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Capital City</strong>
                        <span>${capital}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Demonym (People)</strong>
                        <span>${demonym}</span>
                    </div>
                    <div class="detail-item">
                        <strong>FIFA Code</strong>
                        <span>${fifa}</span>
                    </div>
                    <div class="detail-item">
                        <strong>UN Member</strong>
                        <span>${unMember}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Week Starts</strong>
                        <span>${startOfWeek}</span>
                    </div>
                </div>
            </div>

            <!-- GEOGRAPHY & LOCATION -->
            <div class="detail-section">
                <h3 class="section-title"> Geography & Location</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Region</strong>
                        <span>${region}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Subregion</strong>
                        <span>${subregion}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Coordinates</strong>
                        <span>${latlng}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Total Area</strong>
                        <span>${area}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Coastline Access</strong>
                        <span>${landlocked}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Driving Side</strong>
                        <span>${drivingSide}</span>
                    </div>
                </div>
                <div class="map-links">
                    ${googleMaps !== '#' ? `<a href="${googleMaps}" target="_blank" class="map-link"> View on Google Maps</a>` : ''}
                    ${openStreetMaps !== '#' ? `<a href="${openStreetMaps}" target="_blank" class="map-link"> View on OpenStreetMap</a>` : ''}
                </div>
            </div>

            <!-- DEMOGRAPHICS -->
            <div class="detail-section">
                <h3 class="section-title"> Demographics & Population</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Total Population</strong>
                        <span>${population}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Population Density</strong>
                        <span>${populationDensity}</span>
                    </div>
                </div>
            </div>

            <!-- LANGUAGES & COMMUNICATION -->
            <div class="detail-section">
                <h3 class="section-title"> Languages & Communication</h3>
                <div class="detail-item">
                    <strong>Official Languages</strong>
                    <div class="detail-list">${languages}</div>
                </div>
            </div>

            <!-- ECONOMY & CURRENCY -->
            <div class="detail-section">
                <h3 class="section-title"> Economy & Currency</h3>
                <div class="detail-item">
                    <strong>Official Currencies</strong>
                    <div class="detail-list">${currencies}</div>
                </div>
                ${coatOfArms ? `
                <div class="detail-item">
                    <strong>Coat of Arms</strong><br>
                    <img src="${coatOfArms}" alt="Coat of Arms" style="max-width: 150px; margin-top: 10px; border-radius: 5px;">
                </div>
                ` : ''}
            </div>

            <!-- CONNECTIVITY & INFRASTRUCTURE -->
            <div class="detail-section">
                <h3 class="section-title"> Connectivity & Infrastructure</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Calling Code</strong>
                        <span>${callingCode}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Internet TLD</strong>
                        <span>${tld}</span>
                    </div>
                </div>
            </div>

            <!-- TIME & TIMEZONE -->
            <div class="detail-section">
                <h3 class="section-title"> Time & Timezone</h3>
                <div class="detail-item">
                    <strong>Timezones</strong>
                    <div class="detail-list">${timezones}</div>
                </div>
            </div>

            <!-- BORDERS & NEIGHBORS -->
            <div class="detail-section">
                <h3 class="section-title">🌏 Borders & Neighboring Countries</h3>
                <div class="detail-item">
                    <strong>Bordering Countries</strong>
                    <div class="detail-list">${borders}</div>
                </div>
            </div>

        </div>
    `;
    
    countryModal.classList.remove('hidden');
}

function closeModal() {
    countryModal.classList.add('hidden');
}

// ========================================
// SMART ERROR MESSAGES
// ========================================

function showSearchNotFound(searchTerm) {
    const lowerSearch = searchTerm.toLowerCase().trim();
    
    // Common cities that people might search for
    const commonCities = {
        'tokyo': 'Japan',
        'paris': 'France',
        'london': 'United Kingdom',
        'new york': 'United States',
        'rome': 'Italy',
        'berlin': 'Germany',
        'madrid': 'Spain',
        'beijing': 'China',
        'moscow': 'Russia',
        'dubai': 'United Arab Emirates',
        'singapore': 'Singapore',
        'sydney': 'Australia',
        'toronto': 'Canada',
        'mumbai': 'India',
        'cairo': 'Egypt',
        'istanbul': 'Turkey',
        'bangkok': 'Thailand',
        'seoul': 'South Korea',
        'mexico city': 'Mexico',
        'los angeles': 'United States',
        'chicago': 'United States',
        'houston': 'United States',
        'barcelona': 'Spain',
        'amsterdam': 'Netherlands',
        'brussels': 'Belgium',
        'vienna': 'Austria',
        'prague': 'Czech Republic',
        'warsaw': 'Poland',
        'budapest': 'Hungary',
        'athens': 'Greece',
        'lisbon': 'Portugal',
        'dublin': 'Ireland',
        'stockholm': 'Sweden',
        'oslo': 'Norway',
        'helsinki': 'Finland',
        'copenhagen': 'Denmark',
        'zurich': 'Switzerland',
        'milan': 'Italy',
        'venice': 'Italy',
        'florence': 'Italy',
        'marseille': 'France',
        'lyon': 'France',
        'manchester': 'United Kingdom',
        'liverpool': 'United Kingdom',
        'glasgow': 'United Kingdom',
        'miami': 'United States',
        'boston': 'United States',
        'san francisco': 'United States',
        'seattle': 'United States',
        'las vegas': 'United States',
        'vancouver': 'Canada',
        'montreal': 'Canada',
        'rio de janeiro': 'Brazil',
        'sao paulo': 'Brazil',
        'buenos aires': 'Argentina',
        'santiago': 'Chile',
        'lima': 'Peru',
        'bogota': 'Colombia',
        'caracas': 'Venezuela',
        'manila': 'Philippines',
        'jakarta': 'Indonesia',
        'kuala lumpur': 'Malaysia',
        'hanoi': 'Vietnam',
        'ho chi minh': 'Vietnam',
        'hong kong': 'China',
        'shanghai': 'China',
        'delhi': 'India',
        'bangalore': 'India',
        'karachi': 'Pakistan',
        'lahore': 'Pakistan',
        'dhaka': 'Bangladesh',
        'tehran': 'Iran',
        'baghdad': 'Iraq',
        'riyadh': 'Saudi Arabia',
        'jeddah': 'Saudi Arabia',
        'tel aviv': 'Israel',
        'jerusalem': 'Israel',
        'casablanca': 'Morocco',
        'lagos': 'Nigeria',
        'nairobi': 'Kenya',
        'johannesburg': 'South Africa',
        'cape town': 'South Africa',
        'accra': 'Ghana',
        'addis ababa': 'Ethiopia',
        'kigali': 'Rwanda'
    };
    
    // Check if it's a known city
    if (commonCities[lowerSearch]) {
        const countryName = commonCities[lowerSearch];
        countriesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; background: var(--background-white); border-radius: 10px; box-shadow: var(--shadow-md);">
                <h2 style="color: var(--primary-color); margin-bottom: 20px;"> "${searchTerm}" is a city!</h2>
                <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 20px;">
                    Did you mean to search for <strong style="color: var(--primary-color);">${countryName}</strong>?
                </p>
                <button class="btn btn-primary" onclick="window.searchForCountry('${countryName}')">
                    Search for ${countryName} 
                </button>
                <p style="margin-top: 20px; color: var(--text-light); font-size: 0.95rem;">
                    This app searches for countries, not cities. Try searching for country names instead.
                </p>
            </div>
        `;
    } else {
        // Generic not found message
        countriesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; background: var(--background-white); border-radius: 10px; box-shadow: var(--shadow-md);">
                <h2 style="color: var(--warning-color); margin-bottom: 20px;"> No Results Found</h2>
                <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 15px;">
                    We couldn't find a country matching <strong>"${searchTerm}"</strong>
                </p>
                <div style="background-color: var(--background-light); padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 500px;">
                    <p style="color: var(--text-primary); margin-bottom: 10px;"><strong> Tips:</strong></p>
                    <ul style="text-align: left; color: var(--text-secondary); line-height: 2;">
                        <li>Check your spelling</li>
                        <li>Search for the country name, not a city</li>
                        <li>Try using the full country name</li>
                        <li>Use the region filter to browse countries</li>
                    </ul>
                </div>
                <p style="margin-top: 20px; color: var(--text-light); font-size: 0.95rem;">
                    Examples: Japan, France, Brazil, Canada
                </p>
            </div>
        `;
    }
    
    updateResultsCount(0);
}

// Helper function to search for suggested country
window.searchForCountry = function(countryName) {
    searchInput.value = countryName;
    handleSearch();
}

// ========================================
// FAVORITES SYSTEM
// ========================================

window.toggleFavorite = function(cca3, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    console.log('Toggle favorite:', cca3);
    
    const index = favorites.indexOf(cca3);
    if (index > -1) {
        favorites.splice(index, 1);
        console.log('Removed from favorites');
    } else {
        favorites.push(cca3);
        console.log('Added to favorites');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    displayCountries(filteredCountries);
    
    // If detail modal is open, refresh it
    if (!countryModal.classList.contains('hidden')) {
        const country = allCountries.find(c => c.cca3 === cca3);
        if (country) {
            showCountryDetails(country);
        }
    }
    
    // If favorites modal is open, refresh it
    if (!favoritesModal.classList.contains('hidden')) {
        openFavoritesModal();
    }
}

function updateFavoritesCount() {
    if (favCount) {
        favCount.textContent = favorites.length;
    }
}

function openFavoritesModal() {
    console.log('Opening favorites modal. Favorites:', favorites);
    console.log('All countries loaded:', allCountries.length);
    
    if (favorites.length === 0) {
        favoritesContent.innerHTML = `
            <div class="text-center p-20">
                <h3 style="color: var(--text-secondary); margin-bottom: 15px;">No favorites yet</h3>
                <p style="color: var(--text-light);">Click the star icon (⭐) on any country card to add it to your favorites!</p>
            </div>
        `;
        favoritesModal.classList.remove('hidden');
        return;
    }
    
    // Check if countries are loaded
    if (allCountries.length === 0) {
        favoritesContent.innerHTML = `
            <div class="text-center p-20">
                <h3 style="color: var(--warning-color); margin-bottom: 15px;"> Loading Countries Data</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    Please wait while we load country information...
                </p>
                <div class="spinner" style="margin: 20px auto;"></div>
            </div>
        `;
        favoritesModal.classList.remove('hidden');
        
        // Load countries, then reopen modal
        fetchAllCountries().then(() => {
            if (allCountries.length > 0) {
                openFavoritesModal();
            }
        });
        return;
    }
    
    // Get favorite countries
    const favoriteCountries = allCountries.filter(c => favorites.includes(c.cca3));
    console.log('Favorite countries found:', favoriteCountries.length);
    
    if (favoriteCountries.length === 0) {
        favoritesContent.innerHTML = `
            <div class="text-center p-20">
                <h3 style="color: var(--warning-color);">⚠️ Favorites Not Found</h3>
                <p style="color: var(--text-secondary); margin-top: 10px;">
                    Your saved favorites couldn't be loaded.
                </p>
            </div>
        `;
    } else {
        // Clear and build grid
        favoritesContent.innerHTML = '';
        const gridDiv = document.createElement('div');
        gridDiv.className = 'countries-grid';
        
        favoriteCountries.forEach(country => {
            const card = createCountryCard(country);
            gridDiv.appendChild(card);
        });
        
        favoritesContent.appendChild(gridDiv);
    }
    
    favoritesModal.classList.remove('hidden');
}

function closeFavoritesModal() {
    favoritesModal.classList.add('hidden');
}

// ========================================
// COMPARE SYSTEM
// ========================================

window.toggleCompare = function(cca3, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    console.log('toggleCompare called with cca3:', cca3);
    
    const country = allCountries.find(c => c.cca3 === cca3);
    if (!country) {
        console.error('Country not found:', cca3);
        return;
    }
    
    const index = compareList.findIndex(c => c.cca3 === cca3);
    
    if (index > -1) {
        compareList.splice(index, 1);
        console.log('Removed from comparison:', cca3);
    } else {
        if (compareList.length >= 4) {
            alert('You can only compare up to 4 countries at once.');
            return;
        }
        compareList.push(country);
        console.log('Added to comparison:', cca3, 'Total:', compareList.length);
    }
    
    updateCompareCount();
    displayCountries(filteredCountries);
}

function updateCompareCount() {
    const text = `Compare (${compareList.length})`;
    if (compareCount) {
        compareCount.textContent = text;
    }
    console.log('Updated compare count:', text);
}

function openCompareModal() {
    console.log('Opening compare modal. Countries selected:', compareList.length);
    
    if (compareList.length < 2) {
        compareContent.innerHTML = `
            <div class="text-center p-20">
                <h3 style="color: var(--text-secondary); margin-bottom: 15px;">Select at least 2 countries</h3>
                <p style="color: var(--text-light);">Click the compare button (⚖️) on country cards to add them.</p>
            </div>
        `;
    } else {
        compareContent.innerHTML = createComparisonTable();
    }
    compareModal.classList.remove('hidden');
}

function closeCompareModal() {
    compareModal.classList.add('hidden');
}

function createComparisonTable() {
    const fields = [
        { label: 'Flag', key: 'flags', format: 'flag' },
        { label: 'Official Name', key: 'name.official' },
        { label: 'Capital', key: 'capital.0' },
        { label: 'Region', key: 'region' },
        { label: 'Subregion', key: 'subregion' },
        { label: 'Population', key: 'population', format: 'number' },
        { label: 'Area (km²)', key: 'area', format: 'number' },
        { label: 'Population Density', key: 'density', format: 'density' },
        { label: 'Languages', key: 'languages', format: 'languages' },
        { label: 'Currencies', key: 'currencies', format: 'currencies' },
        { label: 'Timezones', key: 'timezones', format: 'array' },
        { label: 'Calling Code', key: 'idd', format: 'idd' },
        { label: 'Landlocked', key: 'landlocked', format: 'boolean' },
        { label: 'UN Member', key: 'unMember', format: 'boolean' },
        { label: 'Independent', key: 'independent', format: 'boolean' },
    ];
    
    let html = `
        <div style="overflow-x: auto;">
            <table class="compare-table">
                <thead>
                    <tr>
                        <th style="position: sticky; left: 0; background-color: var(--background-white); z-index: 10;">Property</th>
                        ${compareList.map(c => `<th>${c.name.common}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
    `;
    
    fields.forEach(field => {
        html += '<tr>';
        html += `<td style="position: sticky; left: 0; background-color: var(--background-white); font-weight: 600; z-index: 5;"><strong>${field.label}</strong></td>`;
        
        compareList.forEach(country => {
            let value = getNestedValue(country, field.key);
            
            if (field.format === 'flag') {
                const flagUrl = country.flags?.svg || country.flags?.png || '';
                value = `<img src="${flagUrl}" alt="Flag" style="max-width: 120px; height: 70px; object-fit: cover; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
            } else if (field.format === 'number' && value) {
                value = value.toLocaleString();
            } else if (field.format === 'density') {
                value = country.population && country.area ? 
                    (country.population / country.area).toFixed(2) + ' people/km²' : 'N/A';
            } else if (field.format === 'languages') {
                value = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
            } else if (field.format === 'currencies') {
                value = country.currencies ? 
                    Object.values(country.currencies).map(c => `${c.name} (${c.symbol || 'N/A'})`).join(', ') : 'N/A';
            } else if (field.format === 'array') {
                value = Array.isArray(value) ? value.join(', ') : 'N/A';
            } else if (field.format === 'idd') {
                value = country.idd?.root ? 
                    `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}` : 'N/A';
            } else if (field.format === 'boolean') {
                value = value ? '✅ Yes' : '❌ No';
            } else if (!value) {
                value = 'N/A';
            }
            
            html += `<td>${value}</td>`;
        });
        
        html += '</tr>';
    });
    
    html += `
                </tbody>
            </table>
        </div>
        <div class="text-center mt-20">
            <button class="btn btn-secondary" onclick="window.clearComparison()">Clear Comparison</button>
        </div>
    `;
    
    return html;
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

window.clearComparison = function() {
    console.log('Clearing comparison');
    compareList = [];
    updateCompareCount();
    displayCountries(filteredCountries);
    closeCompareModal();
}

// ========================================
// STATISTICS & RANKINGS
// ========================================

function openStatsModal() {
    // Load countries if not loaded
    if (allCountries.length === 0) {
        statsContent.innerHTML = `
            <div class="text-center p-20">
                <h3 style="color: var(--warning-color); margin-bottom: 15px;">⏳ Loading Data</h3>
                <p style="color: var(--text-secondary);">Loading countries data...</p>
                <div class="spinner" style="margin: 20px auto;"></div>
            </div>
        `;
        statsModal.classList.remove('hidden');
        
        fetchAllCountries().then(() => {
            if (allCountries.length > 0) {
                openStatsModal();
            }
        });
        return;
    }
    
    const stats = calculateStatistics();
    statsContent.innerHTML = createStatisticsHTML(stats);
    statsModal.classList.remove('hidden');
}

function closeStatsModal() {
    statsModal.classList.add('hidden');
}

function calculateStatistics() {
    const totalCountries = allCountries.length;
    const totalPopulation = allCountries.reduce((sum, c) => sum + (c.population || 0), 0);
    const totalArea = allCountries.reduce((sum, c) => sum + (c.area || 0), 0);
    
    // Regional stats
    const regions = {};
    allCountries.forEach(country => {
        const region = country.region || 'Unknown';
        if (!regions[region]) {
            regions[region] = { count: 0, population: 0, area: 0 };
        }
        regions[region].count++;
        regions[region].population += country.population || 0;
        regions[region].area += country.area || 0;
    });
    
    // Top countries by population
    const topByPopulation = [...allCountries]
        .sort((a, b) => (b.population || 0) - (a.population || 0))
        .slice(0, 10);
    
    // Top countries by area
    const topByArea = [...allCountries]
        .sort((a, b) => (b.area || 0) - (a.area || 0))
        .slice(0, 10);
    
    // Most dense countries
    const topByDensity = [...allCountries]
        .filter(c => c.population && c.area)
        .sort((a, b) => (b.population / b.area) - (a.population / a.area))
        .slice(0, 10);
    
    // Languages stats
    const languages = {};
    allCountries.forEach(country => {
        if (country.languages) {
            Object.values(country.languages).forEach(lang => {
                languages[lang] = (languages[lang] || 0) + 1;
            });
        }
    });
    
    const topLanguages = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    return {
        totalCountries,
        totalPopulation,
        totalArea,
        regions,
        topByPopulation,
        topByArea,
        topByDensity,
        topLanguages
    };
}

function createStatisticsHTML(stats) {
    return `
        <div class="stats-grid">
            <!-- Overall Stats -->
            <div class="stat-card">
                <h3>🌍 Global Overview</h3>
                <div class="stat-item">
                    <span>Total Countries:</span>
                    <strong>${stats.totalCountries}</strong>
                </div>
                <div class="stat-item">
                    <span>Total Population:</span>
                    <strong>${stats.totalPopulation.toLocaleString()}</strong>
                </div>
                <div class="stat-item">
                    <span>Total Land Area:</span>
                    <strong>${stats.totalArea.toLocaleString()} km²</strong>
                </div>
            </div>
            
            <!-- Regional Distribution -->
            <div class="stat-card">
                <h3> Regional Distribution</h3>
                ${Object.entries(stats.regions).map(([region, data]) => `
                    <div class="stat-item">
                        <span>${region}:</span>
                        <strong>${data.count} countries</strong>
                    </div>
                `).join('')}
            </div>
            
            <!-- Top by Population -->
            <div class="stat-card">
                <h3>👥 Most Populous Countries</h3>
                ${stats.topByPopulation.map((c, i) => `
                    <div class="stat-item">
                        <span>${i + 1}. ${c.name.common}</span>
                        <strong>${(c.population || 0).toLocaleString()}</strong>
                    </div>
                `).join('')}
            </div>
            
            <!-- Top by Area -->
            <div class="stat-card">
                <h3> Largest Countries by Area</h3>
                ${stats.topByArea.map((c, i) => `
                    <div class="stat-item">
                        <span>${i + 1}. ${c.name.common}</span>
                        <strong>${(c.area || 0).toLocaleString()} km²</strong>
                    </div>
                `).join('')}
            </div>
            
            <!-- Top by Density -->
            <div class="stat-card">
                <h3> Most Dense Countries</h3>
                ${stats.topByDensity.map((c, i) => `
                    <div class="stat-item">
                        <span>${i + 1}. ${c.name.common}</span>
                        <strong>${(c.population / c.area).toFixed(0)} people/km²</strong>
                    </div>
                `).join('')}
            </div>
            
            <!-- Top Languages -->
            <div class="stat-card">
                <h3> Most Spoken Languages</h3>
                ${stats.topLanguages.map(([lang, count], i) => `
                    <div class="stat-item">
                        <span>${i + 1}. ${lang}</span>
                        <strong>${count} countries</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ========================================
// QUIZ MODE
// ========================================

function openQuizModal() {
    if (!allCountries || allCountries.length === 0) {
        quizContent.innerHTML = `
            <div class="text-center p-20">
                <h3 style="color: var(--warning-color); margin-bottom: 15px;">⏳ Loading Data</h3>
                <p style="color: var(--text-secondary);">Loading countries data for quiz...</p>
                <div class="spinner" style="margin: 20px auto;"></div>
            </div>
        `;
        quizModal.classList.remove('hidden');
        
        fetchAllCountries().then(() => {
            if (allCountries.length > 0) {
                openQuizModal();
            }
        });
        return;
    }
    
    generateQuiz();
    quizModal.classList.remove('hidden');
}

function closeQuizModal() {
    quizModal.classList.add('hidden');
}

function generateQuiz() {
    currentQuizIndex = 0;
    quizScore = 0;
    
    console.log('Starting quiz generation. Total countries:', allCountries.length);
    
    if (allCountries.length < 10) {
        alert('Not enough countries loaded for quiz. Please load countries first.');
        closeQuizModal();
        return;
    }
    
    // Generate 10 random questions
    quizQuestions = [];
    const questionTypes = ['capital', 'flag', 'population', 'region'];
    const usedCountries = new Set();
    
    for (let i = 0; i < 10; i++) {
        // Pick a random question type
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        // Pick a random country that hasn't been used yet
        let country;
        let attempts = 0;
        do {
            country = allCountries[Math.floor(Math.random() * allCountries.length)];
            attempts++;
        } while (usedCountries.has(country.cca3) && attempts < 100);
        
        if (!country) {
            console.error('Could not find country for question', i);
            continue;
        }
        
        usedCountries.add(country.cca3);
        
        // Validate country has required data for question type
        let skipQuestion = false;
        if (type === 'capital' && !country.capital?.[0]) {
            skipQuestion = true;
        } else if (type === 'population' && !country.population) {
            skipQuestion = true;
        } else if (type === 'region' && !country.region) {
            skipQuestion = true;
        }
        
        if (skipQuestion) {
            i--; // Retry this question
            continue;
        }
        
        const optionsData = generateOptions(country, type);
        
        // Validate we got good options
        if (optionsData.options.includes('N/A') || optionsData.correctAnswer === 'N/A') {
            i--; // Retry this question
            continue;
        }
        
        quizQuestions.push({
            type,
            country,
            options: optionsData.options,
            correctAnswer: optionsData.correctAnswer
        });
    }
    
    console.log('Quiz questions generated:', quizQuestions.length);
    
    if (quizQuestions.length < 5) {
        alert('Could not generate enough quiz questions. Try again.');
        closeQuizModal();
        return;
    }
    
    displayQuizQuestion();
}

function generateOptions(correctCountry, type) {
    const options = [];
    let correctAnswer = '';
    
    // Determine correct answer based on question type
    if (type === 'capital') {
        correctAnswer = correctCountry.capital?.[0];
        if (!correctAnswer) {
            console.error('No capital for country:', correctCountry.name.common);
            return { options: ['N/A', 'N/A', 'N/A', 'N/A'], correctAnswer: 'N/A' };
        }
    } else if (type === 'flag') {
        correctAnswer = correctCountry.name.common;
    } else if (type === 'population') {
        correctAnswer = (correctCountry.population || 0).toLocaleString();
    } else if (type === 'region') {
        correctAnswer = correctCountry.region;
        if (!correctAnswer) {
            console.error('No region for country:', correctCountry.name.common);
            return { options: ['N/A', 'N/A', 'N/A', 'N/A'], correctAnswer: 'N/A' };
        }
    }
    
    // Add correct answer
    options.push(correctAnswer);
    
    // Filter out the correct country and countries without required data
    const otherCountries = allCountries.filter(c => {
        if (c.cca3 === correctCountry.cca3) return false;
        
        if (type === 'capital' && !c.capital?.[0]) return false;
        if (type === 'population' && !c.population) return false;
        if (type === 'region' && !c.region) return false;
        
        return true;
    });
    
    if (otherCountries.length < 3) {
        console.error('Not enough countries for wrong answers');
        return { options: ['N/A', 'N/A', 'N/A', 'N/A'], correctAnswer: 'N/A' };
    }
    
    // Shuffle other countries for randomness
    const shuffledOthers = otherCountries.sort(() => Math.random() - 0.5);
    
    // Generate 3 unique wrong answers
    const usedAnswers = new Set([correctAnswer.toLowerCase()]);
    
    for (let i = 0; i < shuffledOthers.length && options.length < 4; i++) {
        const country = shuffledOthers[i];
        let wrongAnswer;
        
        if (type === 'capital') {
            wrongAnswer = country.capital[0];
        } else if (type === 'flag') {
            wrongAnswer = country.name.common;
        } else if (type === 'population') {
            wrongAnswer = country.population.toLocaleString();
        } else if (type === 'region') {
            wrongAnswer = country.region;
        }
        
        // Check if this answer is unique
        if (wrongAnswer && !usedAnswers.has(wrongAnswer.toLowerCase())) {
            options.push(wrongAnswer);
            usedAnswers.add(wrongAnswer.toLowerCase());
        }
    }
    
    // Ensure we have exactly 4 options
    if (options.length < 4) {
        console.error('Could not generate enough unique options');
        return { options: ['N/A', 'N/A', 'N/A', 'N/A'], correctAnswer: 'N/A' };
    }
    
    // Shuffle all options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    return {
        options: shuffledOptions,
        correctAnswer: correctAnswer
    };
}

function generateOptions(correctCountry, type) {
    let correctAnswer = '';
    const options = [];
    const otherCountries = allCountries.filter(c => c.cca3 !== correctCountry.cca3);
    
    if (otherCountries.length < 3) {
        console.error('Not enough countries to generate options');
        return {
            options: ['N/A', 'N/A', 'N/A', 'N/A'],
            correctAnswer: 'N/A'
        };
    }
    
    // Generate correct answer
    if (type === 'capital') {
        correctAnswer = correctCountry.capital?.[0] || 'Unknown';
    } else if (type === 'flag') {
        correctAnswer = correctCountry.name.common;
    } else if (type === 'population') {
        correctAnswer = (correctCountry.population || 0).toLocaleString();
    } else if (type === 'region') {
        correctAnswer = correctCountry.region || 'Unknown';
    }
    
    // Add correct answer first
    options.push(correctAnswer);
    
    // Generate 3 wrong answers
    const usedAnswers = new Set([correctAnswer]);
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loop
    
    while (options.length < 4 && attempts < maxAttempts) {
        attempts++;
        const randomCountry = otherCountries[Math.floor(Math.random() * otherCountries.length)];
        let wrongAnswer;
        
        if (type === 'capital') {
            wrongAnswer = randomCountry.capital?.[0];
        } else if (type === 'flag') {
            wrongAnswer = randomCountry.name.common;
        } else if (type === 'population') {
            wrongAnswer = (randomCountry.population || 0).toLocaleString();
        } else if (type === 'region') {
            wrongAnswer = randomCountry.region;
        }
        
        // Only add if it's valid and unique
        if (wrongAnswer && !usedAnswers.has(wrongAnswer)) {
            options.push(wrongAnswer);
            usedAnswers.add(wrongAnswer);
        }
    }
    
    // If we couldn't generate enough options, fill with placeholders
    while (options.length < 4) {
        options.push(`Option ${options.length + 1}`);
    }
    
    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    console.log('Generated options:', shuffledOptions);
    console.log('Correct answer:', correctAnswer);
    
    return {
        options: shuffledOptions,
        correctAnswer: correctAnswer
    };
}

function displayQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
        displayQuizResults();
        return;
    }
    
    const question = quizQuestions[currentQuizIndex];
    let questionText = '';
    
    if (question.type === 'capital') {
        questionText = `What is the capital of ${question.country.name.common}?`;
    } else if (question.type === 'flag') {
        questionText = `Which country does this flag belong to?`;
    } else if (question.type === 'population') {
        questionText = `What is the population of ${question.country.name.common}?`;
    } else if (question.type === 'region') {
        questionText = `Which region does ${question.country.name.common} belong to?`;
    }
    
    const flagUrl = question.country.flags?.svg || question.country.flags?.png || '';
    let html = `
        <div class="quiz-score">Question ${currentQuizIndex + 1} of ${quizQuestions.length} | Score: ${quizScore}/${currentQuizIndex}</div>
        <div class="quiz-question">
            <h3>${questionText}</h3>
            ${question.type === 'flag' && flagUrl ? `<img src="${flagUrl}" alt="Flag" style="max-width: 300px; margin: 20px auto; display: block; border-radius: 10px;">` : ''}
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" onclick="window.checkAnswer(${index})">${option}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    quizContent.innerHTML = html;
}

window.checkAnswer = function(selectedIndex) {
    const question = quizQuestions[currentQuizIndex];
    const correctAnswer = question.correctAnswer;
    const selectedAnswer = question.options[selectedIndex];
    
    const buttons = document.querySelectorAll('.quiz-option');
    
    if (selectedAnswer === correctAnswer) {
        quizScore++;
        buttons[selectedIndex].classList.add('correct');
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        // Highlight correct answer
        buttons.forEach((btn, index) => {
            if (question.options[index] === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Move to next question after 2 seconds
    setTimeout(() => {
        currentQuizIndex++;
        displayQuizQuestion();
    }, 2000);
}

function displayQuizResults() {
    const percentage = (quizScore / quizQuestions.length * 100).toFixed(0);
    let message = '';
    
    if (percentage >= 80) {
        message = ' Excellent! You really know your countries!';
    } else if (percentage >= 60) {
        message = ' Good job! You have solid knowledge!';
    } else if (percentage >= 40) {
        message = ' Not bad! Keep learning!';
    } else {
        message = ' Keep practicing! You\'ll get better!';
    }
    
    quizContent.innerHTML = `
        <div class="text-center p-20">
            <h2>🎉 Quiz Complete!</h2>
            <div class="quiz-score" style="font-size: 2rem; margin: 30px 0;">
                ${quizScore} / ${quizQuestions.length}
            </div>
            <p style="font-size: 1.5rem; margin: 20px 0;">${percentage}%</p>
            <p style="font-size: 1.2rem; margin: 20px 0;">${message}</p>
            <button class="btn btn-primary" onclick="generateQuiz()">🔄 Play Again</button>
            <button class="btn btn-secondary" onclick="closeQuizModal()">✖️ Close</button>
        </div>
    `;
}

// ========================================
// DARK MODE
// ========================================

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDarkMode);
}

// ========================================
// SEARCH, FILTER & SORT FUNCTIONS
// ========================================

async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        // If no search term and countries not loaded, show welcome
        if (allCountries.length === 0) {
            showWelcomeScreen();
            return;
        }
        filteredCountries = allCountries;
        displayCountries(filteredCountries);
        updateResultsCount(filteredCountries.length);
        return;
    }
    
    // If countries not loaded yet, load them first
    if (allCountries.length === 0) {
        await fetchAllCountries();
    }
    
    // Search locally first
    const localResults = allCountries.filter(country => {
        const name = country.name.common.toLowerCase();
        const capital = country.capital?.[0]?.toLowerCase() || '';
        const languages = country.languages ? Object.values(country.languages).join(' ').toLowerCase() : '';
        const term = searchTerm.toLowerCase();
        
        return name.includes(term) || capital.includes(term) || languages.includes(term);
    });
    
    if (localResults.length > 0) {
        filteredCountries = localResults;
        displayCountries(filteredCountries);
        updateResultsCount(filteredCountries.length);
    } else {
        // Try API search
        const results = await searchCountry(searchTerm);
        if (results.length > 0) {
            filteredCountries = results;
            // Add to allCountries if not already there
            results.forEach(country => {
                if (!allCountries.find(c => c.cca3 === country.cca3)) {
                    allCountries.push(country);
                }
            });
            displayCountries(filteredCountries);
            updateResultsCount(filteredCountries.length);
        }
    }
}

function handleFilter() {
    const selectedRegion = regionFilter.value;
    
    // Load countries if not loaded yet
    if (allCountries.length === 0 && selectedRegion !== 'all') {
        loadAllCountries();
        setTimeout(() => {
            handleFilter();
        }, 1000);
        return;
    }
    
    if (selectedRegion === 'all') {
        filteredCountries = allCountries;
    } else {
        filteredCountries = allCountries.filter(country => 
            country.region === selectedRegion
        );
    }
    
    handleSort();
}

function handleAdvancedFilters() {
    // Load countries if not loaded
    if (allCountries.length === 0) {
        loadAllCountries();
        setTimeout(() => {
            handleAdvancedFilters();
        }, 1000);
        return;
    }
    
    const popMin = parseInt(document.getElementById('populationMin').value) || 0;
    const popMax = parseInt(document.getElementById('populationMax').value) || Infinity;
    const areaMin = parseInt(document.getElementById('areaMin').value) || 0;
    const areaMax = parseInt(document.getElementById('areaMax').value) || Infinity;
    const language = document.getElementById('languageFilter').value.toLowerCase().trim();
    const landlocked = document.getElementById('landlockFilter').value;
    const unMember = document.getElementById('unMemberFilter').value;
    const independent = document.getElementById('independentFilter').value;
    
    filteredCountries = allCountries.filter(country => {
        // Population filter
        const population = country.population || 0;
        if (population < popMin || population > popMax) return false;
        
        // Area filter
        const area = country.area || 0;
        if (area < areaMin || area > areaMax) return false;
        
        // Language filter
        if (language) {
            const languages = country.languages ? Object.values(country.languages).join(' ').toLowerCase() : '';
            if (!languages.includes(language)) return false;
        }
        
        // Landlocked filter
        if (landlocked !== 'all') {
            const isLandlocked = country.landlocked;
            if (landlocked === 'yes' && !isLandlocked) return false;
            if (landlocked === 'no' && isLandlocked) return false;
        }
        
        // UN Member filter
        if (unMember !== 'all') {
            const isUNMember = country.unMember;
            if (unMember === 'yes' && !isUNMember) return false;
            if (unMember === 'no' && isUNMember) return false;
        }
        
        // Independent filter
        if (independent !== 'all') {
            const isIndependent = country.independent;
            if (independent === 'yes' && !isIndependent) return false;
            if (independent === 'no' && isIndependent) return false;
        }
        
        return true;
    });
    
    handleSort();
    if (advancedFilters) {
        advancedFilters.classList.add('hidden');
    }
}

function handleSort() {
    const sortValue = sortSelect.value;
    let sortedCountries = [...filteredCountries];
    
    switch(sortValue) {
        case 'name-asc':
            sortedCountries.sort((a, b) => 
                a.name.common.localeCompare(b.name.common)
            );
            break;
        case 'name-desc':
            sortedCountries.sort((a, b) => 
                b.name.common.localeCompare(a.name.common)
            );
            break;
        case 'population-desc':
            sortedCountries.sort((a, b) => 
                (b.population || 0) - (a.population || 0)
            );
            break;
        case 'population-asc':
            sortedCountries.sort((a, b) => 
                (a.population || 0) - (b.population || 0)
            );
            break;
        case 'area-desc':
            sortedCountries.sort((a, b) => 
                (b.area || 0) - (a.area || 0)
            );
            break;
        case 'area-asc':
            sortedCountries.sort((a, b) => 
                (a.area || 0) - (b.area || 0)
            );
            break;
    }
    
    displayCountries(sortedCountries);
    updateResultsCount(sortedCountries.length);
}

function handleReset() {
    searchInput.value = '';
    regionFilter.value = 'all';
    sortSelect.value = 'name-asc';
    
    // Clear advanced filters
    if (document.getElementById('populationMin')) {
        document.getElementById('populationMin').value = '';
        document.getElementById('populationMax').value = '';
        document.getElementById('areaMin').value = '';
        document.getElementById('areaMax').value = '';
        document.getElementById('languageFilter').value = '';
        document.getElementById('landlockFilter').value = 'all';
        document.getElementById('unMemberFilter').value = 'all';
        document.getElementById('independentFilter').value = 'all';
    }
    
    // Show welcome screen if countries not loaded
    if (allCountries.length === 0) {
        showWelcomeScreen();
    } else {
        filteredCountries = allCountries;
        displayCountries(filteredCountries);
        updateResultsCount(filteredCountries.length);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

window.shareCountry = function(name, url) {
    if (navigator.share) {
        navigator.share({
            title: `Check out ${name}!`,
            text: `Learn more about ${name} on Global Info Explorer`,
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy link
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Link copied to clipboard!');
    }
}

window.printCountryInfo = function() {
    window.print();
}

window.generateFunFact = function(cca3) {
    const country = allCountries.find(c => c.cca3 === cca3);
    if (!country) return;
    
    const facts = [
        `${country.name.common} has a population of ${(country.population || 0).toLocaleString()} people.`,
        `The total area of ${country.name.common} is ${(country.area || 0).toLocaleString()} km².`,
        `${country.name.common} is located in ${country.region}.`,
        `People from ${country.name.common} are called ${country.demonyms?.eng?.m || 'locals'}.`,
        `${country.name.common}'s capital is ${country.capital?.[0] || 'not officially designated'}.`,
        `${country.name.common} has ${country.languages ? Object.values(country.languages).length : 0} official language(s).`,
        country.landlocked ? `${country.name.common} is a landlocked country.` : `${country.name.common} has access to the ocean.`,
        country.unMember ? `${country.name.common} is a member of the United Nations.` : `${country.name.common} is not a UN member.`,
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    alert(` Fun Fact: ${randomFact}`);
}

// ========================================
// UI HELPER FUNCTIONS
// ========================================

function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
    countriesGrid.innerHTML = '';
}

function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
}

function showError(message) {
    if (errorText && errorMessage) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    }
}

function hideError() {
    if (errorMessage) {
        errorMessage.classList.add('hidden');
    }
}

function updateResultsCount(count) {
    if (resultsCount) {
        resultsCount.textContent = `Showing ${count} ${count === 1 ? 'country' : 'countries'}`;
    }
}

// ========================================
// END OF SCRIPT
// ========================================

console.log('✅ Global Info Explorer script loaded successfully!');
