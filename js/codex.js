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
    const leftContainer = document.getElementById('codex-content');
    const mainList = document.getElementById('codex-main-list');
    const targets = [leftContainer, mainList].filter(Boolean);

    // Clear both targets
    targets.forEach(t => t.innerHTML = '');

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

      // For each render target create nodes (so event listeners are attached)
      targets.forEach(target => {
        // If this is the main codex list, render a grid of tiles
        if (target.id === 'codex-main-list') {
          const sectionWrap = document.createElement('div');
          // grid container will host the tiles centered
          const gridContainer = document.createElement('div');
          gridContainer.className = 'codex-grid-container';

          // category title (full width)
          const titleRow = document.createElement('div');
          titleRow.className = 'codex-category-title';
          titleRow.innerHTML = `<strong>${category}</strong><span style="opacity:0.6; font-size:0.9em; margin-left:8px;">(${filteredEntries.length})</span>`;
          gridContainer.appendChild(titleRow);

          // (types pills removed — simplified single-column magazine layout)

          // For each entry, create a tile and append directly to gridContainer (grid handles columns)
          filteredEntries.forEach(entry => {
            const tile = document.createElement('div');
            tile.className = 'codex-entry-tile';
            tile.setAttribute('data-entry-id', entry.id);
            tile.addEventListener('click', () => this.openEntryDetails(entry));

            // image
            if (entry.image) {
              const img = document.createElement('img');
              img.className = 'codex-entry-image';
              img.src = entry.image;
              img.alt = entry.name;
              tile.appendChild(img);
            } else {
              const imgPlaceholder = document.createElement('div');
              imgPlaceholder.className = 'codex-entry-image';
              tile.appendChild(imgPlaceholder);
            }

            // category tag element removed (redundant)

            const nameEl = document.createElement('div');
            nameEl.className = 'codex-entry-name';
            nameEl.textContent = entry.name;
            tile.appendChild(nameEl);

            const descEl = document.createElement('div');
            descEl.className = 'codex-entry-desc';
            descEl.textContent = (entry.description || '').slice(0, 260);
            tile.appendChild(descEl);

            // Tags editor (similar to Structure panel tags)
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'codex-entry-tags section-info-tags';

            // Ensure entry.tags exists
            if (!entry.tags) entry.tags = [];

            const renderTags = () => {
              tagsContainer.innerHTML = '';

              entry.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'section-info-tag removable';
                tagSpan.textContent = tag;
                tagSpan.onclick = (e) => {
                  e.stopPropagation();
                  const idx = entry.tags.indexOf(tag);
                  if (idx > -1) {
                    entry.tags.splice(idx, 1);
                    try { this.bookData.save(); } catch (err) {}
                    this.onUpdate();
                    renderTags();
                  }
                };
                tagsContainer.appendChild(tagSpan);
              });

              // Add input wrapper
              const addWrapper = document.createElement('div');
              addWrapper.style.position = 'relative';
              addWrapper.style.display = 'inline-block';

              const addInput = document.createElement('input');
              addInput.type = 'text';
              addInput.className = 'tag-add-input';
              addInput.placeholder = '+ add tag';
              addInput.autocomplete = 'off';

              const dropdown = document.createElement('div');
              dropdown.className = 'tag-dropdown';
              dropdown.style.display = 'none';

              const getCodexEntries = () => {
                if (!this.bookData.data.codex || !this.bookData.data.codex.entries) return [];
                const entryNames = this.bookData.data.codex.entries.map(e => e.name);
                const allTags = new Set();
                this.bookData.data.codex.entries.forEach(e => {
                  if (e.tags && Array.isArray(e.tags)) e.tags.forEach(t => allTags.add(t));
                });
                const combined = [...new Set([...entryNames, ...Array.from(allTags)])];
                return combined.sort();
              };

              const updateDropdown = (filter = '') => {
                const entries = getCodexEntries();
                const filtered = filter
                  ? entries.filter(name => name.toLowerCase().includes(filter.toLowerCase()) && !entry.tags.includes(name))
                  : entries.filter(name => !entry.tags.includes(name));

                dropdown.innerHTML = '';
                if (filtered.length === 0) { dropdown.style.display = 'none'; return; }

                filtered.forEach(name => {
                  const option = document.createElement('div');
                  option.className = 'tag-dropdown-option';
                  option.textContent = name;
                  option.onclick = (ev) => { ev.stopPropagation(); addTag(name); };
                  dropdown.appendChild(option);
                });
                dropdown.style.display = 'block';
              };

              const addTag = (name) => {
                if (!name || name.trim() === '') return;
                const tagName = name.trim();
                if (!entry.tags.includes(tagName)) {
                  entry.tags.push(tagName);
                  try { this.bookData.save(); } catch (err) {}
                  this.onUpdate();
                  addInput.value = '';
                  updateDropdown('');
                  renderTags();
                }
              };

              addInput.addEventListener('focus', () => updateDropdown(addInput.value));
              addInput.addEventListener('input', (e) => updateDropdown(e.target.value));
              addInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const newTag = addInput.value.trim();
                  const entries = getCodexEntries();
                  if (newTag && entries.includes(newTag) && !entry.tags.includes(newTag)) {
                    addTag(newTag);
                  } else if (newTag && !entries.includes(newTag)) {
                    alert('Tag must be a codex entry or existing tag. Add it to the codex first.');
                  }
                } else if (e.key === 'Escape') {
                  dropdown.style.display = 'none';
                  addInput.blur();
                }
              });

              addInput.addEventListener('blur', () => {
                setTimeout(() => { dropdown.style.display = 'none'; }, 200);
              });

              addWrapper.appendChild(addInput);
              addWrapper.appendChild(dropdown);
              addWrapper.addEventListener('click', (ev) => ev.stopPropagation());
              tagsContainer.appendChild(addWrapper);
            };

            renderTags();
            tile.appendChild(tagsContainer);

            // mark data-category on a sentinel div to allow scrolling by pill
            tile.setAttribute('data-category', category);

            gridContainer.appendChild(tile);
          });

          // Add "+" tile to allow creating a new entry in this category
          const addTile = document.createElement('div');
          addTile.className = 'codex-entry-add';
          addTile.setAttribute('data-category', category);
          addTile.innerHTML = '<div class="codex-entry-add-inner">+<div class="codex-entry-add-label">Add</div></div>';
          addTile.addEventListener('click', (ev) => {
            ev.stopPropagation();
            // open new entry panel and preselect this category
            this.openEntryPanel(null);
            // ensure category select is set after panel is populated
            setTimeout(() => {
              const sel = document.getElementById('codex-entry-panel-category');
              if (sel) sel.value = category;
            }, 50);
          });
          gridContainer.appendChild(addTile);

          // separator (visual) after category
          const sep = document.createElement('div');
          sep.style.gridColumn = '1 / -1';
          sep.style.borderTop = '1px solid var(--border-light)';
          sep.style.margin = '20px 0';
          gridContainer.appendChild(sep);

          sectionWrap.appendChild(gridContainer);
          // horizontal separator
          const hr = document.createElement('hr');
          hr.style.border = 'none';
          hr.style.borderTop = '1px solid var(--border-light)';
          hr.style.margin = '18px 0';
          sectionWrap.appendChild(hr);

          target.appendChild(sectionWrap);
        } else {
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
            entryDiv.setAttribute('data-entry-id', entry.id);
            entryDiv.addEventListener('click', () => this.openEntryDetails(entry));
            entriesDiv.appendChild(entryDiv);
          });

          categoryDiv.appendChild(header);
          categoryDiv.appendChild(entriesDiv);

          target.appendChild(categoryDiv);
        }
      });
    });
  }

  // Open entry details in side panel
  openEntryDetails(entry) {
    this.openEntryPanel(entry);

    // Mark active tile in main list (if present)
    const tiles = document.querySelectorAll('#codex-main-list .codex-entry-tile');
    tiles.forEach(el => {
      if (el.getAttribute('data-entry-id') === entry.id) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
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
