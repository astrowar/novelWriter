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
