// Main Application - Novel Writer
// This is the main entry point that initializes and coordinates all modules

class NovelWriterApp {
  constructor() {
    // Initialize data model
    this.bookData = bookData; // From data.js

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
  }

  // Full render - renders UI and sets up all event listeners
  render() {
    // Render the UI
    this.renderer.render();

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
