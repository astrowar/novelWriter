// Sample book structure data
const bookData = {
  title: "My Novel",
  acts: [
    {
      id: 1,
      title: "Act I: The Beginning",
      chapters: [
        {
          id: 1,
          title: "The Awakening",
          numbering: true,
          visibleInFinal: true,
          sections: [
            {
              id: 1,
              title: "Morning Light",
              summary: "The protagonist wakes up to discover their ordinary world has changed overnight.",
              content: "Full content would go here...",
              tags: ["action", "morning", "discovery"]
            },
            {
              id: 2,
              title: "First Signs",
              summary: "Strange occurrences begin to manifest, hinting at the adventure to come.",
              content: "Full content would go here...",
              tags: ["mystery", "foreshadowing"]
            },
            {
              id: 3,
              title: "The Call",
              summary: "A mysterious message arrives that will change everything.",
              content: "Full content would go here...",
              tags: ["plot-point", "mystery", "turning-point"]
            }
          ]
        },
        {
          id: 2,
          title: "Crossing the Threshold",
          numbering: true,
          visibleInFinal: true,
          sections: [
            {
              id: 1,
              title: "The Decision",
              summary: "After much deliberation, the protagonist decides to embark on the journey.",
              content: "Full content would go here...",
              tags: ["decision", "character-growth"]
            },
            {
              id: 2,
              title: "Leaving Home",
              summary: "Emotional farewell to the familiar world and loved ones.",
              content: "Full content would go here...",
              tags: ["emotional", "farewell", "departure"]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Act II: Rising Action",
      chapters: [
        {
          id: 3,
          title: "Trials and Tribulations",
          numbering: true,
          visibleInFinal: true,
          sections: [
            {
              id: 1,
              title: "First Challenge",
              summary: "The protagonist faces their first major obstacle and learns valuable lessons.",
              content: "Full content would go here...",
              tags: ["action", "challenge", "growth"]
            },
            {
              id: 2,
              title: "Meeting Allies",
              summary: "New companions join the journey, each bringing unique skills and perspectives.",
              content: "Full content would go here...",
              tags: ["character", "friendship", "teamwork"]
            },
            {
              id: 3,
              title: "The Mentor's Wisdom",
              summary: "A wise mentor appears to guide the protagonist through difficult times.",
              content: "Full content would go here...",
              tags: ["wisdom", "mentor", "guidance"]
            }
          ]
        },
        {
          id: 4,
          title: "The Dark Night",
          numbering: true,
          visibleInFinal: true,
          sections: [
            {
              id: 1,
              title: "Betrayal",
              summary: "A trusted ally reveals their true colors, causing chaos and doubt.",
              content: "Full content would go here...",
              tags: ["betrayal", "conflict", "drama"]
            },
            {
              id: 2,
              title: "Loss",
              summary: "Something precious is lost, pushing the protagonist to their lowest point.",
              content: "Full content would go here...",
              tags: ["emotional", "loss", "low-point"]
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Act III: Resolution",
      chapters: [
        {
          id: 5,
          title: "The Final Confrontation",
          numbering: true,
          visibleInFinal: true,
          sections: [
            {
              id: 1,
              title: "Gathering Strength",
              summary: "The protagonist rallies their remaining allies for one last stand.",
              content: "Full content would go here...",
              tags: ["preparation", "teamwork", "hope"]
            },
            {
              id: 2,
              title: "The Battle",
              summary: "An epic confrontation with the antagonist where everything is at stake.",
              content: "Full content would go here...",
              tags: ["action", "climax", "epic", "battle"]
            },
            {
              id: 3,
              title: "Victory",
              summary: "Through courage and sacrifice, the protagonist prevails against all odds.",
              content: "Full content would go here...",
              tags: ["victory", "sacrifice", "resolution"]
            }
          ]
        },
        {
          id: 6,
          title: "A New Beginning",
          numbering: true,
          visibleInFinal: true,
          sections: [
            {
              id: 1,
              title: "Aftermath",
              summary: "The world begins to heal and rebuild after the conflict.",
              content: "Full content would go here...",
              tags: ["healing", "peace", "recovery"]
            },
            {
              id: 2,
              title: "Return Home",
              summary: "The protagonist returns transformed, bringing wisdom and hope to their world.",
              content: "Full content would go here...",
              tags: ["ending", "transformation", "homecoming"]
            }
          ]
        }
      ]
    }
  ]
};

// Function to render the book structure
function renderBookStructure(book) {
  const container = document.getElementById('book-structure');

  if (!book.acts || book.acts.length === 0) {
    container.innerHTML = '<div class="empty-state">No acts found. Start building your book structure!</div>';
    return;
  }

  let html = '<div class="structure-outline">';

  // Calculate chapter numbers sequentially across all acts
  let chapterNumber = 0;

  book.acts.forEach((act, actIndex) => {
    const actNumber = String(actIndex + 1).padStart(2, '0');
    
    html += `
      <div class="act-section">
        <div class="structure-item act-item">
          <div class="structure-number">${actNumber}</div>
          <div class="structure-content">
            <div class="structure-title act-title" data-act-id="${act.id}">${act.title}</div>
            <button class="structure-action-btn add-chapter-btn" data-act-id="${act.id}">+ Add Chapter</button>
          </div>
        </div>
    `;

    if (act.chapters && act.chapters.length > 0) {
      html += '<div class="chapters-list">';
      
      act.chapters.forEach((chapter, chapterIndex) => {
        chapterNumber++; // Increment for each chapter across all acts
        
        html += `
          <div class="chapter-section" draggable="true" data-chapter-id="${chapter.id}" data-act-id="${act.id}">
            <div class="structure-item chapter-item">
              <div class="structure-number">${chapterNumber}</div>
              <div class="structure-content">
                <div class="structure-title chapter-title" data-chapter-id="${chapter.id}" data-act-id="${act.id}">${chapter.title}</div>
                <button class="structure-action-btn chapter-settings-btn" data-chapter-id="${chapter.id}" data-act-id="${act.id}" title="Chapter Settings">⚙</button>
              </div>
            </div>
        `;

        if (chapter.sections && chapter.sections.length > 0) {
          html += '<div class="sections-list">';
          
          chapter.sections.forEach((section, sectionIndex) => {
            const sectionNum = `${chapterNumber}.${sectionIndex + 1}`;
            const tagsHtml = section.tags && section.tags.length > 0
              ? section.tags.map(tag => `<span class="section-tag">${tag}</span>`).join('')
              : '';

            html += `
              <div class="structure-item section-item">
                <div class="structure-number">${sectionNum}</div>
                <div class="structure-content">
                  <div class="structure-title-row">
                    <div class="structure-title section-title">${section.title}</div>
                    <button class="structure-action-btn section-edit-btn" data-section-id="${section.id}" data-chapter-id="${chapter.id}" data-act-id="${act.id}" title="Edit Section">✎</button>
                  </div>
                  ${section.summary ? `<div class="section-summary">${section.summary}</div>` : ''}
                  ${tagsHtml ? `<div class="section-tags">${tagsHtml}</div>` : ''}
                </div>
              </div>
            `;
          });
          
          html += '</div>';
        }

        html += '</div>';
      });
      
      html += '</div>';
    } else {
      html += '<div class="empty-state">No chapters in this act yet.</div>';
    }

    html += `
      </div>
    `;
  });

  // Add button to create new act at the end
  html += `
    <div class="add-act-section">
      <button class="add-act-btn">+ Add New Act</button>
    </div>
  </div>
  `;

  container.innerHTML = html;

  // Add click event listeners to chapter sections
  document.querySelectorAll('.chapter-section').forEach(section => {
    // Draggable functionality is maintained via the draggable attribute
    const chapterId = section.getAttribute('data-chapter-id');
    console.log(`Chapter ${chapterId} section ready`);
  });

  // Add click event listeners to add chapter buttons
  const addButtons = document.querySelectorAll('.add-chapter-btn');
  console.log('Found add chapter buttons:', addButtons.length);

  addButtons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const actId = parseInt(btn.getAttribute('data-act-id'));
      addChapterToAct(actId);
    });
  });

  // Add click event listener to add act button
  const addActBtn = document.querySelector('.add-act-btn');
  if (addActBtn) {
    addActBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      addNewAct();
    });
  }

  // Add click event listeners to chapter settings buttons
  const settingsButtons = document.querySelectorAll('.chapter-settings-btn');
  settingsButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const chapterId = parseInt(btn.getAttribute('data-chapter-id'));
      const actId = parseInt(btn.getAttribute('data-act-id'));
      showChapterProperties(chapterId, actId);
    });
  });

  // Setup drag and drop functionality
  setupDragAndDrop();

  // Setup chapter title editing
  setupChapterTitleEditing();

  // Setup act title editing
  setupActTitleEditing();

  // Setup section editor buttons
  setupSectionEditors();
}

