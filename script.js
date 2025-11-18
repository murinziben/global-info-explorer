// ========================================
// GLOBAL VARIABLES
// ========================================

let allCountries = []; // Stores all countries data
let filteredCountries = []; // Stores filtered/sorted countries

// DOM Elements (getting references to HTML elements)
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

// ========================================
// INITIALIZATION
// ========================================

// This function runs when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchAllCountries();
    setupEventListeners();
});

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Search button click
    searchBtn.addEventListener('click', handleSearch);
    
    // Enter key in search box
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Region filter change
    regionFilter.addEventListener('change', handleFilter);
    
    // Sort option change
    sortSelect.addEventListener('change', handleSort);
    
    // Reset button click
    resetBtn.addEventListener('click', handleReset);
    
    // Retry button (appears when there's an error)
    retryBtn.addEventListener('click', () => {
        hideError();
        fetchAllCountries();
    });
    
    // Close modal button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    countryModal.addEventListener('click', (e) => {
        if (e.target === countryModal) {
            closeModal();
        }
    });
}

// ========================================
// API FUNCTIONS
// ========================================

/**
 * Fetch all countries from the REST Countries API
 * This is the main function that gets data from the internet
 */
async function fetchAllCountries() {
    showLoading();
    hideError();
    
    try {
        // Make a request to the API
        const response = await fetch('https://restcountries.com/v3.1/all');
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Convert the response to JSON format
        const data = await response.json();
        
        // Store the data
        allCountries = data;
        filteredCountries = data;
        
        // Display the countries
        hideLoading();
        displayCountries(filteredCountries);
        updateResultsCount(filteredCountries.length);
        
    } catch (error) {
        // If something goes wrong, show an error message
        hideLoading();
        showError('Failed to load countries data. Please check your internet connection and try again.');
        console.error('Error fetching countries:', error);
    }
}

/**
 * Search for a specific country by name
 */
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
            showError(`No country found with the name "${countryName}". Please try a different search.`);
        } else {
            showError('Failed to search for country. Please try again.');
        }
        console.error('Error searching country:', error);
        return [];
    }
}

// ========================================
// DISPLAY FUNCTIONS
// ========================================

/**
 * Display countries in the grid
 */
function displayCountries(countries) {
    // Clear existing content
    countriesGrid.innerHTML = '';
    
    // If no countries, show a message
    if (countries.length === 0) {
        countriesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 10px;">No countries found. Try adjusting your search or filters.</p>';
        return;
    }
    
    // Create a card for each country
    countries.forEach(country => {
        const countryCard = createCountryCard(country);
        countriesGrid.appendChild(countryCard);
    });
}

/**
 * Create a single country card
 */
function createCountryCard(country) {
    const card = document.createElement('div');
    card.className = 'country-card';
    
    // Get country data (with fallbacks if data is missing)
    const name = country.name?.common || 'Unknown';
    const capital = country.capital?.[0] || 'N/A';
    const region = country.region || 'N/A';
    const population = country.population?.toLocaleString() || 'N/A';
    const flag = country.flags?.svg || country.flags?.png || '';
    
    // Create the HTML for the card
    card.innerHTML = `
        <img src="${flag}" alt="Flag of ${name}" class="country-flag" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23ddd%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>No Flag</text></svg>'">
        <div class="country-info">
            <h2 class="country-name">${name}</h2>
            <p class="country-detail"><strong>Capital:</strong> ${capital}</p>
            <p class="country-detail"><strong>Region:</strong> ${region}</p>
            <p class="country-detail"><strong>Population:</strong> ${population}</p>
        </div>
    `;
    
    // Add click event to show details
    card.addEventListener('click', () => showCountryDetails(country));
    
    return card;
}

/**
 * Show detailed information about a country in a modal
 */
