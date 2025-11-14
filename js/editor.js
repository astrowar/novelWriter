// Inline Editing Module
class InlineEditor {
  constructor(bookData, onUpdate) {
    this.bookData = bookData;
    this.onUpdate = onUpdate;
  }

  setupChapterTitleEditing() {
    const chapterTitles = document.querySelectorAll('.chapter-title');

    chapterTitles.forEach(titleElement => {
      titleElement.addEventListener('dblclick', (e) => {
        e.stopPropagation();

        const chapterId = parseInt(titleElement.getAttribute('data-chapter-id'));
        const actId = parseInt(titleElement.getAttribute('data-act-id'));

        const input = document.createElement('input');
        input.type = 'text';
        input.value = titleElement.textContent;
        input.className = 'chapter-title';
        input.style.width = '100%';
        input.style.border = '2px solid #667eea';
        input.style.padding = '2px 4px';
        input.style.borderRadius = '3px';

        titleElement.style.display = 'none';
        titleElement.parentNode.insertBefore(input, titleElement);

        input.focus();
        input.select();

        const finishEditing = () => {
          const newTitle = input.value.trim();

          if (newTitle && newTitle !== titleElement.textContent) {
            this.bookData.updateChapter(actId, chapterId, { title: newTitle });
            this.onUpdate();
            return;
          }

          input.remove();
          titleElement.style.display = '';
        };

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            finishEditing();
          } else if (e.key === 'Escape') {
            input.remove();
            titleElement.style.display = '';
          }
        });

        input.addEventListener('blur', () => {
          setTimeout(finishEditing, 100);
        });
      });
    });
  }

  setupActTitleEditing() {
    const actTitles = document.querySelectorAll('.act-title');

    actTitles.forEach(titleElement => {
      titleElement.addEventListener('dblclick', (e) => {
        e.stopPropagation();

        const actId = parseInt(titleElement.getAttribute('data-act-id'));

        const input = document.createElement('input');
        input.type = 'text';
        input.value = titleElement.textContent;
        input.className = 'act-title-input';

        titleElement.style.display = 'none';
        titleElement.parentNode.insertBefore(input, titleElement);

        input.focus();
        input.select();

        const finishEditing = () => {
          const newTitle = input.value.trim();

          if (newTitle && newTitle !== titleElement.textContent) {
            this.bookData.updateActTitle(actId, newTitle);
            this.onUpdate();
            return;
          }

          input.remove();
          titleElement.style.display = '';
        };

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            finishEditing();
          } else if (e.key === 'Escape') {
            input.remove();
            titleElement.style.display = '';
          }
        });

        input.addEventListener('blur', () => {
          setTimeout(finishEditing, 100);
        });
      });
    });
  }
}