// Variables to track drag state
let draggedChapter = null;
let draggedFromActId = null;

// Function to setup drag and drop
function setupDragAndDrop() {
  const cards = document.querySelectorAll('.chapter-card');

  cards.forEach(card => {
    // Drag start
    card.addEventListener('dragstart', (e) => {
      draggedChapter = {
        id: parseInt(card.getAttribute('data-chapter-id')),
        actId: parseInt(card.getAttribute('data-act-id'))
      };
      draggedFromActId = draggedChapter.actId;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    // Drag end
    card.addEventListener('dragend', (e) => {
      card.classList.remove('dragging');
      document.querySelectorAll('.chapter-card').forEach(c => c.classList.remove('drag-over'));
      draggedChapter = null;
      draggedFromActId = null;
    });

    // Drag over
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      if (draggedChapter && draggedChapter.id !== parseInt(card.getAttribute('data-chapter-id'))) {
        card.classList.add('drag-over');
      }
    });

    // Drag leave
    card.addEventListener('dragleave', (e) => {
      card.classList.remove('drag-over');
    });

    // Drop
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');

      if (!draggedChapter) return;

      const targetChapterId = parseInt(card.getAttribute('data-chapter-id'));
      const targetActId = parseInt(card.getAttribute('data-act-id'));

      if (draggedChapter.id !== targetChapterId) {
        moveChapter(draggedChapter.id, draggedFromActId, targetActId, targetChapterId);
      }
    });

    // Prevent click event from firing when dragging
    card.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      const chapterId = card.getAttribute('data-chapter-id');
      console.log(`Chapter ${chapterId} clicked`);
    });
  });
}

