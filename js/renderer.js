// UI Renderer Module
class UIRenderer {
  constructor(bookData) {
    this.bookData = bookData;
  }

  // Main render function
  render() {
    const book = this.bookData.getBook();
    const container = document.getElementById('book-structure');

    let html = '';
    let chapterNumber = 0;

    book.acts.forEach(act => {
      html += this.renderAct(act, chapterNumber);

      // Update chapter count for next act - only count chapters with numbering enabled
      if (act.chapters) {
        act.chapters.forEach(chapter => {
          // Set default if not exists
          if (chapter.numbering === undefined) chapter.numbering = true;
          if (chapter.numbering) {
            chapterNumber++;
          }
        });
      }
    });

    // Add button to create new act
    html += `
      <div class="add-act-section">
        <button class="add-act-btn" id="add-new-act">+ Add New Act</button>
      </div>
    `;

    container.innerHTML = html;
  }

  // Render a single act
  renderAct(act, startChapterNumber) {
    let html = `
      <div class="act-section">
        <div class="act-header">
          <h2 class="act-title" data-act-id="${act.id}">${act.title}</h2>
          <button class="add-chapter-btn" data-act-id="${act.id}">+ Add Chapter</button>
        </div>
        <div class="chapters-grid">
    `;

    if (act.chapters && act.chapters.length > 0) {
      let chapterNumber = startChapterNumber;
      act.chapters.forEach(chapter => {
        // Set default if not exists
        if (chapter.numbering === undefined) chapter.numbering = true;

        // Only increment chapter number if numbering is enabled
        if (chapter.numbering) {
          chapterNumber++;
        }

        html += this.renderChapter(chapter, act, chapterNumber);
      });
    } else {
      html += '<div class="empty-state">No chapters in this act yet.</div>';
    }

    html += `
        </div>
      </div>
    `;

    return html;
  }

  // Render a single chapter card
  renderChapter(chapter, act, chapterNumber) {
    // Set default if not exists
    if (chapter.numbering === undefined) chapter.numbering = true;

    // Only show chapter number if numbering is enabled
    const chapterNumberDisplay = chapter.numbering
      ? `<div class="chapter-number">Chapter ${chapterNumber}</div>`
      : '';

    let html = `
      <div class="chapter-card" draggable="true" data-chapter-id="${chapter.id}" data-act-id="${act.id}">
        <div class="chapter-header">
          <div class="chapter-title-container">
            <div class="chapter-title" data-chapter-id="${chapter.id}" data-act-id="${act.id}">${chapter.title}</div>
            ${chapterNumberDisplay}
          </div>
          <button class="chapter-settings-btn" data-chapter-id="${chapter.id}" data-act-id="${act.id}" title="Chapter Settings">⚙</button>
        </div>
        <ul class="sections-list">
    `;

    if (chapter.sections && chapter.sections.length > 0) {
      chapter.sections.forEach(section => {
        html += this.renderSection(section, chapter, act);
      });
    } else {
      html += '<li class="section-item"><div class="section-summary">No sections yet.</div></li>';
    }

    html += `
        </ul>
      </div>
    `;

    return html;
  }

  // Render a single section
  renderSection(section, chapter, act) {
    const tagsHtml = section.tags && section.tags.length > 0
      ? section.tags.map(tag => `<span class="section-tag">${tag}</span>`).join('')
      : '';

    return `
      <li class="section-item">
        <div class="section-header">
          <div class="section-summary">${section.summary || 'No summary yet...'}</div>
          <button class="section-edit-btn" data-section-id="${section.id}" data-chapter-id="${chapter.id}" data-act-id="${act.id}" title="Edit Section">✎</button>
        </div>
        ${tagsHtml ? `<div class="section-tags">${tagsHtml}</div>` : ''}
      </li>
    `;
  }
}
