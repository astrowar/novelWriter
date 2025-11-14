// Main Application - Novel Writer
// This is the main entry point that initializes and coordinates all modules

class NovelWriterApp {
  constructor() {
    // Initialize data model
    this.bookData = bookData; // From data.js

    // Initialize codex
    this.codex = new Codex(this.bookData, () => this.update());

    // Initialize UI renderer
    this.renderer = new UIRenderer(this.bookData);

    // Initialize modals
    this.modalManager = new ModalManager();
    this.chapterPropertiesModal = new ChapterPropertiesModal(
      this.bookData,
      () => this.update()
    );

    // Initialize editors
    this.inlineEditor = new InlineEditor(this.bookData, () => this.update());
    this.sectionEditor = new SectionEditor(this.bookData, () => this.update());

    // Initialize drag and drop
    this.dragDropManager = new DragDropManager(
      this.bookData,
      () => this.update()
    );

    // Initialize event handlers
    this.eventHandlers = new EventHandlers(
      this.bookData,
      this.modalManager,
      this.chapterPropertiesModal,
      this.sectionEditor,
      () => this.update()
    );
  }

  // Initial render and setup
  init() {
    this.render();
    this.setupCodexEvents();
    this.setupBookTitleEditing();
    this.setupFilterEvents();
  }

  // Full render - renders UI and sets up all event listeners
  render() {
    // Render the UI
    this.renderer.render();

    // Render codex
    this.codex.render();

    // Setup all interactions
    this.setupInteractions();
  }

  // Setup all interactive features
  setupInteractions() {
    this.dragDropManager.setup();
    this.inlineEditor.setupChapterTitleEditing();
    this.inlineEditor.setupActTitleEditing();
    this.sectionEditor.setup();
    this.eventHandlers.setup();

    // Animate moved cards after re-render using FLIP technique
    this.dragDropManager.animateMovedCards();
  }

  // Setup book title editing
  setupBookTitleEditing() {
    const bookTitleElement = document.getElementById('book-title');

    // Set initial title from data
    bookTitleElement.textContent = this.bookData.data.title || '📚 Book Structure';

    bookTitleElement.addEventListener('dblclick', (e) => {
      e.stopPropagation();

      const currentTitle = this.bookData.data.title || 'My Novel';
      const displayText = bookTitleElement.textContent;

      // Create input element
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentTitle;
      input.className = 'book-title-input';

      // Replace title with input
      bookTitleElement.style.display = 'none';
      bookTitleElement.parentElement.insertBefore(input, bookTitleElement);
      input.focus();
      input.select();

      // Function to finish editing
      const finishEditing = () => {
        const newTitle = input.value.trim();

        if (newTitle && newTitle !== currentTitle) {
          // Update the book title in data
          this.bookData.data.title = newTitle;
          bookTitleElement.textContent = `📚 ${newTitle}`;
        }

        // Remove input and show title again
        input.remove();
        bookTitleElement.style.display = '';
      };

      // Handle Enter key
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          finishEditing();
        } else if (e.key === 'Escape') {
          input.remove();
          bookTitleElement.style.display = '';
        }
      });

