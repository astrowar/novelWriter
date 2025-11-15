/**
 * FilterManager - Tag-based filtering system
 *
 * Manages tag-based filtering of chapters and sections with autocomplete.
 * Features:
 * - Autocomplete dropdown for available tags
 * - Multiple tag selection with AND logic
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Visual feedback with selected tag badges
 * - Integration with codex system
 */
class FilterManager {
  constructor(bookData, onUpdate) {
    this.bookData = bookData;
    this.onUpdate = onUpdate;
    this.activeFilterTags = new Set();
    this.allAvailableTags = [];
    this.autocompleteSelectedIndex = -1;
  }

  // Initialize filter events
  setup() {
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
      this.clearAllFilters();
    });

    // Tag input - autocomplete
    filterTagInput.addEventListener('input', (e) => {
      this.handleInputChange(e);
    });

    // Tag input - keyboard navigation
    filterTagInput.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
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

  // Handle input change for autocomplete
  handleInputChange(e) {
    const filterAutocomplete = document.getElementById('filter-autocomplete');
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
  }

  // Handle keyboard navigation in autocomplete
  handleKeyboardNavigation(e) {
    const filterAutocomplete = document.getElementById('filter-autocomplete');
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

  // Clear all filters
  clearAllFilters() {
    this.activeFilterTags.clear();
    this.applyFilter();
    this.updateFilterUI();
    const filterTagInput = document.getElementById('filter-tag-input');
    const filterAutocomplete = document.getElementById('filter-autocomplete');
    filterTagInput.value = '';
    filterAutocomplete.style.display = 'none';
  }

  // Update filter UI
  updateFilterUI() {
    const filterSelectedTags = document.getElementById('filter-selected-tags');
    const filterClearBtn = document.getElementById('filter-clear-btn');

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
      const chapterCards = actSection.querySelectorAll('.chapter-section');

      chapterCards.forEach((chapterCard) => {
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

  // Reapply filter after data changes
  refresh() {
    this.loadAvailableTags();
    if (this.activeFilterTags.size > 0) {
      this.applyFilter();
    }
  }
}
