// Drag and Drop Module
class DragDropManager {
  constructor(bookData, onUpdate) {
    this.bookData = bookData;
    this.onUpdate = onUpdate; // Callback to re-render after changes
    this.draggedChapter = null;
    this.draggedFromActId = null;
    this.cardPositions = new Map(); // Store card positions before change
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

  // Capture positions of all cards before re-render (FLIP: First)
  captureCardPositions() {
    this.cardPositions.clear();
    const cards = document.querySelectorAll('.chapter-card');
    cards.forEach(card => {
      const id = card.getAttribute('data-chapter-id');
      const rect = card.getBoundingClientRect();
      this.cardPositions.set(id, {
        x: rect.left,
        y: rect.top
      });
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

    // Capture positions before any changes
    this.captureCardPositions();
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Find the card being hovered (could be nested element)
    const card = e.target.closest('.chapter-card');
    if (card && !card.classList.contains('dragging')) {
      // Remove highlight from all other cards
      document.querySelectorAll('.chapter-card').forEach(c => {
        if (c !== card) {
          c.classList.remove('drag-over');
        }
      });
      // Add highlight to current card
      card.classList.add('drag-over');
    }
  }

  handleDragEnter(e, card) {
    e.preventDefault();
    if (!card.classList.contains('dragging')) {
      card.classList.add('drag-over');
    }
  }

  handleDragLeave(e, card) {
    // Only remove if we're actually leaving the card (not just entering a child)
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !card.contains(relatedTarget)) {
      card.classList.remove('drag-over');
    }
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

    let newTargetIndex;

    if (this.draggedFromActId === targetActId) {
      // Moving within the same act
      if (draggedIndex < targetIndex) {
        // Moving forward: after removal, target shifts down by 1, so use targetIndex directly
        newTargetIndex = targetIndex;
      } else {
        // Moving backward: insert at target position (pushes target forward)
        newTargetIndex = targetIndex;
      }
    } else {
      // Moving between different acts: insert AFTER the target (target stays, dragged goes after)
      newTargetIndex = targetIndex + 1;
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

  // Animate cards with FLIP technique (First, Last, Invert, Play)
  animateMovedCards() {
    if (this.cardPositions.size === 0) return;

    const cards = document.querySelectorAll('.chapter-card');

    cards.forEach(card => {
      const id = card.getAttribute('data-chapter-id');
      const oldPos = this.cardPositions.get(id);

      if (!oldPos) return; // New card, skip animation

      // FLIP: Last - get new position
      const newRect = card.getBoundingClientRect();
      const newPos = {
        x: newRect.left,
        y: newRect.top
      };

      // FLIP: Invert - calculate the difference
      const deltaX = oldPos.x - newPos.x;
      const deltaY = oldPos.y - newPos.y;

      // Skip animation if card didn't move
      if (deltaX === 0 && deltaY === 0) return;

      // FLIP: Play - animate from old position to new
      card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      card.style.transition = 'none';

      // Force reflow
      card.offsetHeight;

      // Animate to new position
      card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      card.style.transform = 'translate(0, 0)';

      // Clean up after animation
      setTimeout(() => {
        card.style.transition = '';
        card.style.transform = '';
      }, 400);
    });

    this.cardPositions.clear();
  }
}
