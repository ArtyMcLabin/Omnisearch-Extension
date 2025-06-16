// Omnisearch Settings v1.2.1

// Default search engines
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

// Load settings on page load
document.addEventListener('DOMContentLoaded', loadSettings);

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(['searchEngines']);
    if (result.searchEngines && result.searchEngines.length > 0) {
      searchEngines = result.searchEngines;
    } else {
      // First time setup - use defaults
      searchEngines = [...DEFAULT_ENGINES];
      await saveSettings();
    }
    renderEngines();
  } catch (error) {
    console.error('Error loading settings:', error);
    searchEngines = [...DEFAULT_ENGINES];
    renderEngines();
  }
}

function renderEngines() {
  const container = document.getElementById('searchEngines');
  container.innerHTML = '';
  
  searchEngines.forEach((engine, index) => {
    const engineDiv = document.createElement('div');
    engineDiv.className = `search-engine ${engine.enabled ? '' : 'disabled'}`;
    engineDiv.dataset.index = index;
    
    engineDiv.innerHTML = `
      <div class="engine-header">
        <input type="checkbox" class="engine-checkbox" ${engine.enabled ? 'checked' : ''} 
               data-index="${index}">
        <input type="text" class="engine-name" value="${engine.name}" 
               data-index="${index}">
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
      <input type="text" class="engine-url" value="${engine.url}" 
             data-index="${index}"
             placeholder="https://example.com/search?q=\${query} or https://example.com/search?q=%s">
      <div class="help-text">Use \${query} or %s as placeholder for search term (like Chrome custom search engines)</div>
    `;
    
    container.appendChild(engineDiv);
  });
  
  // Add event listeners for the newly created elements
  addEngineEventListeners();
}

function addEngineEventListeners() {
  // Checkbox event listeners
  document.querySelectorAll('.engine-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const index = parseInt(this.dataset.index);
      toggleEngine(index);
    });
  });
  
  // Engine name input event listeners
  document.querySelectorAll('.engine-name').forEach(input => {
    input.addEventListener('change', function() {
      const index = parseInt(this.dataset.index);
      updateEngineName(index, this.value);
    });
  });
  
  // Engine URL input event listeners
  document.querySelectorAll('.engine-url').forEach(input => {
    input.addEventListener('change', function() {
      const index = parseInt(this.dataset.index);
      updateEngineUrl(index, this.value);
    });
  });
  
  // Delete button event listeners
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      deleteEngine(index);
    });
  });
}

function toggleEngine(index) {
  searchEngines[index].enabled = !searchEngines[index].enabled;
  renderEngines();
}

function updateEngineName(index, name) {
  searchEngines[index].name = name.trim();
}

function updateEngineUrl(index, url) {
  searchEngines[index].url = url.trim();
}

function deleteEngine(index) {
  if (confirm(`Delete "${searchEngines[index].name}"?`)) {
    searchEngines.splice(index, 1);
    renderEngines();
  }
}

function addEngine() {
  const nameInput = document.getElementById('newEngineName');
  const urlInput = document.getElementById('newEngineUrl');
  
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  
  if (!name || !url) {
    alert('Please enter both name and URL');
    return;
  }
  
  if (!url.includes('${query}') && !url.includes('%s')) {
    alert('URL must contain ${query} or %s placeholder for the search term');
    return;
  }
  
  const newEngine = {
    id: 'custom-' + Date.now(),
    name: name,
    url: url,
    enabled: true
  };
  
  searchEngines.push(newEngine);
  renderEngines();
  
  // Clear inputs
  nameInput.value = '';
  urlInput.value = '';
}

async function saveSettings() {
  try {
    await chrome.storage.sync.set({ searchEngines: searchEngines });
    
    // Show success feedback
    const saveBtn = document.getElementById('saveBtn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.background = '#28a745';
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.style.background = '#28a745';
    }, 2000);
    
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Error saving settings. Please try again.');
  }
}

// Event listeners
document.getElementById('addEngineBtn').addEventListener('click', addEngine);
document.getElementById('saveBtn').addEventListener('click', saveSettings);

// Allow Enter key to add engine
document.getElementById('newEngineUrl').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    addEngine();
  }
}); 