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

      // Add discrete insert button between sections (except after last)
      if (index < chapter.sections.length - 1) {
        const insertBtn = this.createInsertButton(chapter, index);
        container.appendChild(insertBtn);
      }
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

  /**
   * Create a discrete insert button between sections
   * @param {Object} chapter - Chapter object
   * @param {number} afterIndex - Index to insert after
   * @returns {HTMLElement} Insert button element
   */
  createInsertButton(chapter, afterIndex) {
    const container = document.createElement('div');
    container.className = 'section-insert-container';

    // Create visible line
    const line = document.createElement('div');
    line.className = 'section-insert-line';
    container.appendChild(line);

    const insertBtn = document.createElement('button');
    insertBtn.className = 'section-insert-btn';
    insertBtn.innerHTML = '<span class="insert-icon">+</span>';
    insertBtn.title = 'Insert scene here';

    insertBtn.addEventListener('click', () => {
      this.insertSectionAfter(chapter, afterIndex);
    });

    container.appendChild(insertBtn);
    return container;
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
      e.preventDefault();
      this.toggleSceneSettings(section, block);
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

    // Scene settings panel (initially hidden)
    const settingsPanel = this.createSceneSettingsPanel(section);

    // Left column: header + settings + content (80%)
    const leftColumn = document.createElement('div');
    leftColumn.className = 'section-left-column';
    leftColumn.appendChild(header);
    leftColumn.appendChild(settingsPanel);

    // Main content area
    const mainContent = document.createElement('div');
    mainContent.className = 'section-main-content';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content-editor';
    contentDiv.contentEditable = true;

    // Create word count div first (will be referenced in event listeners)
    const wordCountDiv = document.createElement('div');
    wordCountDiv.className = 'section-word-count';

    // Format existing content if it's plain text
    if (section.content) {
      // Check if content is already formatted (has HTML tags)
      if (section.content.includes('<p>') || section.content.includes('<br>')) {
        contentDiv.innerHTML = section.content;
      } else {
        // Format plain text content
        contentDiv.innerHTML = this._formatTextContent(section.content);
      }
    } else {
      contentDiv.innerHTML = '';
    }

    contentDiv.addEventListener('blur', () => {
      section.content = contentDiv.innerHTML;
      // Update word count
      this.updateWordCount(contentDiv, wordCountDiv);
      // Data is saved, but don't update main view while editing
    });

    contentDiv.addEventListener('input', () => {
      // Update word count on input
      this.updateWordCount(contentDiv, wordCountDiv);
    });

    // Handle paste to strip formatting
    contentDiv.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
      // Update word count after paste
      setTimeout(() => this.updateWordCount(contentDiv, wordCountDiv), 0);
    });

    mainContent.appendChild(contentDiv);

    // Add word count display
    this.updateWordCount(contentDiv, wordCountDiv);
    mainContent.appendChild(wordCountDiv);

    // Add AI Generate button
    const generateBtn = document.createElement('button');
    generateBtn.className = 'section-generate-btn';
    generateBtn.innerHTML = section.content && section.content.trim() ? '🤖 Regenerate Scene' : '✨ Generate Scene';
    generateBtn.addEventListener('click', async () => {
      await this.generateSectionText(section, contentDiv, generateBtn, wordCountDiv);
    });
    mainContent.appendChild(generateBtn);

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

    // Add tag dropdown (from codex entries)
    const addWrapper = document.createElement('div');
    addWrapper.style.position = 'relative';
    addWrapper.style.display = 'inline-block';

    const addInput = document.createElement('input');
    addInput.type = 'text';
    addInput.className = 'tag-add-input';
    addInput.placeholder = '+ add tag';
    addInput.autocomplete = 'off';

    const dropdown = document.createElement('div');
    dropdown.className = 'tag-dropdown';
    dropdown.style.display = 'none';

    // Get all codex entries and tags as tag options
    const getCodexEntries = () => {
      if (!this.bookData.data.codex || !this.bookData.data.codex.entries) {
        return [];
      }

      const entryNames = this.bookData.data.codex.entries.map(entry => entry.name);

      // Collect all unique tags from all codex entries
      const allTags = new Set();
      this.bookData.data.codex.entries.forEach(entry => {
        if (entry.tags && Array.isArray(entry.tags)) {
          entry.tags.forEach(tag => allTags.add(tag));
        }
      });

      // Combine entry names and tags, remove duplicates
      const combined = [...new Set([...entryNames, ...Array.from(allTags)])];
      return combined.sort();
    };

    const updateDropdown = (filter = '') => {
      const entries = getCodexEntries();
      const filtered = filter
        ? entries.filter(name =>
            name.toLowerCase().includes(filter.toLowerCase()) &&
            !section.tags.includes(name)
          )
        : entries.filter(name => !section.tags.includes(name));

      dropdown.innerHTML = '';

      if (filtered.length === 0) {
        dropdown.style.display = 'none';
        return;
      }

      filtered.forEach(name => {
        const option = document.createElement('div');
        option.className = 'tag-dropdown-option';
        option.textContent = name;
        option.onclick = () => {
          if (!section.tags.includes(name)) {
            section.tags.push(name);
            this.renderTags(container, section);
          }
        };
        dropdown.appendChild(option);
      });

      dropdown.style.display = 'block';
    };

    addInput.addEventListener('focus', () => {
      updateDropdown(addInput.value);
    });

    addInput.addEventListener('input', (e) => {
      updateDropdown(e.target.value);
    });

    addInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const newTag = addInput.value.trim();
        const entries = getCodexEntries();

        if (newTag && entries.includes(newTag) && !section.tags.includes(newTag)) {
          section.tags.push(newTag);
          this.renderTags(container, section);
          addInput.value = '';
        } else if (newTag && !entries.includes(newTag)) {
          alert('Tag must be a codex entry or tag. Please add it to the codex first.');
        }
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
        addInput.blur();
      }
    });

    addInput.addEventListener('blur', (e) => {
      // Delay to allow click on dropdown
      setTimeout(() => {
        dropdown.style.display = 'none';
      }, 200);
    });

    addWrapper.appendChild(addInput);
    addWrapper.appendChild(dropdown);
    container.appendChild(addWrapper);
  }

  /**
   * Create scene settings panel
   */
  createSceneSettingsPanel(section) {
    const panel = document.createElement('div');
    panel.className = 'scene-settings-panel';
    panel.style.display = 'none';

    // Initialize settings if not exist
    if (!section.settings) {
      section.settings = {
        pov: 'third-person',
        narrator: ''
      };
    }

    // POV Selection
    const povGroup = document.createElement('div');
    povGroup.className = 'settings-group';

    const povLabel = document.createElement('label');
    povLabel.textContent = 'Point of View:';
    povLabel.className = 'settings-label';
    povGroup.appendChild(povLabel);

    const povSelect = document.createElement('select');
    povSelect.className = 'settings-select';
    povSelect.innerHTML = `
      <option value="first-person">First Person (I/We)</option>
      <option value="second-person">Second Person (You)</option>
      <option value="third-person">Third Person (He/She/They)</option>
      <option value="third-person-limited">Third Person Limited</option>
      <option value="third-person-omniscient">Third Person Omniscient</option>
    `;
    povSelect.value = section.settings.pov || 'third-person';
    povSelect.addEventListener('change', () => {
      section.settings.pov = povSelect.value;
    });
    povGroup.appendChild(povSelect);
    panel.appendChild(povGroup);

    // Narrator Selection
    const narratorGroup = document.createElement('div');
    narratorGroup.className = 'settings-group';

    const narratorLabel = document.createElement('label');
    narratorLabel.textContent = 'Narrator/Character:';
    narratorLabel.className = 'settings-label';
    narratorGroup.appendChild(narratorLabel);

    const narratorInput = document.createElement('input');
    narratorInput.type = 'text';
    narratorInput.className = 'settings-input';
    narratorInput.placeholder = 'Character name (optional)';
    narratorInput.value = section.settings.narrator || '';
    narratorInput.addEventListener('blur', () => {
      section.settings.narrator = narratorInput.value.trim();
    });
    narratorGroup.appendChild(narratorInput);
    panel.appendChild(narratorGroup);

    return panel;
  }

  /**
   * Toggle scene settings panel visibility
   */
  toggleSceneSettings(section, block) {
    const panel = block.querySelector('.scene-settings-panel');
    if (!panel) return;

    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';

    // Toggle button state
    const configBtn = block.querySelector('.section-config-btn');
    if (configBtn) {
      configBtn.classList.toggle('active', !isVisible);
    }
  }

  renderSideNotes(container, section) {
    container.innerHTML = '';

    section.notes.forEach((note, index) => {
      const noteDiv = document.createElement('textarea');
      noteDiv.className = 'section-note';
      noteDiv.value = note || '';
      noteDiv.placeholder = index === 0
        ? 'AI Instructions: tone, POV, style, pace...\n\nOr just side notes...'
        : 'Side note...';
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
      tags: [],
      notes: []
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

  /**
   * Insert a new section after a specific index
   * @param {Object} chapter - Chapter object
   * @param {number} afterIndex - Index to insert after
   */
  insertSectionAfter(chapter, afterIndex) {
    // Generate new section ID
    const allSectionIds = this.bookData.getBook().acts.flatMap(act =>
      (act.chapters || []).flatMap(ch => (ch.sections || []).map(s => s.id))
    );
    const newId = Math.max(...allSectionIds, 0) + 1;

    const newSection = {
      id: newId,
      summary: '',
      content: '',
      tags: [],
      notes: []
    };

    // Insert at the position after afterIndex
    chapter.sections.splice(afterIndex + 1, 0, newSection);

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

  async generateSectionText(section, contentDiv, generateBtn, wordCountDiv) {
    try {
      // Get LLM manager instance
      const llmManager = window.llmManager;
      if (!llmManager) {
        console.error('LLM Manager not initialized');
        return;
      }

      // Check if API is configured
      const config = llmManager.getConfig();
      if (!config.apiUrl || !config.model) {
        alert('Please configure the AI Assistant first (Tools → AI Assistant)');
        return;
      }

      // Update button to show loading state
      const originalText = generateBtn.innerHTML;
      generateBtn.disabled = true;
      generateBtn.innerHTML = '⏳ Generating...';

      // Prepare context for the LLM
      const bookData = this.bookData.data || this.bookData;
      const bookTitle = bookData.title || 'Untitled Book';

      // Find current chapter and act
      const act = this.bookData.findAct(this.currentActId);
      const chapter = this.bookData.findChapter(this.currentActId, this.currentChapterId);

      if (!chapter) {
        throw new Error('Chapter not found');
      }

      const chapterTitle = chapter.title || 'Unknown Chapter';
      const actTitle = act ? act.title : 'Unknown Act';
      const sectionSummary = section.summary || 'No summary provided';
      const sectionTags = section.tags && section.tags.length > 0
        ? section.tags.join(', ')
        : 'No tags';

      // Build complete book structure with all summaries
      const bookStructure = this._buildBookStructure();

      // Find current section index
      const currentSectionIndex = chapter.sections.findIndex(s => s.id === section.id);

      // Get adjacent sections context (2 before, 2 after)
      const adjacentContext = this._getAdjacentSectionsContext(chapter, currentSectionIndex);

      // Get special instructions from notes
      const specialInstructions = this._extractSpecialInstructions(section);

      // Get scene settings if available
      let settingsInstructions = '';
      if (section.settings) {
        const povMap = {
          'first-person': 'primeira pessoa (eu)',
          'second-person': 'segunda pessoa (você)',
          'third-person': 'terceira pessoa (ele/ela)',
          'third-person-limited': 'terceira pessoa limitada',
          'third-person-omniscient': 'terceira pessoa onisciente'
        };

        const povText = povMap[section.settings.pov] || 'terceira pessoa';
        settingsInstructions = `\n\nCONFIGURAÇÕES DA CENA:
- Ponto de Vista: Escreva em ${povText}`;

        if (section.settings.narrator && section.settings.narrator.trim()) {
          settingsInstructions += `\n- Narrador/Personagem: ${section.settings.narrator}`;
        }
      }

      // Build enhanced system prompt
      const enhancedSystemPrompt = `Você é um escritor criativo especializado em narrativas envolventes e coerentes.

CONTEXTO DO LIVRO COMPLETO:
${bookStructure}

CONTEXTO DAS SEÇÕES ADJACENTES:
${adjacentContext}

INSTRUÇÕES IMPORTANTES:
1. Mantenha a continuidade lógica e narrativa entre as seções
2. Se houver texto das seções anteriores, certifique-se de que a transição seja natural e fluida
3. Se houver texto das seções posteriores, prepare uma transição adequada que se conecte com elas
4. Respeite os eventos e desenvolvimentos estabelecidos nos resumos de todas as seções
5. Mantenha consistência de personagens, tom e estilo narrativo
6. Use os resumos como guia para garantir que a narrativa flui logicamente através do livro${specialInstructions ? '\n\nINSTRUÇÕES ESPECIAIS PARA ESTA SEÇÃO:\n' + specialInstructions : ''}${settingsInstructions}`;

      // Build enhanced user prompt
      const enhancedUserPrompt = `Com base no contexto completo fornecido, gere o texto narrativo detalhado para a seguinte seção:

LIVRO: ${bookTitle}
ATO: ${actTitle}
CAPÍTULO: ${chapterTitle}

SEÇÃO ATUAL:
Resumo: ${sectionSummary}
Tags/Temas: ${sectionTags}
${section.notes && section.notes.length > 0 ? '\nNotas do Autor:\n' + section.notes.filter(n => n.trim()).map((n, i) => `${i + 1}. ${n}`).join('\n') : ''}

ATENÇÃO:
- Certifique-se de que o texto gerado se conecta naturalmente com as seções anteriores (se fornecidas)
- Prepare o terreno para as seções seguintes (se fornecidas)
- Mantenha fidelidade ao resumo da seção atual
- Preserve a continuidade narrativa e lógica temporal
- Use um estilo envolvente e detalhado

Gere agora o texto completo desta seção:`;

      // Clear content div and prepare for streaming
      contentDiv.innerHTML = '';
      let accumulatedContent = '';

      // Call the API with streaming
      await llmManager.callAPIStream(
        enhancedSystemPrompt,
        enhancedUserPrompt,
        // onChunk - called for each piece of text
        (chunk, fullContent) => {
          accumulatedContent = fullContent;
          // Format text properly: convert double line breaks to paragraphs
          const formattedContent = this._formatTextContent(fullContent);
          contentDiv.innerHTML = formattedContent;
          // Auto-scroll to bottom as content arrives
          contentDiv.scrollTop = contentDiv.scrollHeight;
        },
        // onComplete - called when stream finishes
        (fullContent) => {
          section.content = this._formatTextContent(fullContent);
          contentDiv.innerHTML = section.content;
          generateBtn.innerHTML = '🤖 Regenerate Scene';
          generateBtn.disabled = false;
          // Update word count after generation completes
          if (wordCountDiv) {
            this.updateWordCount(contentDiv, wordCountDiv);
          }
        },
        // onError - called on error
        (error) => {
          console.error('Error generating section text:', error);
          alert('Error generating text: ' + error.message);
          generateBtn.innerHTML = section.content ? '🤖 Regenerate Scene' : '✨ Generate Scene';
          generateBtn.disabled = false;
        }
      );

    } catch (error) {
      console.error('Error generating section text:', error);
      alert('Error generating text: ' + error.message);
      // Restore original button text
      generateBtn.innerHTML = section.content ? '🤖 Regenerate Scene' : '✨ Generate Scene';
      generateBtn.disabled = false;
    }
  }

  /**
   * Build complete book structure with all summaries
   * @private
   * @returns {string} Formatted book structure
   */
  _buildBookStructure() {
    let structure = '';

    // Access the data object from BookData instance
    const bookData = this.bookData.data || this.bookData;

    if (!bookData.acts || !Array.isArray(bookData.acts)) {
      return 'Estrutura do livro não disponível.';
    }

    bookData.acts.forEach((act, actIndex) => {
      structure += `\n=== ATO ${actIndex + 1}: ${act.title} ===\n`;

      if (act.chapters && Array.isArray(act.chapters)) {
        act.chapters.forEach((chapter, chapterIndex) => {
          structure += `\n  CAPÍTULO ${chapterIndex + 1}: ${chapter.title}\n`;

          if (chapter.sections && chapter.sections.length > 0) {
            chapter.sections.forEach((section, sectionIndex) => {
              const tags = section.tags && section.tags.length > 0
                ? ` [Tags: ${section.tags.join(', ')}]`
                : '';
              structure += `    ${sectionIndex + 1}. ${section.title || 'Seção ' + (sectionIndex + 1)}: ${section.summary || 'Sem resumo'}${tags}\n`;
            });
          }
        });
      }
    });

    return structure;
  }

  /**
   * Get context from adjacent sections (2 before, 2 after)
   * @private
   * @param {Object} chapter - Current chapter
   * @param {number} currentIndex - Current section index
   * @returns {string} Formatted adjacent sections context
   */
  _getAdjacentSectionsContext(chapter, currentIndex) {
    let context = '';

    // Get 2 sections before
    for (let i = Math.max(0, currentIndex - 2); i < currentIndex; i++) {
      const section = chapter.sections[i];
      const position = currentIndex - i === 2 ? 'SEÇÃO ANTERIOR 2' : 'SEÇÃO ANTERIOR 1';

      context += `\n--- ${position}: ${section.title || 'Seção ' + (i + 1)} ---\n`;
      context += `Resumo: ${section.summary || 'Sem resumo'}\n`;

      if (section.content && section.content.trim()) {
        context += `Texto completo:\n${section.content}\n`;
      } else {
        context += `(Texto ainda não gerado - use apenas o resumo)\n`;
      }
    }

    context += `\n--- SEÇÃO ATUAL (A SER GERADA) ---\n`;
    context += `Esta é a seção que você deve gerar agora.\n`;

    // Get 2 sections after
    for (let i = currentIndex + 1; i < Math.min(chapter.sections.length, currentIndex + 3); i++) {
      const section = chapter.sections[i];
      const position = i - currentIndex === 1 ? 'SEÇÃO SEGUINTE 1' : 'SEÇÃO SEGUINTE 2';

      context += `\n--- ${position}: ${section.title || 'Seção ' + (i + 1)} ---\n`;
      context += `Resumo: ${section.summary || 'Sem resumo'}\n`;

      if (section.content && section.content.trim()) {
        context += `Texto completo:\n${section.content}\n`;
      } else {
        context += `(Texto ainda não gerado - use o resumo para preparar a transição)\n`;
      }
    }

    if (context === '') {
      context = 'Nenhuma seção adjacente disponível.';
    }

    return context;
  }

  /**
   * Format text content for proper display in contentEditable div
   * Converts line breaks to paragraphs for better readability
   * @private
   * @param {string} text - Raw text from API
   * @returns {string} Formatted HTML
   */
  _formatTextContent(text) {
    if (!text) return '';

    // Remove excessive whitespace
    text = text.trim();

    // Split into paragraphs (double line break or more)
    const paragraphs = text.split(/\n\s*\n+/);

    // Wrap each paragraph in <p> tags and handle single line breaks within paragraphs
    const formatted = paragraphs
      .map(para => {
        para = para.trim();
        if (!para) return '';

        // Replace single line breaks within paragraph with <br>
        para = para.replace(/\n/g, '<br>');

        return `<p>${para}</p>`;
      })
      .filter(para => para !== '')
      .join('');

    return formatted;
  }

  /**
   * Extract special instructions from section notes
   * Detects keywords for tone, POV, style changes
   * @private
   * @param {Object} section - Section with notes
   * @returns {string} Formatted special instructions
   */
  _extractSpecialInstructions(section) {
    if (!section.notes || section.notes.length === 0) {
      return '';
    }

    const instructions = [];
    const keywords = {
      // Tone keywords
      tone: ['tom', 'tone', 'mood', 'atmosfera', 'atmosphere'],
      // POV keywords
      pov: ['pov', 'ponto de vista', 'point of view', 'perspectiva', 'narrador', 'primeira pessoa', 'terceira pessoa'],
      // Style keywords
      style: ['estilo', 'style', 'writing style', 'forma de escrita', 'linguagem'],
      // Pace keywords
      pace: ['ritmo', 'pace', 'velocidade', 'lento', 'rápido', 'slow', 'fast'],
      // Emotion keywords
      emotion: ['emoção', 'emotion', 'sentimento', 'feeling', 'tensão', 'tension'],
      // Description keywords
      description: ['descrição', 'description', 'detalhes', 'details', 'visual', 'sensorial']
    };

    section.notes.forEach((note, index) => {
      const noteTrimmed = note.trim();
      if (!noteTrimmed) return;

      const noteLower = noteTrimmed.toLowerCase();

      // Check for specific instruction types
      let instructionType = 'geral';

      for (const [type, words] of Object.entries(keywords)) {
        if (words.some(word => noteLower.includes(word))) {
          instructionType = type;
          break;
        }
      }

      // Format instruction based on type
      switch (instructionType) {
        case 'tone':
          instructions.push(`• TOM/ATMOSFERA: ${noteTrimmed}`);
          break;
        case 'pov':
          instructions.push(`• PONTO DE VISTA: ${noteTrimmed}`);
          break;
        case 'style':
          instructions.push(`• ESTILO DE ESCRITA: ${noteTrimmed}`);
          break;
        case 'pace':
          instructions.push(`• RITMO NARRATIVO: ${noteTrimmed}`);
          break;
        case 'emotion':
          instructions.push(`• EMOÇÃO/TENSÃO: ${noteTrimmed}`);
          break;
        case 'description':
          instructions.push(`• DESCRIÇÃO: ${noteTrimmed}`);
          break;
        default:
          instructions.push(`• ${noteTrimmed}`);
      }
    });

    return instructions.length > 0 ? instructions.join('\n') : '';
  }

  updateWordCount(contentDiv, wordCountDiv) {
    // Extract text from HTML content
    const text = contentDiv.innerHTML
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')   // Replace &nbsp; with spaces
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();

    // Count words
    const words = text.length > 0 ? text.split(' ').filter(word => word.length > 0) : [];
    const wordCount = words.length;

    // Format with comma separator for thousands
    const formattedCount = wordCount.toLocaleString('en-US');

    // Update display
    wordCountDiv.textContent = `${formattedCount} ${wordCount === 1 ? 'word' : 'words'}`;
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
