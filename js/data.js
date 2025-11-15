/**
 * BookData - Data management class
 *
 * Manages book data loaded from external JSON file.
 * Provides methods for CRUD operations on acts, chapters, and sections.
 */
class BookData {
  constructor() {
    this.data = null;
    this.dataFile = './data/book-data.json';
  }

  /**
   * Load book data from JSON file
   */
  async loadData() {
    try {
      const response = await fetch(this.dataFile);
      this.data = await response.json();
      
      // Ensure language field exists (default to pt-BR if not set)
      if (!this.data.language) {
        this.data.language = 'pt-BR';
        this.saveData();
      }
      
      return this.data;
    } catch (error) {
      console.error('Error loading book data:', error);
      // Fallback to empty structure
      this.data = {
        title: "Novo Livro",
        language: "pt-BR",
        codex: {
          categories: ['Character', 'Locals', 'Plots', 'Object', 'Lore', 'Other'],
          entries: []
        },
        acts: []
      };
      return this.data;
    }
  }

  /**
   * Save data to localStorage (since we can't write to JSON in browser)
   */
  saveData() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('novelWriterData', JSON.stringify(this.data));
    }
  }

  /**
   * Load data from localStorage if available
   */
  loadFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('novelWriterData');
      if (stored) {
        this.data = JSON.parse(stored);
        return true;
      }
    }
    return false;
  }

  // Get the entire book data
  getBook() {
    return this.data;
  }

  // Find an act by ID
  findAct(actId) {
    return this.data.acts.find(a => a.id === actId);
  }

  // Find a chapter by act and chapter ID
  findChapter(actId, chapterId) {
    const act = this.findAct(actId);
    if (!act || !act.chapters) return null;
    return act.chapters.find(c => c.id === chapterId);
  }

  // Find a section
  findSection(actId, chapterId, sectionId) {
    // If only one argument provided, treat it as sectionId and search all
    if (arguments.length === 1) {
      const sectionIdToFind = actId; // First param is actually sectionId
      for (const act of this.data.acts) {
        if (!act.chapters) continue;
        for (const chapter of act.chapters) {
          if (!chapter.sections) continue;
          const section = chapter.sections.find(s => s.id === sectionIdToFind);
          if (section) return section;
        }
      }
      return null;
    }
    
    // Standard three-parameter search
    const chapter = this.findChapter(actId, chapterId);
    if (!chapter || !chapter.sections) return null;
    return chapter.sections.find(s => s.id === sectionId);
  }

  // Save data (alias for saveData for consistency)
  save() {
    this.saveData();
  }

  // Add a new act
  addAct(title) {
    const newId = Math.max(...this.data.acts.map(a => a.id), 0) + 1;
    const newAct = {
      id: newId,
      title: title,
      chapters: []
    };
    this.data.acts.push(newAct);
    this.saveData();
    return newAct;
  }

  // Add a new chapter to an act
  addChapter(actId, title) {
    const act = this.findAct(actId);
    if (!act) return null;

    const allChapterIds = this.data.acts.flatMap(a =>
      (a.chapters || []).map(c => c.id)
    );
    const newId = Math.max(...allChapterIds, 0) + 1;

    const newChapter = {
      id: newId,
      title: title,
      numbering: true,
      visibleInFinal: true,
      sections: []
    };

    if (!act.chapters) {
      act.chapters = [];
    }
    act.chapters.push(newChapter);
    this.saveData();
    return newChapter;
  }

  // Update chapter properties
  updateChapter(actId, chapterId, properties) {
    const chapter = this.findChapter(actId, chapterId);
    if (!chapter) return false;

    Object.assign(chapter, properties);
    this.saveData();
    return true;
  }

  // Delete a chapter
  deleteChapter(actId, chapterId) {
    const act = this.findAct(actId);
    if (!act || !act.chapters) return false;

    const index = act.chapters.findIndex(c => c.id === chapterId);
    if (index === -1) return false;

    act.chapters.splice(index, 1);
    this.saveData();
    return true;
  }

  // Move a chapter within or between acts
  moveChapter(fromActId, chapterId, toActId, targetIndex) {
    const fromAct = this.findAct(fromActId);
    const toAct = this.findAct(toActId);

    if (!fromAct || !toAct) return false;

    const chapterIndex = fromAct.chapters.findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return false;

    const [chapter] = fromAct.chapters.splice(chapterIndex, 1);

    if (!toAct.chapters) {
      toAct.chapters = [];
    }
    toAct.chapters.splice(targetIndex, 0, chapter);

    this.saveData();
    return true;
  }

  // Update act title
  updateActTitle(actId, title) {
    const act = this.findAct(actId);
    if (!act) return false;

    act.title = title;
    this.saveData();
    return true;
  }

  // Get book language
  getLanguage() {
    return this.data?.language || 'pt-BR';
  }

  // Set book language
  setLanguage(language) {
    if (!this.data) return false;
    
    this.data.language = language;
    this.saveData();
    return true;
  }
}

// Create singleton instance
const bookData = new BookData();

// Setup IPC listeners for Electron
if (typeof require !== 'undefined') {
  try {
    const { ipcRenderer } = require('electron');

    // Handle load book data request from main process
    ipcRenderer.on('load-book-data', (event, data) => {
      bookData.data = data;
      bookData.saveData(); // Save to localStorage as well

      // Trigger app update if app is available
      if (typeof window !== 'undefined' && window.app) {
        window.app.update();
      } else {
        // Reload page if app not available
        window.location.reload();
      }
    });

    // Handle request for book data from main process
    ipcRenderer.on('request-book-data', (event, options = {}) => {
      ipcRenderer.send('save-book-data', bookData.data, options.saveAs || false);
    });

    // Handle open AI panel request from main process
    ipcRenderer.on('open-ai-panel', () => {
      if (typeof window !== 'undefined' && window.aiPanelManager) {
        window.aiPanelManager.open();
      }
    });
  } catch (error) {
    console.log('IPC not available (running in browser mode)');
  }
}

// Initialize data when module loads
(async () => {
  // Try to load from localStorage first
  if (!bookData.loadFromStorage()) {
    // If not in storage, load from JSON file
    await bookData.loadData();
  }
})();