// Function to move a chapter
function moveChapter(chapterId, fromActId, toActId, targetChapterId) {
  console.log(`Moving chapter ${chapterId} from act ${fromActId} to act ${toActId}, after chapter ${targetChapterId}`);

  // Find the source act and chapter
  const fromAct = bookData.acts.find(a => a.id === fromActId);
  if (!fromAct || !fromAct.chapters) return;

  const chapterIndex = fromAct.chapters.findIndex(c => c.id === chapterId);
  if (chapterIndex === -1) return;

  const chapter = fromAct.chapters[chapterIndex];

  // Find the target act
  const toAct = bookData.acts.find(a => a.id === toActId);
  if (!toAct) return;

  if (!toAct.chapters) {
    toAct.chapters = [];
  }

  // Find the target position
  let targetIndex = toAct.chapters.findIndex(c => c.id === targetChapterId);
  if (targetIndex === -1) return;

  // Check if the drop would result in no change (chapter is already right after target)
  if (fromActId === toActId && chapterIndex === targetIndex + 1) {
    console.log('Chapter is already right after target, inserting BEFORE instead');
    // Insert before the target instead
    fromAct.chapters.splice(chapterIndex, 1);
    toAct.chapters.splice(targetIndex, 0, chapter);
  } else if (fromActId === toActId && chapterIndex > targetIndex) {
    // Moving backward: remove first, then insert after target
    fromAct.chapters.splice(chapterIndex, 1);
    toAct.chapters.splice(targetIndex + 1, 0, chapter);
  } else if (fromActId === toActId) {
    // Moving forward: remove first, then insert after target (which shifted back)
    fromAct.chapters.splice(chapterIndex, 1);
    toAct.chapters.splice(targetIndex, 0, chapter);
  } else {
    // Moving between different acts
    fromAct.chapters.splice(chapterIndex, 1);
    toAct.chapters.splice(targetIndex + 1, 0, chapter);
  }

  // Re-render
  renderBookStructure(bookData);
}

// Function to setup chapter title editing
function setupChapterTitleEditing() {
  const chapterTitles = document.querySelectorAll('.chapter-title');

  chapterTitles.forEach(titleElement => {
    titleElement.addEventListener('dblclick', (e) => {
      e.stopPropagation();

      const chapterId = parseInt(titleElement.getAttribute('data-chapter-id'));
      const actId = parseInt(titleElement.getAttribute('data-act-id'));
      const currentTitle = titleElement.textContent;

      // Create input element
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentTitle;
      input.className = 'chapter-title-input';
      input.style.cssText = `
        width: 100%;
        font-size: 1.1em;
        font-weight: bold;
        color: #667eea;
        border: 2px solid #667eea;
        border-radius: 4px;
        padding: 4px 8px;
        outline: none;
        background: #f0f4ff;
      `;

      // Replace title with input
      titleElement.style.display = 'none';
      titleElement.parentElement.insertBefore(input, titleElement);
      input.focus();
      input.select();

      // Function to finish editing
      const finishEditing = () => {
        const newTitle = input.value.trim();

        if (newTitle && newTitle !== currentTitle) {
          // Update the chapter title in data
          const act = bookData.acts.find(a => a.id === actId);
          if (act && act.chapters) {
            const chapter = act.chapters.find(c => c.id === chapterId);
            if (chapter) {
              chapter.title = newTitle;
              renderBookStructure(bookData);
              return;
            }
          }
        }

        // If no change or cancelled, just restore
        input.remove();
        titleElement.style.display = '';
      };

      // Handle Enter key
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          finishEditing();
        } else if (e.key === 'Escape') {
          input.remove();
          titleElement.style.display = '';
        }
      });

      // Handle blur (clicking outside)
      input.addEventListener('blur', () => {
        setTimeout(finishEditing, 100);
      });
    });
  });
}

