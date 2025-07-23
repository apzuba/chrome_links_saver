
(async function() {
  const titleInput = document.getElementById('title');
  const saveBtn = document.getElementById('saveBtn');
  const linksContainer = document.getElementById('links');

  saveBtn.addEventListener('click', saveCurrentTab);
  titleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveCurrentTab();
    }
  });

  function saveCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const title = titleInput.value.trim() || tab.title;

      chrome.storage.local.get(['savedLinks'], (result) => {
        const links = result.savedLinks || [];
        links.push({ title: title, url: tab.url });
        chrome.storage.local.set({ savedLinks: links }, () => {
          titleInput.value = '';
          loadLinks();
        });
      });
    });
  }

  function deleteLink(index) {
    chrome.storage.local.get(['savedLinks'], (result) => {
      const links = result.savedLinks || [];
      links.splice(index, 1);
      chrome.storage.local.set({ savedLinks: links }, loadLinks);
    });
  }

  function loadLinks() {
    chrome.storage.local.get(['savedLinks'], (result) => {
      const links = result.savedLinks || [];
      linksContainer.innerHTML = '';
      links.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = 'link-item';

        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.textContent = link.title;

        const btn = document.createElement('button');
        btn.className = 'delete-btn';
        btn.textContent = '✕';
        btn.addEventListener('click', () => deleteLink(index));

        div.appendChild(a);
        div.appendChild(btn);
        linksContainer.appendChild(div);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', loadLinks);
})();
