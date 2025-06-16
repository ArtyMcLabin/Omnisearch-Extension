// Omnisearch v1.2.1
const input = document.getElementById('searchInput');
const btn = document.getElementById('searchBtn');
const settingsBtn = document.getElementById('settingsBtn');
const engineCount = document.getElementById('engineCount');
const enginesList = document.getElementById('enginesList');
const toggleAll = document.getElementById('toggleAll');

// Default search engines (fallback)
const DEFAULT_ENGINES = [
  {
    id: 'google-keep',
    name: 'Google Keep',
    url: 'https://keep.google.com/#search/text=${query}',
    enabled: true
  },
  {
    id: 'google-tasks',
    name: 'Google Tasks',
    url: 'https://tasks.google.com/embed/list/~default?query=${query}',
    enabled: true
  },
  {
    id: 'trello',
    name: 'Trello',
    url: 'https://trello.com/search?q=${query}',
    enabled: true
  }
];

let searchEngines = [];

// Load search engines on popup open
document.addEventListener('DOMContentLoaded', loadSearchEngines);

async function loadSearchEngines() {
  try {
    const result = await chrome.storage.sync.get(['searchEngines']);
    if (result.searchEngines && result.searchEngines.length > 0) {
      searchEngines = result.searchEngines;
    } else {
      // First time setup - use defaults and save them
      searchEngines = [...DEFAULT_ENGINES];
      await chrome.storage.sync.set({ searchEngines: searchEngines });
    }
    updateUI();
  } catch (error) {
    console.error('Error loading search engines:', error);
    searchEngines = [...DEFAULT_ENGINES];
    updateUI();
  }
}

function updateUI() {
  updateEngineCount();
  renderEnginesList();
}

function updateEngineCount() {
  const enabledEngines = searchEngines.filter(engine => engine.enabled);
  const count = enabledEngines.length;
  engineCount.textContent = `${count} search engine${count !== 1 ? 's' : ''} enabled`;
  
  // Disable search button if no engines enabled
  btn.disabled = count === 0;
  if (count === 0) {
    btn.textContent = 'No Search Engines Enabled';
  } else {
    btn.textContent = `Search ${count} Platform${count !== 1 ? 's' : ''}`;
  }
}

function renderEnginesList() {
  if (searchEngines.length === 0) {
    enginesList.innerHTML = '<div class="no-engines">No search engines configured</div>';
    return;
  }
  
  enginesList.innerHTML = '';
  
  searchEngines.forEach((engine, index) => {
    const engineItem = document.createElement('div');
    engineItem.className = `engine-item ${engine.enabled ? '' : 'disabled'}`;
    
    engineItem.innerHTML = `
      <input type="checkbox" class="engine-checkbox" ${engine.enabled ? 'checked' : ''} 
             data-index="${index}">
      <span class="engine-name">${engine.name}</span>
    `;
    
    enginesList.appendChild(engineItem);
  });
  
  // Add event listeners for checkboxes
  addEngineCheckboxListeners();
}

function addEngineCheckboxListeners() {
  document.querySelectorAll('.engine-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const index = parseInt(this.dataset.index);
      toggleEngineInPopup(index);
    });
  });
}

async function toggleEngineInPopup(index) {
  searchEngines[index].enabled = !searchEngines[index].enabled;
  
  // Save to storage
  try {
    await chrome.storage.sync.set({ searchEngines: searchEngines });
    updateUI();
  } catch (error) {
    console.error('Error saving engine state:', error);
    // Revert the change if save failed
    searchEngines[index].enabled = !searchEngines[index].enabled;
    updateUI();
  }
}

function toggleAllEngines() {
  const enabledCount = searchEngines.filter(engine => engine.enabled).length;
  const shouldEnableAll = enabledCount < searchEngines.length;
  
  searchEngines.forEach(engine => {
    engine.enabled = shouldEnableAll;
  });
  
  // Save to storage
  chrome.storage.sync.set({ searchEngines: searchEngines }).then(() => {
    updateUI();
  }).catch(error => {
    console.error('Error saving engines state:', error);
  });
}

function processUrl(url, query) {
  // Support both ${query} and %s placeholders (like Chrome custom search engines)
  return url.replace(/\$\{query\}/g, query).replace(/%s/g, query);
}

async function doOmniSearch() {
  const q = input.value.trim();
  if (!q) return;
  
  const enabledEngines = searchEngines.filter(engine => engine.enabled);
  if (enabledEngines.length === 0) {
    alert('No search engines enabled. Please enable at least one search engine.');
    return;
  }
  
  const query = encodeURIComponent(q);
  
  for (const engine of enabledEngines) {
    const url = processUrl(engine.url, query);
    chrome.tabs.create({ url });
  }
  
  input.value = '';
  window.close(); // Close popup after search
}

function openSettings() {
  chrome.runtime.openOptionsPage();
}

// Event listeners
btn.addEventListener('click', doOmniSearch);
settingsBtn.addEventListener('click', openSettings);
toggleAll.addEventListener('click', toggleAllEngines);

input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    doOmniSearch();
  }
}); 