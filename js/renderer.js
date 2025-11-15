// UI Renderer Module
class UIRenderer {
  constructor(bookData) {
    this.bookData = bookData;
  }

  // Main render function
  render() {
    const book = this.bookData.getBook();
    const container = document.getElementById('book-structure');

    let html = '<div class="structure-outline">';
    let chapterNumber = 0;

    book.acts.forEach((act, actIndex) => {
      const actNumber = String(actIndex + 1).padStart(2, '0');
      
      html += `
        <div class="act-section">
          <div class="structure-item act-item">
            <div class="structure-number"><button class="structure-action-btn act-collapse-btn" data-act-id="${act.id}" title="Collapse Act">▼</button>${actNumber}</div>
            <div class="structure-content">
              <div class="structure-title act-title" data-act-id="${act.id}">${act.title}</div>
              <button class="structure-action-btn add-chapter-btn" data-act-id="${act.id}">+ Add Chapter</button>
            </div>
          </div>
      `;

      if (act.chapters && act.chapters.length > 0) {
        html += '<div class="chapters-grid">';
        
        act.chapters.forEach((chapter, chapterIndex) => {
          chapterNumber++; // Increment for each chapter across all acts
          
          // Build sections column content
          let sectionsHtml = '';
          if (chapter.sections && chapter.sections.length > 0) {
            chapter.sections.forEach((section, sectionIndex) => {
              const sectionNum = `${chapterNumber}.${sectionIndex + 1}`;
              const tagsHtml = section.tags && section.tags.length > 0
                ? section.tags.map(tag => `<span class="section-tag">${tag}<button class="tag-remove-btn" data-section-id="${section.id}" data-tag="${tag}" title="Remove tag">×</button></span>`).join('')
                : '';
              const summaryHtml = section.summary || 'No details yet.';

              sectionsHtml += `
                <div class="section-row">
                  <div class="section-number">${sectionNum}</div>
                  <div class="section-content">
                    <div class="section-summary" data-section-id="${section.id}" data-chapter-id="${chapter.id}" data-act-id="${act.id}">${summaryHtml}</div>
                    <div class="section-tags">
                      ${tagsHtml}
                      <button class="tag-add-btn" data-section-id="${section.id}" data-chapter-id="${chapter.id}" data-act-id="${act.id}" title="Add tag">+ Tag</button>
                    </div>
                  </div>
                  <button class="structure-action-btn section-edit-btn" data-section-id="${section.id}" data-chapter-id="${chapter.id}" data-act-id="${act.id}" title="Edit Section">✎</button>
                </div>
              `;
            });
          }
          
          html += `
            <div class="chapter-row" draggable="true" data-chapter-id="${chapter.id}" data-act-id="${act.id}">
              <div class="chapter-number">
                <button class="structure-action-btn chapter-collapse-btn" data-chapter-id="${chapter.id}" data-act-id="${act.id}" title="Collapse Chapter">▼</button>
                <button class="chapter-write-btn" data-chapter-id="${chapter.id}" data-act-id="${act.id}" data-chapter-number="${chapterNumber}" title="Write Chapter">✎</button>
                ${chapterNumber}
              </div>
              <div class="chapter-title" data-chapter-id="${chapter.id}" data-act-id="${act.id}">
                ${chapter.title}
                <button class="structure-action-btn chapter-settings-btn" data-chapter-id="${chapter.id}" data-act-id="${act.id}" title="Chapter Settings">✎</button>
              </div>
              <div class="chapter-sections">
                ${sectionsHtml || '<div class="section-row empty">No sections yet.</div>'}
              </div>
            </div>
          `;
        });
        
        html += '</div>';
      } else {
        html += '<div class="empty-state">No chapters in this act yet.</div>';
      }

      html += `
        </div>
      `;
    });

    // Add button to create new act
    html += `
      <div class="add-act-section">
        <button class="add-act-btn" id="add-new-act">+ Add New Act</button>
      </div>
    </div>
    `;

    container.innerHTML = html;
  }
}