      // Handle blur (clicking outside)
      input.addEventListener('blur', () => {
        setTimeout(finishEditing, 100);
      });
    });
  }

  // Setup codex-specific events
  setupCodexEvents() {
    // Search filter
    const searchInput = document.getElementById('codex-search');
    searchInput.addEventListener('input', (e) => {
      this.codex.filterEntries(e.target.value);
    });

    // Add entry button
    document.getElementById('codex-add-btn').addEventListener('click', () => {
      this.codex.openEntryPanel();
    });

    // Config button
    document.getElementById('codex-config-btn').addEventListener('click', () => {
      this.codex.openConfigPanel();
    });

    // Config panel collapse button
    document.getElementById('codex-config-collapse').addEventListener('click', () => {
      this.codex.closeConfigPanel();
    });

    // Entry panel collapse button
    document.getElementById('codex-entry-collapse').addEventListener('click', () => {
      this.codex.closeEntryPanel();
    });

    // Entry panel cancel button
    document.getElementById('codex-entry-panel-cancel').addEventListener('click', () => {
      this.codex.closeEntryPanel();
    });

    // Entry panel find button
    document.getElementById('codex-entry-panel-find').addEventListener('click', () => {
      const name = document.getElementById('codex-entry-panel-name').value;

      if (name && name.trim() !== '') {
        // Add the entry name as a filter tag
        this.addFilterTag(name.trim());

        // Focus the filter input
        const filterTagInput = document.getElementById('filter-tag-input');
        if (filterTagInput) {
          filterTagInput.focus();
        }

        // Close the codex entry panel
        this.codex.closeEntryPanel();
      } else {
        alert('Please enter an entry name to find');
      }
    });

    // Entry panel save button
    document.getElementById('codex-entry-panel-save').addEventListener('click', () => {
      const name = document.getElementById('codex-entry-panel-name').value;
      const category = document.getElementById('codex-entry-panel-category').value;
      const description = document.getElementById('codex-entry-panel-description').value;
      const tags = this.codex.currentEntryTags || [];

      if (!name || name.trim() === '') {
        alert('Please enter an entry name');
        return;
      }

      if (this.codex.isEditing && this.codex.currentEntry) {
        // Update existing entry
        this.codex.updateEntry(this.codex.currentEntry.id, {
          name: name.trim(),
          category: category,
          description: description,
          tags: tags
        });
      } else {
        // Add new entry
        this.codex.addEntry(name, category, description, tags);
      }

      this.codex.closeEntryPanel();
      this.update();
    });

    // Entry panel delete button
    document.getElementById('codex-entry-panel-delete').addEventListener('click', () => {
      if (this.codex.currentEntry) {
        if (confirm(`Are you sure you want to delete "${this.codex.currentEntry.name}"?`)) {
          this.codex.deleteEntry(this.codex.currentEntry.id);
          this.codex.closeEntryPanel();
          this.update();
        }
      }
    });

    // Config panel events
    document.getElementById('codex-add-category').addEventListener('click', () => {
      const categoryName = document.getElementById('codex-new-category').value;
      if (this.codex.addCategory(categoryName)) {
        document.getElementById('codex-new-category').value = '';
        this.codex.renderCategoriesList();
        this.update();
      }
    });

    // Allow Enter key to add category
    document.getElementById('codex-new-category').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('codex-add-category').click();
      }
    });
  }

  // Setup filter events
  setupFilterEvents() {
    this.activeFilterTags = new Set();
    this.allAvailableTags = [];
    this.autocompleteSelectedIndex = -1;

    const filterClearBtn = document.getElementById('filter-clear-btn');
    const filterTagInput = document.getElementById('filter-tag-input');
    const filterAutocomplete = document.getElementById('filter-autocomplete');
    const filterSelectedTags = document.getElementById('filter-selected-tags');

    if (!filterTagInput) {
      console.error('Filter input not found!');
      return;
    }

    // Load all available tags
    this.loadAvailableTags();

    // Clear all filters
    filterClearBtn.addEventListener('click', () => {
      this.activeFilterTags.clear();
      this.applyFilter();
      this.updateFilterUI();
      filterTagInput.value = '';
      filterAutocomplete.style.display = 'none';
    });

    // Tag input - autocomplete
    filterTagInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();

      if (query.length === 0) {
        filterAutocomplete.style.display = 'none';
        return;
      }

      const matches = this.allAvailableTags.filter(tag =>
        tag.toLowerCase().includes(query) && !this.activeFilterTags.has(tag)
      );

      if (matches.length === 0) {
        filterAutocomplete.style.display = 'none';
        return;
      }

      this.showAutocomplete(matches);
    });

    // Tag input - keyboard navigation
    filterTagInput.addEventListener('keydown', (e) => {
      const items = filterAutocomplete.querySelectorAll('.filter-autocomplete-item');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.autocompleteSelectedIndex = Math.min(this.autocompleteSelectedIndex + 1, items.length - 1);
        this.highlightAutocompleteItem(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.autocompleteSelectedIndex = Math.max(this.autocompleteSelectedIndex - 1, -1);
        this.highlightAutocompleteItem(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.autocompleteSelectedIndex >= 0 && items[this.autocompleteSelectedIndex]) {
          const tagName = items[this.autocompleteSelectedIndex].dataset.tag;
          this.addFilterTag(tagName);
        }
      } else if (e.key === 'Escape') {
        filterAutocomplete.style.display = 'none';
        this.autocompleteSelectedIndex = -1;
      }
    });

    // Click outside to close autocomplete
    document.addEventListener('click', (e) => {
      if (!filterTagInput.contains(e.target) && !filterAutocomplete.contains(e.target)) {
        filterAutocomplete.style.display = 'none';
        this.autocompleteSelectedIndex = -1;
      }
    });
  }

  // Load all available tags from codex
  loadAvailableTags() {
    const allTags = new Set();

    // Collect all tags from codex entries
    const codexEntries = this.bookData.data.codex?.entries || [];
    codexEntries.forEach(entry => {
      // Add entry name as a tag
      allTags.add(entry.name);

      // Add all tags from the entry
      if (entry.tags && entry.tags.length > 0) {
        entry.tags.forEach(tag => allTags.add(tag));
      }
    });

    // Sort tags alphabetically
    this.allAvailableTags = Array.from(allTags).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }

  // Show autocomplete dropdown
  showAutocomplete(matches) {
    const filterAutocomplete = document.getElementById('filter-autocomplete');

    filterAutocomplete.innerHTML = '';
    this.autocompleteSelectedIndex = -1;

    matches.forEach((tag, index) => {
      const item = document.createElement('div');
      item.className = 'filter-autocomplete-item';
      item.dataset.tag = tag;
      item.textContent = tag;

      item.addEventListener('click', () => {
        this.addFilterTag(tag);
      });

      filterAutocomplete.appendChild(item);
    });

    filterAutocomplete.style.display = 'block';
  }

  // Highlight autocomplete item
  highlightAutocompleteItem(items) {
    items.forEach((item, index) => {
      if (index === this.autocompleteSelectedIndex) {
        item.classList.add('highlighted');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('highlighted');
      }
    });
  }

  // Add a filter tag
  addFilterTag(tagName) {
    if (this.activeFilterTags.has(tagName)) return;

    this.activeFilterTags.add(tagName);

    // Keep the tag in input and hide autocomplete
    const filterTagInput = document.getElementById('filter-tag-input');
    const filterAutocomplete = document.getElementById('filter-autocomplete');
    filterTagInput.value = tagName;
    filterAutocomplete.style.display = 'none';
    this.autocompleteSelectedIndex = -1;

    // Select the text so user can easily type a new tag
    filterTagInput.select();

    // Update UI and apply filter
    this.updateFilterUI();
    this.applyFilter();
  }

  // Remove a filter tag
  removeFilterTag(tagName) {
    this.activeFilterTags.delete(tagName);
    this.updateFilterUI();
    this.applyFilter();
  }

  // Update filter UI
  updateFilterUI() {
    const filterSelectedTags = document.getElementById('filter-selected-tags');
    const filterToggleBtn = document.getElementById('filter-toggle-btn');

    // Clear selected tags container
    filterSelectedTags.innerHTML = '';

    // Render selected tags
    this.activeFilterTags.forEach(tagName => {
      const tagElement = document.createElement('div');
      tagElement.className = 'filter-selected-tag';

      const tagText = document.createElement('span');
      tagText.textContent = tagName;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'filter-selected-tag-remove';
      removeBtn.textContent = '×';
      removeBtn.title = 'Remove tag';
      removeBtn.addEventListener('click', () => {
        this.removeFilterTag(tagName);
      });

      tagElement.appendChild(tagText);
      tagElement.appendChild(removeBtn);
      filterSelectedTags.appendChild(tagElement);
    });

    // Show/hide clear button and selected tags container
    const filterClearBtn = document.getElementById('filter-clear-btn');
    if (this.activeFilterTags.size > 0) {
      filterClearBtn.style.display = 'flex';
      filterSelectedTags.style.display = 'flex';
    } else {
      filterClearBtn.style.display = 'none';
      filterSelectedTags.style.display = 'none';
    }
  }

  // Apply filter to cards and sections
  applyFilter() {
    const acts = document.querySelectorAll('.act-section');

    acts.forEach((actSection, actIndex) => {
      const act = this.bookData.data.acts[actIndex];

      if (!act) return; // Safety check

      let actHasVisibleChapters = false;
      const chapterCards = actSection.querySelectorAll('.chapter-card');

      chapterCards.forEach((chapterCard, chapterIndex) => {
        const chapterId = parseInt(chapterCard.dataset.chapterId);
        const chapter = act.chapters?.find(ch => ch.id === chapterId);

        if (!chapter) return; // Safety check

        if (this.activeFilterTags.size === 0) {
          // No filter active - show everything
          chapterCard.classList.remove('filtered-hidden');
          actHasVisibleChapters = true;
        } else {
          // Check if chapter has any sections matching ALL selected tags (AND logic)
          const hasMatchingSections = chapter.sections?.some(section => {
            if (!section.tags || section.tags.length === 0) return false;

            // Section must have ALL selected tags
            return Array.from(this.activeFilterTags).every(filterTag =>
              section.tags.includes(filterTag)
            );
          });

          if (hasMatchingSections) {
            chapterCard.classList.remove('filtered-hidden');
            actHasVisibleChapters = true;
          } else {
            chapterCard.classList.add('filtered-hidden');
          }
        }
      });

      // Hide act if no chapters are visible
      if (actHasVisibleChapters) {
        actSection.classList.remove('filtered-hidden');
      } else {
        actSection.classList.add('filtered-hidden');
      }
    });
  }

  // Update function - re-renders everything after data changes
  update() {
    this.render();
    // Reapply filter after render
    if (this.activeFilterTags && this.activeFilterTags.size > 0) {
      this.applyFilter();
    }
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new NovelWriterApp();
  app.init();
});