// Function to setup act title editing
function setupActTitleEditing() {
  const actTitles = document.querySelectorAll('.act-title');

  actTitles.forEach(titleElement => {
    titleElement.addEventListener('dblclick', (e) => {
      e.stopPropagation();

      const actId = parseInt(titleElement.getAttribute('data-act-id'));
      const currentTitle = titleElement.textContent;

      // Create input element
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentTitle;
      input.className = 'act-title-input';
      input.style.cssText = `
        width: 100%;
        font-size: 1.3em;
        font-weight: normal;
        color: white;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid white;
        border-radius: 6px;
        padding: 6px 12px;
        outline: none;
      `;

      // Replace title with input
      titleElement.style.display = 'none';
      titleElement.parentElement.insertBefore(input, titleElement);
      input.focus();
      input.select();

      // Function to finish editing
      const finishEditing = () => {
        const newTitle = input.value.trim();

        if (newTitle && newTitle !== currentTitle) {
          // Update the act title in data
          const act = bookData.acts.find(a => a.id === actId);
          if (act) {
            act.title = newTitle;
            renderBookStructure(bookData);
            return;
          }
        }

        // If no change or cancelled, just restore
        input.remove();
        titleElement.style.display = '';
      };

      // Handle Enter key
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          finishEditing();
        } else if (e.key === 'Escape') {
          input.remove();
          titleElement.style.display = '';
        }
      });

      // Handle blur (clicking outside)
      input.addEventListener('blur', () => {
        setTimeout(finishEditing, 100);
      });
    });
  });
}

// Function to setup section editor buttons
function setupSectionEditors() {
  const editButtons = document.querySelectorAll('.section-edit-btn');

  editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sectionId = parseInt(btn.getAttribute('data-section-id'));
      const chapterId = parseInt(btn.getAttribute('data-chapter-id'));
      const actId = parseInt(btn.getAttribute('data-act-id'));

      openSectionEditor(actId, chapterId, sectionId);
    });
  });
}

// Function to open section editor
function openSectionEditor(actId, chapterId, sectionId) {
  // Find the section
  const act = bookData.acts.find(a => a.id === actId);
  if (!act || !act.chapters) return;

  const chapter = act.chapters.find(c => c.id === chapterId);
  if (!chapter || !chapter.sections) return;

  const section = chapter.sections.find(s => s.id === sectionId);
  if (!section) return;

  // For now, show an alert - later this will open a full editor
  alert(`Opening editor for:\n\nSection: ${section.title}\nChapter: ${chapter.title}\nAct: ${act.title}\n\n(Full editor coming soon!)`);

  // TODO: Open a full-screen editor panel with:
  // - Section title
  // - Rich text editor for content
  // - Tags management
  // - Save/Cancel buttons
}

