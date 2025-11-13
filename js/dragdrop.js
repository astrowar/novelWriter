// Drag and Drop Module
class DragDropManager {
  constructor(bookData, onUpdate) {
    this.bookData = bookData;
    this.onUpdate = onUpdate; // Callback to re-render after changes
    this.draggedChapter = null;
    this.draggedFromActId = null;
  }

  setup() {
    const cards = document.querySelectorAll('.chapter-card');

    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => this.handleDragStart(e, card));
      card.addEventListener('dragover', (e) => this.handleDragOver(e));
      card.addEventListener('drop', (e) => this.handleDrop(e, card));
      card.addEventListener('dragenter', (e) => this.handleDragEnter(e, card));
      card.addEventListener('dragleave', (e) => this.handleDragLeave(e, card));
      card.addEventListener('dragend', (e) => this.handleDragEnd(e, card));
    });
  }

  handleDragStart(e, card) {
    this.draggedChapter = {
      id: parseInt(card.getAttribute('data-chapter-id')),
      actId: parseInt(card.getAttribute('data-act-id'))
    };
    this.draggedFromActId = this.draggedChapter.actId;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDragEnter(e, card) {
    e.preventDefault();
    if (!card.classList.contains('dragging')) {
      card.classList.add('drag-over');
    }
  }

  handleDragLeave(e, card) {
    card.classList.remove('drag-over');
  }

  handleDrop(e, targetCard) {
    e.preventDefault();
    targetCard.classList.remove('drag-over');

    if (!this.draggedChapter) return;

    const targetChapterId = parseInt(targetCard.getAttribute('data-chapter-id'));
    const targetActId = parseInt(targetCard.getAttribute('data-act-id'));

    if (this.draggedChapter.id === targetChapterId) {
      return;
    }

    const fromAct = this.bookData.findAct(this.draggedFromActId);
    const toAct = this.bookData.findAct(targetActId);

    if (!fromAct || !toAct) return;

    const draggedIndex = fromAct.chapters.findIndex(c => c.id === this.draggedChapter.id);
    const targetIndex = toAct.chapters.findIndex(c => c.id === targetChapterId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    let newTargetIndex = targetIndex;

    // If same act and moving forward, adjust for the removal
    if (this.draggedFromActId === targetActId && draggedIndex < targetIndex) {
      newTargetIndex = targetIndex;
    } else {
      newTargetIndex = targetIndex + 1;
    }

    // Special case: if already immediately after target, insert before instead
    if (this.draggedFromActId === targetActId && draggedIndex === targetIndex + 1) {
      newTargetIndex = targetIndex;
    }

    this.bookData.moveChapter(this.draggedFromActId, this.draggedChapter.id, targetActId, newTargetIndex);
    this.onUpdate();
  }

  handleDragEnd(e, card) {
    card.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    this.draggedChapter = null;
    this.draggedFromActId = null;
  }
}
