// Omnisearch v1.0
const input = document.getElementById('searchInput');
const btn = document.getElementById('searchBtn');

function doOmniSearch() {
  const q = input.value.trim();
  if (!q) return;
  const query = encodeURIComponent(q);
  const urls = [
    `https://keep.google.com/#search/text=${query}`,
    `https://tasks.google.com/embed/list/~default?query=${query}`,
    `https://trello.com/search?q=${query}`
  ];
  for (const url of urls) {
    chrome.tabs.create({ url });
  }
  input.value = '';
}

btn.addEventListener('click', doOmniSearch);
input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') doOmniSearch();
}); 