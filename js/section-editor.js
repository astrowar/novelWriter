// Chapter Editor Module - Opens full chapter editor with all sections
class SectionEditor {
  constructor(bookData, onUpdate) {
    this.bookData = bookData;
    this.onUpdate = onUpdate;
    this.editorElement = null;
    this.currentActId = null;
    this.currentChapterId = null;
  }

  setup() {
    const editButtons = document.querySelectorAll('.section-edit-btn');

    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chapterId = parseInt(btn.getAttribute('data-chapter-id'));
        const actId = parseInt(btn.getAttribute('data-act-id'));

        this.openChapterEditor(actId, chapterId);
      });
    });
  }

  openChapterEditor(actId, chapterId, scrollToSectionId = null) {
    const chapter = this.bookData.findChapter(actId, chapterId);
    const act = this.bookData.findAct(actId);

    if (!chapter || !act) return;

    this.currentActId = actId;
    this.currentChapterId = chapterId;

    // Get editor elements
    this.editorElement = document.getElementById('chapter-editor');
    const editorTitle = document.getElementById('editor-chapter-title');
    const editorBreadcrumb = document.getElementById('editor-breadcrumb');
    const editorMain = document.getElementById('editor-main');
    const closeBtn = document.getElementById('editor-close');

    // Set title and breadcrumb
    editorTitle.textContent = chapter.title;
    editorBreadcrumb.textContent = `${act.title} > ${chapter.title}`;

    // Render all sections
    this.renderSections(editorMain, chapter);

    // Show editor
    this.editorElement.style.display = 'flex';

    // Scroll to specific section if requested
    if (scrollToSectionId !== null) {
      setTimeout(() => {
        const sectionBlock = editorMain.querySelector(`[data-section-id="${scrollToSectionId}"]`);
        if (sectionBlock) {
          sectionBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }

    // Setup close handler
    closeBtn.onclick = () => this.close();

    // Setup auto-save
    this.setupAutoSave(editorMain);
  }

  renderSections(container, chapter) {
    container.innerHTML = '';

    if (!chapter.sections || chapter.sections.length === 0) {
      chapter.sections = [];
    }

    chapter.sections.forEach((section, index) => {
      const sectionBlock = this.createSectionBlock(section, index);
      container.appendChild(sectionBlock);
    });

    // Add "New Scene" button at the end
    const newSceneBtn = document.createElement('button');
    newSceneBtn.className = 'new-scene-btn';
    newSceneBtn.innerHTML = '+ Add New Scene';
    newSceneBtn.addEventListener('click', () => {
      this.addNewSection(chapter);
    });
    container.appendChild(newSceneBtn);
  }

  createSectionBlock(section, index) {
    const block = document.createElement('div');
    block.className = 'section-editor-block';
    block.dataset.sectionId = section.id;

    // Section info header
    const header = document.createElement('div');
    header.className = 'section-info-header';

    // Header top row with controls
    const headerTop = document.createElement('div');
    headerTop.className = 'section-header-top';

    // Collapse button (left)
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'section-collapse-btn';
    collapseBtn.innerHTML = '▼';
    collapseBtn.title = 'Collapse/Expand';
    collapseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      block.classList.toggle('collapsed');
      collapseBtn.innerHTML = block.classList.contains('collapsed') ? '▶' : '▼';
    });
    headerTop.appendChild(collapseBtn);

    // Section number/label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'section-info-label';
    labelDiv.textContent = `Scene ${index + 1}`;
    headerTop.appendChild(labelDiv);

    // Right side controls
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'section-controls';

    // Configure button
    const configBtn = document.createElement('button');
    configBtn.className = 'section-config-btn';
    configBtn.innerHTML = '⚙';
    configBtn.title = 'Scene Settings';
    configBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      alert('Scene settings coming soon!');
    });
    controlsDiv.appendChild(configBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'section-delete-btn';
    deleteBtn.innerHTML = '🗑';
    deleteBtn.title = 'Delete Scene';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteSection(section, index);
    });
    controlsDiv.appendChild(deleteBtn);

    headerTop.appendChild(controlsDiv);
    header.appendChild(headerTop);

    // Summary
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'section-info-summary';

    const summaryTextarea = document.createElement('textarea');
    summaryTextarea.value = section.summary || '';
    summaryTextarea.placeholder = 'Brief summary of this section...';
    summaryTextarea.addEventListener('blur', () => {
      section.summary = summaryTextarea.value.trim();
      // Data is saved, but don't update main view while editing
    });

    summaryDiv.appendChild(summaryTextarea);
    header.appendChild(summaryDiv);

    // Tags
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'section-info-tags';

    if (!section.tags) {
      section.tags = [];
    }

    this.renderTags(tagsDiv, section);

    header.appendChild(tagsDiv);

    // Left column: header + content (80%)
    const leftColumn = document.createElement('div');
    leftColumn.className = 'section-left-column';
    leftColumn.appendChild(header);

    // Main content area
    const mainContent = document.createElement('div');
    mainContent.className = 'section-main-content';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content-editor';
    contentDiv.contentEditable = true;
    contentDiv.innerHTML = section.content || '';

    contentDiv.addEventListener('blur', () => {
      section.content = contentDiv.innerHTML;
      // Data is saved, but don't update main view while editing
    });

    // Handle paste to strip formatting
    contentDiv.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    });

    mainContent.appendChild(contentDiv);
    leftColumn.appendChild(mainContent);
    block.appendChild(leftColumn);

    // Side notes area (right 20%)
    const sideNotesDiv = document.createElement('div');
    sideNotesDiv.className = 'section-sidenotes';

    if (!section.notes) {
      section.notes = [];
    }

    this.renderSideNotes(sideNotesDiv, section);

    block.appendChild(sideNotesDiv);

    return block;
  }

  renderTags(container, section) {
    container.innerHTML = '';

    section.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'section-info-tag removable';
      tagSpan.textContent = tag;
      tagSpan.onclick = (e) => {
        e.stopPropagation();
        const index = section.tags.indexOf(tag);
        if (index > -1) {
          section.tags.splice(index, 1);
          this.renderTags(container, section);
          // Data is saved, but don't update main view while editing
        }
      };
      container.appendChild(tagSpan);
    });

    // Add tag input
    const addInput = document.createElement('input');
    addInput.type = 'text';
    addInput.className = 'tag-add-input';
    addInput.placeholder = '+ add tag';
    addInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const newTag = addInput.value.trim();
        if (newTag && !section.tags.includes(newTag)) {
          section.tags.push(newTag);
          this.renderTags(container, section);
          // Data is saved, but don't update main view while editing
        }
      }
    });
    container.appendChild(addInput);
  }

  renderSideNotes(container, section) {
    container.innerHTML = '';

    section.notes.forEach((note, index) => {
      const noteDiv = document.createElement('textarea');
      noteDiv.className = 'section-note';
      noteDiv.value = note || '';
      noteDiv.placeholder = 'Side note...';
      noteDiv.addEventListener('blur', () => {
        section.notes[index] = noteDiv.value.trim();
        // Data is saved, but don't update main view while editing
      });
      container.appendChild(noteDiv);
    });

    // Add note button
    const addNoteBtn = document.createElement('button');
    addNoteBtn.className = 'add-note-btn';
    addNoteBtn.innerHTML = '+ Add Note';
    addNoteBtn.addEventListener('click', () => {
      section.notes.push('');
      this.renderSideNotes(container, section);
      // Focus the new note
      const notes = container.querySelectorAll('.section-note');
      if (notes.length > 0) {
        notes[notes.length - 1].focus();
      }
    });
    container.appendChild(addNoteBtn);
  }

  setupAutoSave(container) {
    // Save content periodically
    let saveTimer;
    container.addEventListener('input', () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        console.log('Auto-saving chapter...');
        // Content is already saved in real-time via blur events
      }, 2000);
    });
  }

  deleteSection(section, index) {
    const chapter = this.bookData.findChapter(this.currentActId, this.currentChapterId);
    if (!chapter) return;

    const sectionIndex = chapter.sections.findIndex(s => s.id === section.id);
    if (sectionIndex !== -1) {
      chapter.sections.splice(sectionIndex, 1);
      // Re-render the editor only (don't update main view)
      const editorMain = document.getElementById('editor-main');
      this.renderSections(editorMain, chapter);
      // Note: onUpdate() is called only when closing the editor
    }
  }

  addNewSection(chapter) {
    // Generate new section ID
    const allSectionIds = this.bookData.getBook().acts.flatMap(act =>
      (act.chapters || []).flatMap(ch => (ch.sections || []).map(s => s.id))
    );
    const newId = Math.max(...allSectionIds, 0) + 1;

    const newSection = {
      id: newId,
      summary: '',
      content: '',
      tags: []
    };

    chapter.sections.push(newSection);

    // Re-render the editor
    const editorMain = document.getElementById('editor-main');
    this.renderSections(editorMain, chapter);

    // Scroll to the new section
    setTimeout(() => {
      const newBlock = document.querySelector(`[data-section-id="${newId}"]`);
      if (newBlock) {
        newBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Focus on summary textarea
        const summaryTextarea = newBlock.querySelector('textarea');
        if (summaryTextarea) {
          summaryTextarea.focus();
        }
      }
    }, 100);
    // Note: onUpdate() is called only when closing the editor
  }

  close() {
    if (this.editorElement) {
      this.editorElement.style.display = 'none';
      this.currentActId = null;
      this.currentChapterId = null;
      // Re-render the main view to show any changes
      this.onUpdate();
    }
  }
}
