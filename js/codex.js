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
  addEntry(name, category, description) {
    if (!name || name.trim() === '') {
      return false;
    }

    const entry = {
      id: Date.now().toString(),
      name: name.trim(),
      category: category,
      description: description || '',
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

      // Skip categories with no matching entries during search
      if (this.searchFilter && filteredEntries.length === 0) {
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

  // Open entry details (to be implemented with a modal or side panel)
  openEntryDetails(entry) {
    // For now, just show an alert with the entry details
    alert(`${entry.name}\n\nCategory: ${entry.category}\n\n${entry.description || 'No description'}`);
  }

  // Open add entry modal
  openAddEntryModal() {
    const modal = document.getElementById('codex-entry-modal');
    const categorySelect = document.getElementById('codex-entry-category');

    // Populate categories
    categorySelect.innerHTML = '';
    this.bookData.data.codex.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });

    // Clear inputs
    document.getElementById('codex-entry-name').value = '';
    document.getElementById('codex-entry-description').value = '';

    modal.style.display = 'flex';
  }

  // Open config modal
  openConfigModal() {
    const modal = document.getElementById('codex-config-modal');
    this.renderCategoriesList();
    modal.style.display = 'flex';
  }

  // Render categories list in config modal
  renderCategoriesList() {
    const list = document.getElementById('codex-categories-list');
    list.innerHTML = '';

    this.bookData.data.codex.categories.forEach(category => {
      const categoryItem = document.createElement('div');
      categoryItem.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; margin: 2px 0; background: white; border-radius: 4px;';

      const categoryName = document.createElement('span');
      categoryName.textContent = category;
      categoryName.style.flex = '1';

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️';
      deleteBtn.className = 'codex-btn';
      deleteBtn.style.cssText = 'flex: none; width: 30px; padding: 4px;';
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
