class Codex {
  constructor(bookData, onUpdate) {
    this.bookData = bookData;
    this.onUpdate = onUpdate;
    this.searchFilter = '';
    this.collapsedCategories = new Set();

    // Initialize codex data if not exists
    if (!this.bookData.data.codex) {
      this.bookData.data.codex = {
        categories: ['Character', 'Locals', 'Plots', 'Object', 'Lore', 'Other'],
        entries: []
      };
    }
  }

  // Add a new category
  addCategory(categoryName) {
    if (!categoryName || categoryName.trim() === '') {
      return false;
    }

    const trimmedName = categoryName.trim();
    if (this.bookData.data.codex.categories.includes(trimmedName)) {
      alert('Category already exists!');
      return false;
    }

    this.bookData.data.codex.categories.push(trimmedName);
    this.onUpdate();
    return true;
  }

  // Remove a category
  removeCategory(categoryName) {
    const index = this.bookData.data.codex.categories.indexOf(categoryName);
    if (index > -1) {
      // Check if there are entries in this category
      const hasEntries = this.bookData.data.codex.entries.some(entry => entry.category === categoryName);
      if (hasEntries) {
        if (!confirm(`Category "${categoryName}" has entries. Remove anyway? Entries will remain but be uncategorized.`)) {
          return false;
        }
      }

      this.bookData.data.codex.categories.splice(index, 1);
      this.onUpdate();
      return true;
    }
    return false;
  }

  // Add a new entry
  addEntry(name, category, description, tags = []) {
    if (!name || name.trim() === '') {
      return false;
    }

    const entry = {
      id: Date.now().toString(),
      name: name.trim(),
      category: category,
      description: description || '',
      tags: tags || [],
      createdAt: new Date().toISOString()
    };

    this.bookData.data.codex.entries.push(entry);
    this.onUpdate();
    return true;
  }

  // Update an entry
  updateEntry(id, updates) {
    const entry = this.bookData.data.codex.entries.find(e => e.id === id);
    if (entry) {
      Object.assign(entry, updates);
      this.onUpdate();
      return true;
    }
    return false;
  }

  // Delete an entry
  deleteEntry(id) {
    const index = this.bookData.data.codex.entries.findIndex(e => e.id === id);
    if (index > -1) {
      this.bookData.data.codex.entries.splice(index, 1);
      this.onUpdate();
      return true;
    }
    return false;
  }

  // Get entries by category
  getEntriesByCategory(category) {
    return this.bookData.data.codex.entries.filter(e => e.category === category);
  }

  // Filter entries by search term
  filterEntries(searchTerm) {
    this.searchFilter = searchTerm.toLowerCase();
    this.render();
  }

  // Toggle category collapse
  toggleCategory(category) {
    if (this.collapsedCategories.has(category)) {
      this.collapsedCategories.delete(category);
    } else {
      this.collapsedCategories.add(category);
    }
    this.render();
  }

