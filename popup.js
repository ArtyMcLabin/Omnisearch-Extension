// Omnisearch v1.1
const input = document.getElementById('searchInput');
const btn = document.getElementById('searchBtn');
const settingsBtn = document.getElementById('settingsBtn');
const engineCount = document.getElementById('engineCount');

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
    updateEngineCount();
  } catch (error) {
    console.error('Error loading search engines:', error);
    searchEngines = [...DEFAULT_ENGINES];
    updateEngineCount();
  }
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

async function doOmniSearch() {
  const q = input.value.trim();
  if (!q) return;
  
  const enabledEngines = searchEngines.filter(engine => engine.enabled);
  if (enabledEngines.length === 0) {
    alert('No search engines enabled. Please configure in settings.');
    return;
  }
  
  const query = encodeURIComponent(q);
  
  for (const engine of enabledEngines) {
    const url = engine.url.replace('${query}', query);
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

input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    doOmniSearch();
  }
}); 