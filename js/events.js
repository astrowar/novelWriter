// Event Handlers Module
class EventHandlers {
  constructor(bookData, modalManager, chapterPropertiesModal, sectionEditor, onUpdate) {
    this.bookData = bookData;
    this.modalManager = modalManager;
    this.chapterPropertiesModal = chapterPropertiesModal;
    this.sectionEditor = sectionEditor;
    this.onUpdate = onUpdate;
  }

  setup() {
    this.setupAddChapterButtons();
    this.setupAddActButton();
    this.setupChapterSettingsButtons();
    this.setupChapterCardClicks();
    this.setupSectionEditButtons();
    this.setupTagButtons();
    this.setupChapterWriteButtons();
    this.setupChapterCollapseButtons();
  }

  setupAddChapterButtons() {
    const addButtons = document.querySelectorAll('.add-chapter-btn');

    addButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const actId = parseInt(btn.getAttribute('data-act-id'));

        this.modalManager.show('New Chapter', (chapterTitle) => {
          if (chapterTitle) {
            this.bookData.addChapter(actId, chapterTitle);
            this.onUpdate();
          }
        });
      });
    });
  }

  setupAddActButton() {
    const addActBtn = document.getElementById('add-new-act');

    if (addActBtn) {
      addActBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        this.modalManager.show('New Act', (actTitle) => {
          if (actTitle) {
            this.bookData.addAct(actTitle);
            this.onUpdate();
          }
        });
      });
    }
  }

  setupChapterSettingsButtons() {
    const settingsButtons = document.querySelectorAll('.chapter-settings-btn');

    settingsButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chapterId = parseInt(btn.getAttribute('data-chapter-id'));
        const actId = parseInt(btn.getAttribute('data-act-id'));

        this.chapterPropertiesModal.show(actId, chapterId);
      });
    });
  }

  setupChapterCardClicks() {
    const chapterCards = document.querySelectorAll('.chapter-card');

    chapterCards.forEach(card => {
      // Make card clickable (but not the settings button)
      card.addEventListener('click', (e) => {
        // Don't open editor if clicking on settings button or drag handle
        if (e.target.classList.contains('chapter-settings-btn') ||
            e.target.closest('.chapter-settings-btn') ||
            e.target.classList.contains('chapter-title')) {
          return;
        }

        const chapterId = parseInt(card.getAttribute('data-chapter-id'));
        const actId = parseInt(card.getAttribute('data-act-id'));

        this.sectionEditor.openChapterEditor(actId, chapterId);
      });

      // Add visual feedback
      card.style.cursor = 'pointer';
    });
  }

  setupSectionEditButtons() {
    const editButtons = document.querySelectorAll('.section-edit-btn');

    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sectionId = parseInt(btn.getAttribute('data-section-id'));
        const chapterId = parseInt(btn.getAttribute('data-chapter-id'));
        const actId = parseInt(btn.getAttribute('data-act-id'));

        this.sectionEditor.openChapterEditor(actId, chapterId, sectionId);
      });
    });
  }

  setupTagButtons() {
    // Handle tag removal
    const removeButtons = document.querySelectorAll('.tag-remove-btn');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sectionId = parseInt(btn.getAttribute('data-section-id'));
        const tag = btn.getAttribute('data-tag');
        
        // Find and remove the tag
        const section = this.bookData.findSection(sectionId);
        if (section && section.tags) {
          section.tags = section.tags.filter(t => t !== tag);
          this.bookData.save();
          this.onUpdate();
        }
      });
    });

    // Handle tag addition
    const addButtons = document.querySelectorAll('.tag-add-btn');
    addButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sectionId = parseInt(btn.getAttribute('data-section-id'));
        
        this.modalManager.show('Add Tag', (tagName) => {
          if (tagName && tagName.trim()) {
            const section = this.bookData.findSection(sectionId);
            if (section) {
              if (!section.tags) {
                section.tags = [];
              }
              if (!section.tags.includes(tagName.trim())) {
                section.tags.push(tagName.trim());
                this.bookData.save();
                this.onUpdate();
              }
            }
          }
        });
      });
    });
  }

  setupChapterWriteButtons() {
    const writeButtons = document.querySelectorAll('.chapter-write-btn');
    
    writeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const actId = parseInt(btn.getAttribute('data-act-id'));
        const chapterId = parseInt(btn.getAttribute('data-chapter-id'));
        const chapterNumber = btn.getAttribute('data-chapter-number');
        
        const chapter = this.bookData.findChapter(actId, chapterId);
        if (chapter) {
          this.openWriterPanel(chapter, chapterNumber);
        }
      });
    });
  }

  setupChapterCollapseButtons() {
    const collapseButtons = document.querySelectorAll('.chapter-collapse-btn');
    
    collapseButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chapterId = btn.getAttribute('data-chapter-id');
        const actId = btn.getAttribute('data-act-id');
        const chapterRow = btn.closest('.chapter-row');
        
        if (chapterRow) {
          chapterRow.classList.toggle('collapsed');
          // Change icon
          btn.textContent = chapterRow.classList.contains('collapsed') ? '▶' : '▼';
        }
      });
    });
  }

  openWriterPanel(chapter, chapterNumber) {
    // Switch to writer panel
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('[data-section="writer"]').classList.add('active');
    
    document.querySelectorAll('.app-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('writer-panel').classList.add('active');
    
    // Populate writer panel
    this.populateWriterPanel(chapter, chapterNumber);
  }

  populateWriterPanel(chapter, chapterNumber) {
    const writerPanel = document.getElementById('writer-panel');
    
    // Store chapter context for saving
    writerPanel.dataset.chapterId = chapter.id;
    writerPanel.dataset.actId = this.findActIdByChapter(chapter.id);
    
    // Build sections HTML
    let sectionsHtml = '';
    if (chapter.sections && chapter.sections.length > 0) {
      chapter.sections.forEach((section, index) => {
        const summary = section.summary || `Section ${index + 1}`;
        const content = section.content || 'Start writing here...';
        // Convert \n to <br> for display
        const contentHtml = content.replace(/\n/g, '<br>');
        
        sectionsHtml += `
          <div class="writer-section">
            <div class="section-summary">${summary}</div>
            <div class="section-content">
              <p contenteditable="true" data-section-id="${section.id}">${contentHtml}</p>
            </div>
          </div>
        `;
      });
    } else {
      sectionsHtml = `
        <div class="writer-section">
          <div class="section-summary">Section 1</div>
          <div class="section-content">
            <p contenteditable="true">Start writing your first section here...</p>
          </div>
        </div>
      `;
    }
    
    // Update the writer panel HTML
    const html = `
      <div class="writer-container">
        <div class="writer-grid">
          <div class="writer-number">${String(chapterNumber).padStart(2, '0')}</div>
          <h1 class="writer-title" contenteditable="true" data-chapter-id="${chapter.id}">${chapter.title}</h1>
        </div>
        
        <div class="writer-sections">
          ${sectionsHtml}
        </div>
        
        <div class="writer-footer">
          <button class="writer-save-btn" data-chapter-id="${chapter.id}">Save Chapter</button>
        </div>
      </div>
    `;
    
    writerPanel.innerHTML = html;
    
    // Setup save functionality
    this.setupWriterSave();
  }

  setupWriterSave() {
    const saveBtn = document.querySelector('.writer-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const writerPanel = document.getElementById('writer-panel');
        const chapterId = parseInt(writerPanel.dataset.chapterId);
        const actId = parseInt(writerPanel.dataset.actId);
        
        // Save title
        const titleEl = document.querySelector('.writer-title');
        const newTitle = titleEl.innerText.trim();
        if (newTitle) {
          this.bookData.updateChapter(actId, chapterId, { title: newTitle });
        }
        
        // Save content from all sections
        const sectionContents = document.querySelectorAll('.section-content [contenteditable]');
        sectionContents.forEach(contentEl => {
          const sectionId = contentEl.getAttribute('data-section-id');
          if (sectionId) {
            const section = this.bookData.findSection(parseInt(sectionId));
            if (section) {
              // Convert <br> and <div> tags back to \n
              let html = contentEl.innerHTML;
              html = html.replace(/<br\s*\/?>/gi, '\n');
              html = html.replace(/<\/div><div>/gi, '\n');
              html = html.replace(/<div>/gi, '\n');
              html = html.replace(/<\/div>/gi, '');
              html = html.replace(/<[^>]*>/g, ''); // Remove any other tags
              section.content = html.trim();
            }
          }
        });
        
        this.bookData.save();
        this.onUpdate();
        alert('Chapter saved successfully!');
      });
    }
  }

  findActIdByChapter(chapterId) {
    const book = this.bookData.getBook();
    for (const act of book.acts) {
      if (act.chapters) {
        const chapter = act.chapters.find(c => c.id === chapterId);
        if (chapter) return act.id;
      }
    }
    return null;
  }
}
