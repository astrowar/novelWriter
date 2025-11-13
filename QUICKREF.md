# Novel Writer - Quick Reference

## File Structure

```
📁 novelWriter/
├── 📄 index.html           - HTML structure & CSS styles
├── 📄 main.js              - Electron main process
├── 📄 package.json         - Dependencies
├── 📄 ARCHITECTURE.md      - Detailed architecture documentation
└── 📁 js/                  - Modular components
    ├── 📄 app.js           - Application controller (starts here!)
    ├── 📄 data.js          - Book data model (state)
    ├── 📄 renderer.js      - HTML generation (view)
    ├── 📄 dragdrop.js      - Drag & drop chapters
    ├── 📄 modals.js        - Dialog boxes
    ├── 📄 editor.js        - Inline title editing
    ├── 📄 section-editor.js - Section content editing
    └── 📄 events.js        - Button click handlers
```

## Module Overview

### 📊 Data Layer
**`data.js` - BookData Class**
```javascript
bookData.getBook()                          // Get entire book
bookData.findAct(actId)                     // Find act
bookData.findChapter(actId, chapterId)      // Find chapter
bookData.findSection(actId, chapterId, sectionId) // Find section
bookData.addAct(title)                      // Add new act
bookData.addChapter(actId, title)           // Add new chapter
bookData.updateChapter(actId, chapterId, props) // Update chapter
bookData.deleteChapter(actId, chapterId)    // Delete chapter
bookData.moveChapter(fromActId, chapterId, toActId, targetIndex) // Move
bookData.updateActTitle(actId, title)       // Update act title
```

### 🎨 Presentation Layer
**`renderer.js` - UIRenderer Class**
```javascript
renderer.render()                   // Render entire UI
renderer.renderAct(act, startNum)   // Render single act
renderer.renderChapter(chapter, act, num) // Render chapter card
renderer.renderSection(section, chapter, act) // Render section
```

### 🎯 Interaction Layer

**`dragdrop.js` - DragDropManager**
- Handles chapter reordering via drag & drop
- Works within and across acts

**`modals.js` - ModalManager & ChapterPropertiesModal**
- Text input dialog for names
- Chapter settings (numbering, visibility, delete)

**`editor.js` - InlineEditor**
- Double-click chapter titles to edit
- Double-click act titles to edit

**`section-editor.js` - SectionEditor**
- Full chapter editor with continuous section editing
- Click chapter card or ✎ pencil button to open
- 80% main editor + 20% side notes
- Section info blocks with summary and tags
- Auto-save functionality

**`events.js` - EventHandlers**
- Add chapter buttons
- Add act button
- Chapter settings (⚙) buttons
- Chapter card click to open editor

### 🎮 Application Layer
**`app.js` - NovelWriterApp**
- Main controller
- Initializes all modules
- Coordinates updates

## Data Structure

```javascript
{
  title: "My Novel",
  acts: [
    {
      id: 1,
      title: "Act I: The Beginning",
      chapters: [
        {
          id: 1,
          title: "The Awakening",
          numbering: true,           // Show chapter number?
          visibleInFinal: true,      // Include in compilation?
          sections: [
            {
              id: 1,
              title: "Morning Light",
              summary: "Brief description...",
              content: "Full text...",
              tags: ["action", "morning", "discovery"]
            }
          ]
        }
      ]
    }
  ]
}
```

## User Interactions

### Adding Content
- **Add Chapter**: Click "+ Add Chapter" on any act
- **Add Act**: Click "+ Add New Act" at bottom
- **Add Section**: (Coming soon)

### Editing
- **Edit Chapter Title**: Double-click chapter title
- **Edit Act Title**: Double-click act title
- **Open Chapter Editor**: Click on any chapter card or ✎ pencil button
- **Chapter Settings**: Click ⚙ gear button

### Chapter Editor Features
- **Continuous Editing**: All sections displayed in sequence
- **Section Info Blocks**:
  - Edit section title, summary, and tags
  - Visual header with gradient background
  - Click tag to remove, type to add new tag
- **Main Editor (80%)**:
  - Rich text editing area for each section
  - Auto-save on blur
  - Sections displayed as continuous flow
- **Side Notes (20%)**:
  - Right panel for chapter-wide notes
  - Persistent across all sections

### Organizing
- **Move Chapter**: Drag chapter card to new position
- **Delete Chapter**: Click ⚙ → Delete Chapter

### Chapter Properties
- **Numbering**: Toggle on/off (for Prologue, Epilogue, etc.)
- **Visible in Final**: Toggle to exclude from compilation

## Common Tasks

### To add a new feature:
1. Decide which module it belongs to
2. Add methods to that module
3. If it needs UI updates, use the callback pattern:
   ```javascript
   someAction() {
     // Modify data
     this.bookData.addChapter(...);
     // Trigger re-render
     this.onUpdate();
   }
   ```

### To modify data:
```javascript
// Always go through BookData methods
bookData.updateChapter(actId, chapterId, {
  title: "New Title",
  numbering: false
});
```

### To trigger re-render:
```javascript
// From any module that has onUpdate callback
this.onUpdate(); // Calls app.update() → app.render()
```

## Keyboard Shortcuts

- **Enter**: Confirm modal/save inline edit
- **Escape**: Cancel modal/inline edit
- **Double-click**: Edit titles inline

## Module Loading Order (Important!)

The HTML loads scripts in this order:
1. `data.js` - Creates bookData singleton
2. `renderer.js` - Needs bookData
3. `dragdrop.js` - Needs bookData
4. `modals.js` - Needs bookData
5. `editor.js` - Needs bookData
6. `section-editor.js` - Needs bookData
7. `events.js` - Needs bookData & modals
8. `app.js` - Needs everything, starts the app

## Benefits

✅ **Small files**: Each < 250 lines
✅ **Clear purpose**: Each file does one thing
✅ **Easy to find**: Logical organization
✅ **Easy to test**: Isolated modules
✅ **Easy to extend**: Add features without breaking others

## Next Steps

See `ARCHITECTURE.md` for detailed documentation.