  // Render the codex panel
  render() {
    const container = document.getElementById('codex-content');
    container.innerHTML = '';

    const categories = this.bookData.data.codex.categories;

    categories.forEach(category => {
      const entries = this.getEntriesByCategory(category);

      // Filter entries based on search
      const filteredEntries = this.searchFilter
        ? entries.filter(entry =>
            entry.name.toLowerCase().includes(this.searchFilter) ||
            entry.description.toLowerCase().includes(this.searchFilter)
          )
        : entries;

      // Skip categories with no entries (always, not just during search)
      if (filteredEntries.length === 0) {
        return;
      }

      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'codex-category';
      if (this.collapsedCategories.has(category)) {
        categoryDiv.classList.add('collapsed');
      }

      const header = document.createElement('div');
      header.className = 'codex-category-header';
      header.innerHTML = `
        <span class="codex-category-arrow">▼</span>
        <span>${category}</span>
        <span style="margin-left: auto; opacity: 0.6; font-size: 0.8em;">(${filteredEntries.length})</span>
      `;
      header.addEventListener('click', () => this.toggleCategory(category));

      const entriesDiv = document.createElement('div');
      entriesDiv.className = 'codex-category-entries';

      filteredEntries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'codex-entry';
        entryDiv.textContent = entry.name;
        entryDiv.title = entry.description || 'No description';
        entryDiv.addEventListener('click', () => this.openEntryDetails(entry));
        entriesDiv.appendChild(entryDiv);
      });

      categoryDiv.appendChild(header);
      categoryDiv.appendChild(entriesDiv);
      container.appendChild(categoryDiv);
    });
  }

  // Open entry details in side panel
  openEntryDetails(entry) {
    this.openEntryPanel(entry);
  }

  // Open entry panel for editing
  openEntryPanel(entry = null) {
    const panel = document.getElementById('codex-entry-panel');
    const panelTitle = document.getElementById('codex-entry-panel-title');
    const nameInput = document.getElementById('codex-entry-panel-name');
    const categorySelect = document.getElementById('codex-entry-panel-category');
    const descriptionTextarea = document.getElementById('codex-entry-panel-description');
    const deleteBtn = document.getElementById('codex-entry-panel-delete');

    // Set panel title
    if (entry) {
      panelTitle.textContent = 'Edit Entry';
      this.currentEntry = entry;
      this.isEditing = true;
    } else {
      panelTitle.textContent = 'Add New Entry';
      this.currentEntry = null;
      this.isEditing = false;
    }

    // Populate categories
    categorySelect.innerHTML = '';
    this.bookData.data.codex.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      if (entry && category === entry.category) {
        option.selected = true;
      }
      categorySelect.appendChild(option);
    });

    // Populate with entry data or clear
    if (entry) {
      nameInput.value = entry.name;
      descriptionTextarea.value = entry.description || '';
      this.currentEntryTags = [...(entry.tags || [])];
      deleteBtn.style.display = 'block';
    } else {
      nameInput.value = '';
      descriptionTextarea.value = '';
      this.currentEntryTags = [];
      deleteBtn.style.display = 'none';
    }

    // Render tags
    this.renderPanelEntryTags();

    // Show panel
    panel.classList.add('expanded');
  }

  // Close entry panel
  closeEntryPanel() {
    const panel = document.getElementById('codex-entry-panel');
    panel.classList.remove('expanded');
    this.currentEntry = null;
    this.isEditing = false;
  }

  // Render tags in codex entry panel
  renderPanelEntryTags() {
    const container = document.getElementById('codex-entry-panel-tags');
    container.innerHTML = '';

    // Render existing tags
    this.currentEntryTags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'section-info-tag removable';
      tagSpan.style.cssText = 'padding: 4px 8px; background: var(--bg-secondary); border-radius: 12px; font-size: 0.75em; cursor: pointer;';
      tagSpan.textContent = tag;
      tagSpan.onclick = () => {
        const index = this.currentEntryTags.indexOf(tag);
        if (index > -1) {
          this.currentEntryTags.splice(index, 1);
          this.renderPanelEntryTags();
        }
      };
      container.appendChild(tagSpan);
    });

    // Add tag input (free-form text)
    const addInput = document.createElement('input');
    addInput.type = 'text';
    addInput.className = 'tag-add-input';
    addInput.placeholder = '+ add tag';
    addInput.autocomplete = 'off';
    addInput.style.cssText = 'background: var(--bg-tertiary); border: 1px solid var(--border-primary); padding: 4px 8px; border-radius: 12px; font-size: 0.75em; width: 90px;';

    addInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const newTag = addInput.value.trim();

        if (newTag && !this.currentEntryTags.includes(newTag)) {
          this.currentEntryTags.push(newTag);
          this.renderPanelEntryTags();
        }
      }
    });

    container.appendChild(addInput);
  }

  // Open config panel
  openConfigPanel() {
    const panel = document.getElementById('codex-config-panel');
    panel.classList.add('expanded');
    this.renderCategoriesList();
  }

  // Close config panel
  closeConfigPanel() {
    const panel = document.getElementById('codex-config-panel');
    panel.classList.remove('expanded');
  }

  // Render categories list in config panel
  renderCategoriesList() {
    const list = document.getElementById('codex-categories-list');
    list.innerHTML = '';

    this.bookData.data.codex.categories.forEach(category => {
      const categoryItem = document.createElement('div');
      categoryItem.className = 'codex-category-item';

      const categoryName = document.createElement('span');
      categoryName.textContent = category;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'codex-category-delete-btn';
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => {
        if (this.removeCategory(category)) {
          this.renderCategoriesList();
          this.render();
        }
      });

      categoryItem.appendChild(categoryName);
      categoryItem.appendChild(deleteBtn);
      list.appendChild(categoryItem);
    });
  }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Codex;
}