// Function to show modal and get chapter title
function showModal(defaultTitle, callback) {
  const overlay = document.getElementById('modal-overlay');
  const input = document.getElementById('modal-input');
  const confirmBtn = document.getElementById('modal-confirm');
  const cancelBtn = document.getElementById('modal-cancel');

  // Set default value
  input.value = defaultTitle;

  // Show modal
  overlay.classList.add('active');
  input.focus();
  input.select();

  // Handle confirm
  const handleConfirm = () => {
    const value = input.value.trim();
    cleanup();
    if (value) {
      callback(value);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    cleanup();
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Cleanup function
  const cleanup = () => {
    overlay.classList.remove('active');
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', handleCancel);
    input.removeEventListener('keypress', handleKeyPress);
  };

  // Add event listeners
  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
  input.addEventListener('keypress', handleKeyPress);
}

// Function to add a new chapter to an act
function addChapterToAct(actId) {
  console.log('addChapterToAct called with actId:', actId);

  const act = bookData.acts.find(a => a.id === actId);
  if (!act) {
    console.error('Act not found:', actId);
    return;
  }

  console.log('Found act:', act.title);

  // Generate a new chapter ID
  const allChapters = bookData.acts.flatMap(a => a.chapters || []);
  const maxChapterId = allChapters.length > 0 ? Math.max(...allChapters.map(c => c.id)) : 0;
  const newChapterId = maxChapterId + 1;

  console.log('New chapter ID:', newChapterId);

  // Show modal to get chapter title
  showModal(`New Chapter`, (chapterTitle) => {
    console.log('Chapter title entered:', chapterTitle);

    // Create new chapter
    const newChapter = {
      id: newChapterId,
      title: chapterTitle,
      numbering: true,
      visibleInFinal: true,
      sections: []
    };

    // Add chapter to act
    if (!act.chapters) {
      act.chapters = [];
    }
    act.chapters.push(newChapter);

    console.log('Chapter added, re-rendering...');

    // Re-render the book structure
    renderBookStructure(bookData);
  });
}

// Function to add a new act
function addNewAct() {
  console.log('addNewAct called');

  // Generate a new act ID
  const maxActId = bookData.acts.length > 0 ? Math.max(...bookData.acts.map(a => a.id)) : 0;
  const newActId = maxActId + 1;

  // Calculate the act number based on position
  const actNumber = bookData.acts.length + 1;

  console.log('New act ID:', newActId);

  // Show modal to get act title
  showModal(`Act ${actNumber}: New Act`, (actTitle) => {
    console.log('Act title entered:', actTitle);

    // Create new act
    const newAct = {
      id: newActId,
      title: actTitle,
      chapters: []
    };

    // Add act to book
    bookData.acts.push(newAct);

    console.log('Act added, re-rendering...');

    // Re-render the book structure
    renderBookStructure(bookData);
  });
}

// Function to show chapter properties modal
function showChapterProperties(chapterId, actId) {
  console.log('showChapterProperties called for chapter', chapterId, 'in act', actId);

  // Find the chapter
  const act = bookData.acts.find(a => a.id === actId);
  if (!act || !act.chapters) return;

  const chapter = act.chapters.find(c => c.id === chapterId);
  if (!chapter) return;

  // Get modal elements
  const modal = document.getElementById('chapter-properties-modal');
  const titleInput = document.getElementById('chapter-prop-title');
  const numberingCheckbox = document.getElementById('chapter-prop-numbering');
  const visibleCheckbox = document.getElementById('chapter-prop-visible');
  const deleteBtn = document.getElementById('chapter-prop-delete');
  const saveBtn = document.getElementById('chapter-prop-save');
  const cancelBtn = document.getElementById('chapter-prop-cancel');

  // Set current values
  titleInput.value = chapter.title;

  // Set default values if properties don't exist
  if (chapter.numbering === undefined) chapter.numbering = true;
  if (chapter.visibleInFinal === undefined) chapter.visibleInFinal = true;

  numberingCheckbox.checked = chapter.numbering;
  visibleCheckbox.checked = chapter.visibleInFinal;

  // Show modal
  modal.classList.add('active');
  titleInput.focus();
  titleInput.select();

  // Handle save
  const handleSave = () => {
    const newTitle = titleInput.value.trim();

    if (newTitle) {
      chapter.title = newTitle;
    }

    chapter.numbering = numberingCheckbox.checked;
    chapter.visibleInFinal = visibleCheckbox.checked;

    renderBookStructure(bookData);
    cleanup();
  };

  // Handle delete
  const handleDelete = () => {
    const confirmDelete = confirm(`Are you sure you want to delete "${chapter.title}"?\n\nThis action cannot be undone.`);

    if (confirmDelete) {
      // Remove chapter from act
      const chapterIndex = act.chapters.findIndex(c => c.id === chapterId);
      if (chapterIndex !== -1) {
        act.chapters.splice(chapterIndex, 1);
        renderBookStructure(bookData);
      }
    }

    cleanup();
  };

  // Handle cancel
  const handleCancel = () => {
    cleanup();
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Cleanup function
  const cleanup = () => {
    modal.classList.remove('active');
    saveBtn.removeEventListener('click', handleSave);
    cancelBtn.removeEventListener('click', handleCancel);
    deleteBtn.removeEventListener('click', handleDelete);
    titleInput.removeEventListener('keypress', handleKeyPress);
  };

  // Add event listeners
  saveBtn.addEventListener('click', handleSave);
  cancelBtn.addEventListener('click', handleCancel);
  deleteBtn.addEventListener('click', handleDelete);
  titleInput.addEventListener('keypress', handleKeyPress);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  renderBookStructure(bookData);
});
