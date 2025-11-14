/**
 * NovelWriterApp - Main Application Controller
 *
 * Coordinates all modules and manages the application lifecycle.
 * Responsibilities:
 * - Initialize and coordinate all sub-modules (codex, filter, renderer, etc.)
 * - Handle book title editing
 * - Setup codex event handlers
 * - Manage application state updates
 */
class NovelWriterApp {
  constructor() {
    // Data Model
    this.bookData = bookData;

    // Core Modules
    this.codex = new Codex(this.bookData, () => this.update());
    this.filterManager = new FilterManager(this.bookData, () => this.update());
    this.renderer = new UIRenderer(this.bookData);

    // UI Components
    this.modalManager = new ModalManager();
    this.chapterPropertiesModal = new ChapterPropertiesModal(
      this.bookData,
      () => this.update()
    );

    // Editors
    this.inlineEditor = new InlineEditor(this.bookData, () => this.update());
    this.sectionEditor = new SectionEditor(this.bookData, () => this.update());

    // Interaction Managers
    this.dragDropManager = new DragDropManager(
      this.bookData,
      () => this.update()
    );
    this.eventHandlers = new EventHandlers(
      this.bookData,
      this.modalManager,
      this.chapterPropertiesModal,
      this.sectionEditor,
      () => this.update()
    );

    // Make filterManager globally accessible for codex integration
    window.filterManager = this.filterManager;
  }

  /**
   * Initialize application - render and setup all event handlers
   */
  init() {
    this.render();
    this.setupCodexEvents();
    this.setupBookTitleEditing();
    this.filterManager.setup();
  }

  /**
   * Render complete UI and setup interactions
   */
  render() {
    this.renderer.render();
    this.codex.render();
    this.setupInteractions();
  }

  /**
   * Setup all interactive features (drag-drop, editors, etc.)
   */
  setupInteractions() {
    this.dragDropManager.setup();
    this.inlineEditor.setupChapterTitleEditing();
    this.inlineEditor.setupActTitleEditing();
    this.sectionEditor.setup();
    this.eventHandlers.setup();
    this.dragDropManager.animateMovedCards();
  }

  /**
   * Setup book title editing (double-click to edit)
   */
  setupBookTitleEditing() {
    const bookTitleElement = document.getElementById('book-title');
    bookTitleElement.textContent = this.bookData.data.title || '📚 Book Structure';

    bookTitleElement.addEventListener('dblclick', (e) => {
      e.stopPropagation();

      const currentTitle = this.bookData.data.title || 'My Novel';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentTitle;
      input.className = 'book-title-input';

      bookTitleElement.style.display = 'none';
      bookTitleElement.parentElement.insertBefore(input, bookTitleElement);
      input.focus();
      input.select();

      const finishEditing = () => {
        const newTitle = input.value.trim();
        if (newTitle && newTitle !== currentTitle) {
          this.bookData.data.title = newTitle;
          bookTitleElement.textContent = `📚 ${newTitle}`;
        }
        input.remove();
        bookTitleElement.style.display = '';
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          finishEditing();
        } else if (e.key === 'Escape') {
          input.remove();
          bookTitleElement.style.display = '';
        }
      });

      input.addEventListener('blur', () => {
        setTimeout(finishEditing, 100);
      });
    });
  }

  /**
   * Setup codex event handlers
   */
  setupCodexEvents() {
    // Search functionality
    document.getElementById('codex-search').addEventListener('input', (e) => {
      this.codex.filterEntries(e.target.value);
    });

    // Panel controls
    document.getElementById('codex-add-btn').addEventListener('click', () => {
      this.codex.openEntryPanel();
    });

    document.getElementById('codex-config-btn').addEventListener('click', () => {
      this.codex.openConfigPanel();
    });

    document.getElementById('codex-config-collapse').addEventListener('click', () => {
      this.codex.closeConfigPanel();
    });

    document.getElementById('codex-entry-collapse').addEventListener('click', () => {
      this.codex.closeEntryPanel();
    });

    document.getElementById('codex-entry-panel-cancel').addEventListener('click', () => {
      this.codex.closeEntryPanel();
    });

    // Find button - integrates with filter system
    document.getElementById('codex-entry-panel-find').addEventListener('click', () => {
      const name = document.getElementById('codex-entry-panel-name').value;

      if (name && name.trim() !== '') {
        this.filterManager.addFilterTag(name.trim());
        const filterTagInput = document.getElementById('filter-tag-input');
        if (filterTagInput) {
          filterTagInput.focus();
        }
        this.codex.closeEntryPanel();
      } else {
        alert('Please enter an entry name to find');
      }
    });

    // Save entry
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
        this.codex.updateEntry(this.codex.currentEntry.id, {
          name: name.trim(),
          category: category,
          description: description,
          tags: tags
        });
      } else {
        this.codex.addEntry(name, category, description, tags);
      }

      this.codex.closeEntryPanel();
      this.update();
    });

    // Delete entry
    document.getElementById('codex-entry-panel-delete').addEventListener('click', () => {
      if (this.codex.currentEntry) {
        if (confirm(`Are you sure you want to delete "${this.codex.currentEntry.name}"?`)) {
          this.codex.deleteEntry(this.codex.currentEntry.id);
          this.codex.closeEntryPanel();
          this.update();
        }
      }
    });

    // Category management
    document.getElementById('codex-add-category').addEventListener('click', () => {
      const categoryName = document.getElementById('codex-new-category').value;
      if (this.codex.addCategory(categoryName)) {
        document.getElementById('codex-new-category').value = '';
        this.codex.renderCategoriesList();
        this.update();
      }
    });

    document.getElementById('codex-new-category').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        document.getElementById('codex-add-category').click();
      }
    });
  }

  /**
   * Update application state - re-render and refresh filter
   */
  update() {
    this.render();
    if (this.filterManager) {
      this.filterManager.refresh();
    }
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new NovelWriterApp();
  app.init();
});
