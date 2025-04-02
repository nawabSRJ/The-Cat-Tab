const apiUrl = "https://api.thecatapi.com/v1/images/search";
let currentSettings = {
    displayMode: 'single',
    catsCount: 6
};

// DOM Elements
const catImage = document.getElementById('cat-image');
const singleView = document.getElementById('single-view');
const gridView = document.getElementById('grid-view');
const themeToggle = document.getElementById('theme-toggle');
const refreshBtn = document.getElementById('refresh-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModal = document.getElementById('close-modal');
const saveSettings = document.getElementById('save-settings');
const multipleSettings = document.getElementById('multiple-settings');
const catsCountInput = document.getElementById('cats-count');
const catsCountValue = document.getElementById('cats-count-value');
const loadingOverlay = document.getElementById('loading-overlay');
const footer = document.getElementById('foot')
// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    applySettings();
    fetchCats();
    setupEventListeners();
    
    // Apply dark mode if enabled
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('catTabSettings');
    if (savedSettings) {
        currentSettings = JSON.parse(savedSettings);
    }
}

// Save settings to localStorage
function saveCurrentSettings() {
    localStorage.setItem('catTabSettings', JSON.stringify(currentSettings));
}

// Apply current settings to the UI
function applySettings() {
    // Apply display mode
    if (currentSettings.displayMode === 'single') {
        singleView.classList.remove('hidden');
        gridView.classList.add('hidden');
    } else {
        singleView.classList.add('hidden');
        gridView.classList.remove('hidden');
    }

    // Update settings modal UI
    document.querySelector(`input[name="display-mode"][value="${currentSettings.displayMode}"]`).checked = true;
    catsCountInput.value = currentSettings.catsCount;
    catsCountValue.textContent = currentSettings.catsCount;

    // Show/hide multiple settings
    if (currentSettings.displayMode === 'multiple') {
        multipleSettings.classList.remove('hidden');
    } else {
        multipleSettings.classList.add('hidden');
    }
}

// Enable dark mode
function enableDarkMode() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'enabled');
    document.body.style.backgroundColor = '#111827'
    footer.style.backgroundColor = '#111827'
    footer.style.color='#4B5563';

}

// Disable dark mode
function disableDarkMode() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'disabled');
    document.body.style.backgroundColor = 'whitesmoke '
    footer.style.backgroundColor = 'whitesmoke '
    footer.style.color="#111827";
}

// Toggle dark mode
function toggleDarkMode() {
    if (document.documentElement.classList.contains('dark')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Fetch cats based on current settings
async function fetchCats() {
    try {
        showLoading();
        if (currentSettings.displayMode === 'single') {
            await fetchSingleCat();
        } else {
            await fetchMultipleCats();
        }
    } catch (error) {
        console.error('Error fetching cats:', error);
    } finally {
        hideLoading();
    }
}

// Show loading overlay
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

// Hide loading overlay
function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// Fetch a single cat image
async function fetchSingleCat() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    catImage.src = data[0]?.url;
    catImage.onload = () => catImage.style.opacity = 1;
}

// Fetch multiple cat images
async function fetchMultipleCats() {
    const count = currentSettings.catsCount;
    const responses = await Promise.all(
        Array.from({ length: count }, () => fetch(apiUrl))
    );
    const data = await Promise.all(responses.map(r => r.json()));

    gridView.innerHTML = '';
    data.forEach(cat => {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'flex justify-center';
        
        const img = document.createElement('img');
        img.src = cat[0]?.url;
        img.alt = 'Cute cat';
        img.className = 'opacity-0 w-full max-w-[300px] h-[200px] object-cover rounded-lg shadow-md';
        img.onload = () => img.style.opacity = 1;
        
        imgContainer.appendChild(img);
        gridView.appendChild(imgContainer);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleDarkMode);

    // Refresh button
    refreshBtn.addEventListener('click', fetchCats);

    // Settings button
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        setTimeout(() => {
            settingsModal.classList.add('visible');
        }, 10);
    });

    // Close modal
    closeModal.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });

    // Save settings
    saveSettings.addEventListener('click', saveSettingsAndClose);

    // Display mode change
    document.querySelectorAll('input[name="display-mode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'multiple') {
                multipleSettings.classList.remove('hidden');
            } else {
                multipleSettings.classList.add('hidden');
            }
        });
    });

    // Cats count slider
    catsCountInput.addEventListener('input', () => {
        catsCountValue.textContent = catsCountInput.value;
    });

    // Double click for cat sound easter egg
    document.addEventListener('dblclick', playCatSound);
}

// Close settings modal
function closeSettingsModal() {
    settingsModal.classList.remove('visible');
    setTimeout(() => {
        settingsModal.classList.add('hidden');
    }, 300);
}

// Save settings and close modal
function saveSettingsAndClose() {
    const displayMode = document.querySelector('input[name="display-mode"]:checked').value;
    currentSettings = {
        displayMode,
        catsCount: parseInt(catsCountInput.value)
    };
    
    saveCurrentSettings();
    applySettings();
    fetchCats();
    closeSettingsModal();
}

// Play cat sound on double click
// function playCatSound() {
//     const sounds = [
//         'https://www.myinstants.com/media/sounds/meow.mp3',
//         'https://www.myinstants.com/media/sounds/cat-meow-2.mp3',
//         'https://www.myinstants.com/media/sounds/cat-meow-6226.mp3'
//     ];
    
//     const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
//     const audio = new Audio(randomSound);
//     audio.play().catch(e => console.log('Audio play failed:', e));
    
//     // Add temporary paw cursor
//     document.body.classList.add('paw-cursor');
//     setTimeout(() => {
//         document.body.classList.remove('paw-cursor');
//     }, 1000);
// }