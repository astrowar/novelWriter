class Publisher {
  constructor(bookData) {
    this.bookData = bookData;
  }

  render() {
    const panel = document.getElementById('publisher-panel');
    if (!panel) return;

    // container where book pages will be rendered
    const view = document.createElement('div');
    view.id = 'publisher-view';
    view.className = 'publisher-view';

    // inner column (white background, centered)
    const inner = document.createElement('div');
    inner.className = 'publisher-inner';

    // Title
    const title = document.createElement('h1');
    title.className = 'publisher-title';
    title.textContent = (this.bookData.data && this.bookData.data.title) || this.bookData.title || 'Untitled Book';
    inner.appendChild(title);

    // Render acts -> chapters -> sections as a continuous flow
    const acts = (this.bookData.data && this.bookData.data.acts) || this.bookData.acts || [];

    acts.forEach((act, actIndex) => {
      const actEl = document.createElement('section');
      actEl.className = 'publisher-act';

      const actTitle = document.createElement('h2');
      actTitle.className = 'publisher-act-title';
      actTitle.textContent = act.title || `Act ${actIndex + 1}`;
      actEl.appendChild(actTitle);

      if (act.chapters && act.chapters.length) {
        act.chapters.forEach((chapter, chapterIndex) => {
          const chapEl = document.createElement('article');
          chapEl.className = 'publisher-chapter';

          const chapTitle = document.createElement('h3');
          chapTitle.className = 'publisher-chapter-title';
          chapTitle.textContent = chapter.title || `Chapter ${chapterIndex + 1}`;
          chapEl.appendChild(chapTitle);

          if (chapter.sections && chapter.sections.length) {
            chapter.sections.forEach(section => {
              const secEl = document.createElement('div');
              secEl.className = 'publisher-section';

              const secTitle = document.createElement('h4');
              secTitle.className = 'publisher-section-title';
              secTitle.textContent = section.title || '';
              secEl.appendChild(secTitle);

              const secContent = document.createElement('div');
              secContent.className = 'publisher-section-content';
              // Use only `content` for preview (do not show summary)
              secContent.textContent = section.content || '';
              secEl.appendChild(secContent);

              chapEl.appendChild(secEl);
            });
          }

          actEl.appendChild(chapEl);
        });
      }

      inner.appendChild(actEl);
    });

    // Clear and append
    view.appendChild(inner);
    panel.innerHTML = '';
    panel.appendChild(view);
  }
}

// Export for CommonJS environments (tests) but avoid breaking browser global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Publisher;
}
