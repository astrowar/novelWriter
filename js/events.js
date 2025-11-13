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
}