function showCountryDetails(country) {
    const name = country.name?.common || 'Unknown';
    const officialName = country.name?.official || 'N/A';
    const capital = country.capital?.[0] || 'N/A';
    const region = country.region || 'N/A';
    const subregion = country.subregion || 'N/A';
    const population = country.population?.toLocaleString() || 'N/A';
    const area = country.area ? country.area.toLocaleString() + ' km²' : 'N/A';
    const flag = country.flags?.svg || country.flags?.png || '';
    
    // Languages
    const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
    
    // Currencies
    const currencies = country.currencies ? 
        Object.values(country.currencies).map(curr => `${curr.name} (${curr.symbol || ''})`).join(', ') : 'N/A';
    
    // Timezones
    const timezones = country.timezones ? country.timezones.join(', ') : 'N/A';
    
    // Borders (neighboring countries)
    const borders = country.borders ? country.borders.join(', ') : 'None';
    
    // Create the detailed view HTML
    countryDetails.innerHTML = `
        <img src="${flag}" alt="Flag of ${name}" class="detail-flag" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23ddd%22/></svg>'">
        <h2 class="detail-title">${name}</h2>
        <div class="detail-grid">
            <div class="detail-item">
                <strong>Official Name:</strong>
                ${officialName}
            </div>
            <div class="detail-item">
                <strong>Capital:</strong>
                ${capital}
            </div>
            <div class="detail-item">
                <strong>Region:</strong>
                ${region}
            </div>
            <div class="detail-item">
                <strong>Subregion:</strong>
                ${subregion}
            </div>
            <div class="detail-item">
                <strong>Population:</strong>
                ${population}
            </div>
            <div class="detail-item">
                <strong>Area:</strong>
                ${area}
            </div>
            <div class="detail-item">
                <strong>Languages:</strong>
                ${languages}
            </div>
            <div class="detail-item">
                <strong>Currencies:</strong>
                ${currencies}
            </div>
            <div class="detail-item">
                <strong>Timezones:</strong>
                ${timezones}
            </div>
            <div class="detail-item">
                <strong>Borders:</strong>
                ${borders}
            </div>
        </div>
    `;
    
    // Show the modal
    countryModal.classList.remove('hidden');
}

/**
 * Close the country details modal
 */
function closeModal() {
    countryModal.classList.add('hidden');
}

// ========================================
// SEARCH, FILTER & SORT FUNCTIONS
// ========================================

/**
 * Handle search button click
 */
async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        // If search is empty, show all countries
        filteredCountries = allCountries;
        displayCountries(filteredCountries);
        updateResultsCount(filteredCountries.length);
        return;
    }
    
    // Search using the API
    const results = await searchCountry(searchTerm);
    if (results.length > 0) {
        filteredCountries = results;
        displayCountries(filteredCountries);
        updateResultsCount(filteredCountries.length);
    }
}

/**
 * Handle region filter change
 */
function handleFilter() {
    const selectedRegion = regionFilter.value;
    
    if (selectedRegion === 'all') {
        filteredCountries = allCountries;
    } else {
        filteredCountries = allCountries.filter(country => 
            country.region === selectedRegion
        );
    }
    
    // Apply current sort
    handleSort();
}

/**
 * Handle sort option change
 */
function handleSort() {
    const sortValue = sortSelect.value;
    
    // Create a copy to avoid modifying the original array
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

/**
 * Reset all filters and search
 */
function handleReset() {
    searchInput.value = '';
    regionFilter.value = 'all';
    sortSelect.value = 'name-asc';
    filteredCountries = allCountries;
    displayCountries(filteredCountries);
    updateResultsCount(filteredCountries.length);
}

// ========================================
// UI HELPER FUNCTIONS
// ========================================

function showLoading() {
    loadingIndicator.classList.remove('hidden');
    countriesGrid.innerHTML = '';
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function updateResultsCount(count) {
    resultsCount.textContent = `Showing ${count} ${count === 1 ? 'country' : 'countries'}`;
}
