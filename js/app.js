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
    this.setupBreadcrumb();
    this.setupInfoPanel();
    this.filterManager.setup();
    this.updateMainTitle();
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
   * Update main title display (non-editable, only updated from Info panel)
   */
  updateMainTitle() {
    const bookTitleElement = document.getElementById('book-title');
    const title = this.bookData.data.title || 'Untitled Book';
    bookTitleElement.textContent = title;
  }

  /**
   * Setup language selector
   */
  setupLanguageSelector() {
    const languageSelect = document.getElementById('book-language');
    
    // Set current language
    const currentLanguage = this.bookData.getLanguage();
    languageSelect.value = currentLanguage;
    
    // Update LLM Manager language if available
    if (window.llmManager) {
      window.llmManager.setLanguage(currentLanguage);
    }
    
    // Handle language change
    languageSelect.addEventListener('change', async (e) => {
      const newLanguage = e.target.value;
      
      // Update book data
      this.bookData.setLanguage(newLanguage);
      
      // Update LLM Manager prompts
      if (window.llmManager) {
        await window.llmManager.setLanguage(newLanguage);
        console.log(`Language changed to: ${newLanguage}`);
        
        // Refresh AI panel if it's open
        if (window.aiPanelManager) {
          window.aiPanelManager.renderPrompts();
        }
      }
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
   * Setup breadcrumb navigation
   */
  setupBreadcrumb() {
    const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
    
    breadcrumbItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.navigateToSection(section);
      });
    });
    
    // Set initial active state
    this.updateBreadcrumb('structure');
  }

  /**
   * Update breadcrumb active state
   * @param {string} section - Section to highlight
   */
  updateBreadcrumb(section) {
    const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
    breadcrumbItems.forEach(item => {
      if (item.dataset.section === section) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * Navigate to different sections of the application
   * @param {string} section - Section to navigate to
   */
  navigateToSection(section) {
    console.log(`Navigating to section: ${section}`);
    
    // Update breadcrumb highlight
    this.updateBreadcrumb(section);
    
    // Hide all panels first
    const allPanels = document.querySelectorAll('.app-panel');
    allPanels.forEach(panel => panel.classList.remove('active'));
    
    // Show the selected panel
    const sectionMap = {
      'info': 'info-panel',
      'structure': 'structure-panel',
      'writer': 'writer-panel',
      'ia': 'ai-panel',
      'publish': 'publisher-panel'
    };
    
    const panelId = sectionMap[section];
    if (panelId) {
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('active');
        
        // Special actions for specific panels
        if (section === 'info') {
          this.updateInfoPanelData();
        } else if (section === 'structure') {
          this.update();
        }
      }
    } else {
      console.warn(`Unknown section: ${section}`);
    }
  }

  /**
   * Update info panel data
   */
  updateInfoPanelData() {
    const bookTitle = this.bookData.data.title || 'Untitled Book';
    document.getElementById('info-book-title').textContent = bookTitle;
    document.getElementById('info-modified').textContent = new Date().toLocaleDateString();
    this.loadInfoData();
    this.updateInfoStats();
  }

  /**
   * Setup info panel
   */
  setupInfoPanel() {
    // Setup editable fields
    const titleField = document.getElementById('info-title');
    const subtitleField = document.getElementById('info-subtitle');
    const authorField = document.getElementById('info-author');
    const genreField = document.getElementById('info-genre');
    const languageSelector = document.getElementById('info-language-selector');
    const createdField = document.getElementById('info-created');
    const synopsisField = document.getElementById('info-synopsis');
    const notesField = document.getElementById('info-notes');

    // Load data from localStorage or bookData
    this.loadInfoData();

    // Save on change
    [titleField, subtitleField, authorField, genreField, createdField, synopsisField, notesField].forEach(field => {
      field.addEventListener('change', () => this.saveInfoData());
      field.addEventListener('blur', () => this.saveInfoData());
    });

    // Update info-book-title when title field changes
    titleField.addEventListener('input', () => {
      const newTitle = titleField.value.trim() || 'Untitled Book';
      document.getElementById('info-book-title').textContent = newTitle;
    });

    // Language selector
    languageSelector.addEventListener('change', async () => {
      const newLanguage = languageSelector.value;
      await this.bookData.setLanguage(newLanguage);
      this.saveInfoData();
      // Update UI
      this.update();
    });
  }

  /**
   * Load info panel data
   */
  loadInfoData() {
    const data = JSON.parse(localStorage.getItem('bookInfo') || '{}');
    
    document.getElementById('info-title').value = data.title || this.bookData.data.title || '';
    document.getElementById('info-subtitle').value = data.subtitle || '';
    document.getElementById('info-author').value = data.author || '';
    document.getElementById('info-genre').value = data.genre || '';
    document.getElementById('info-language-selector').value = this.bookData.getLanguage();
    document.getElementById('info-created').value = data.created || '';
    document.getElementById('info-synopsis').value = data.synopsis || '';
    document.getElementById('info-notes').value = data.notes || '';
  }

  /**
   * Save info panel data
   */
  saveInfoData() {
    const newTitle = document.getElementById('info-title').value.trim();
    const data = {
      title: newTitle,
      subtitle: document.getElementById('info-subtitle').value,
      author: document.getElementById('info-author').value,
      genre: document.getElementById('info-genre').value,
      created: document.getElementById('info-created').value,
      synopsis: document.getElementById('info-synopsis').value,
      notes: document.getElementById('info-notes').value
    };
    
    localStorage.setItem('bookInfo', JSON.stringify(data));
    
    // Always update book title in main data
    if (newTitle) {
      this.bookData.data.title = newTitle;
      this.bookData.save();
      // Update main title display
      this.updateMainTitle();
    }
  }

  /**
   * Open info panel (deprecated - use navigateToSection('info'))
   */
  openInfoPanel() {
    this.navigateToSection('info');
  }

  /**
   * Close info panel (deprecated - use navigateToSection('structure'))
   */
  closeInfoPanel() {
    // No longer needed - panels close automatically when switching
  }

  /**
   * Update info panel statistics
   */
  updateInfoStats() {
    const acts = this.bookData.data.acts || [];
    let chapters = 0;
    let sections = 0;
    let words = 0;

    acts.forEach(act => {
      if (act.chapters) {
        chapters += act.chapters.length;
        act.chapters.forEach(chapter => {
          if (chapter.sections) {
            sections += chapter.sections.length;
            chapter.sections.forEach(section => {
              if (section.content) {
                words += section.content.split(/\s+/).filter(w => w.length > 0).length;
              }
            });
          }
        });
      }
    });

    const codexEntries = (this.bookData.data.codex?.entries || []).length;

    document.getElementById('stat-acts').textContent = acts.length;
    document.getElementById('stat-chapters').textContent = chapters;
    document.getElementById('stat-sections').textContent = sections;
    document.getElementById('stat-words').textContent = words.toLocaleString();
    document.getElementById('stat-characters').textContent = codexEntries;
    document.getElementById('stat-codex').textContent = codexEntries;
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
