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
      this.codex.openAddEntryModal();
    });

    // Config button
    document.getElementById('codex-config-btn').addEventListener('click', () => {
      this.codex.openConfigModal();
    });

    // Add entry modal events
    document.getElementById('codex-entry-cancel').addEventListener('click', () => {
      document.getElementById('codex-entry-modal').style.display = 'none';
    });

    document.getElementById('codex-entry-save').addEventListener('click', () => {
      const name = document.getElementById('codex-entry-name').value;
      const category = document.getElementById('codex-entry-category').value;
      const description = document.getElementById('codex-entry-description').value;
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

      document.getElementById('codex-entry-modal').style.display = 'none';
      this.update();
    });

    document.getElementById('codex-entry-delete').addEventListener('click', () => {
      if (this.codex.currentEntry) {
        if (confirm(`Are you sure you want to delete "${this.codex.currentEntry.name}"?`)) {
          this.codex.deleteEntry(this.codex.currentEntry.id);
          document.getElementById('codex-entry-modal').style.display = 'none';
          this.update();
        }
      }
    });

    // Config modal events
    document.getElementById('codex-config-close').addEventListener('click', () => {
      document.getElementById('codex-config-modal').style.display = 'none';
    });

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

    // Close modals on overlay click
    document.getElementById('codex-entry-modal').addEventListener('click', (e) => {
      if (e.target.id === 'codex-entry-modal') {
        document.getElementById('codex-entry-modal').style.display = 'none';
      }
    });

    document.getElementById('codex-config-modal').addEventListener('click', (e) => {
      if (e.target.id === 'codex-config-modal') {
        document.getElementById('codex-config-modal').style.display = 'none';
      }
    });
  }

  // Update function - re-renders everything after data changes
  update() {
    this.render();
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new NovelWriterApp();
  app.init();
});
