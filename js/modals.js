// Modal Manager Module
class ModalManager {
  constructor() {
    this.overlay = document.getElementById('modal-overlay');
    this.input = document.getElementById('modal-input');
    this.confirmBtn = document.getElementById('modal-confirm');
    this.cancelBtn = document.getElementById('modal-cancel');
  }

  show(defaultTitle = '', callback) {
    this.input.value = defaultTitle;
    this.overlay.classList.add('active');
    this.input.focus();
    this.input.select();

    const handleConfirm = () => {
      const value = this.input.value.trim();
      this.cleanup();
      if (value && callback) {
        callback(value);
      }
    };

    const handleCancel = () => {
      this.cleanup();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleConfirm();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };

    this.cleanup = () => {
      this.overlay.classList.remove('active');
      this.confirmBtn.removeEventListener('click', handleConfirm);
      this.cancelBtn.removeEventListener('click', handleCancel);
      this.input.removeEventListener('keydown', handleKeyDown);
      this.overlay.removeEventListener('click', handleOverlayClick);
    };

    const handleOverlayClick = (e) => {
      if (e.target === this.overlay) {
        handleCancel();
      }
    };

    this.confirmBtn.addEventListener('click', handleConfirm);
    this.cancelBtn.addEventListener('click', handleCancel);
    this.input.addEventListener('keydown', handleKeyDown);
    this.overlay.addEventListener('click', handleOverlayClick);
  }
}

// Chapter Properties Modal
class ChapterPropertiesModal {
  constructor(bookData, onUpdate) {
    this.bookData = bookData;
    this.onUpdate = onUpdate;
    this.modal = document.getElementById('chapter-properties-modal');
    this.titleInput = document.getElementById('chapter-prop-title');
    this.numberingCheckbox = document.getElementById('chapter-prop-numbering');
    this.visibleCheckbox = document.getElementById('chapter-prop-visible');
    this.deleteBtn = document.getElementById('chapter-prop-delete');
    this.saveBtn = document.getElementById('chapter-prop-save');
    this.cancelBtn = document.getElementById('chapter-prop-cancel');
  }

  show(actId, chapterId) {
    const chapter = this.bookData.findChapter(actId, chapterId);
    const act = this.bookData.findAct(actId);

    if (!chapter || !act) return;

    this.currentActId = actId;
    this.currentChapterId = chapterId;

    // Set current values
    this.titleInput.value = chapter.title;

    // Set default values if properties don't exist
    if (chapter.numbering === undefined) chapter.numbering = true;
    if (chapter.visibleInFinal === undefined) chapter.visibleInFinal = true;

    this.numberingCheckbox.checked = chapter.numbering;
    this.visibleCheckbox.checked = chapter.visibleInFinal;

    // Show modal
    this.modal.classList.add('active');
    this.titleInput.focus();
    this.titleInput.select();

    const handleSave = () => {
      const newTitle = this.titleInput.value.trim();

      const updates = {
        numbering: this.numberingCheckbox.checked,
        visibleInFinal: this.visibleCheckbox.checked
      };

      if (newTitle) {
        updates.title = newTitle;
      }

      this.bookData.updateChapter(actId, chapterId, updates);
      this.onUpdate();
      this.cleanup();
    };

    const handleDelete = () => {
      const confirmDelete = confirm(`Are you sure you want to delete "${chapter.title}"?\n\nThis action cannot be undone.`);

      if (confirmDelete) {
        this.bookData.deleteChapter(actId, chapterId);
        this.onUpdate();
        this.cleanup();
      }
    };

    const handleCancel = () => {
      this.cleanup();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };

    const handleOverlayClick = (e) => {
      if (e.target === this.modal) {
        handleCancel();
      }
    };

    this.cleanup = () => {
      this.modal.classList.remove('active');
      this.saveBtn.removeEventListener('click', handleSave);
      this.deleteBtn.removeEventListener('click', handleDelete);
      this.cancelBtn.removeEventListener('click', handleCancel);
      this.titleInput.removeEventListener('keydown', handleKeyDown);
      this.modal.removeEventListener('click', handleOverlayClick);
    };

    this.saveBtn.addEventListener('click', handleSave);
    this.deleteBtn.addEventListener('click', handleDelete);
    this.cancelBtn.addEventListener('click', handleCancel);
    this.titleInput.addEventListener('keydown', handleKeyDown);
    this.modal.addEventListener('click', handleOverlayClick);
  }
}
