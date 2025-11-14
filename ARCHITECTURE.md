# Novel Writer - Architecture Documentation

## Overview
Electron-based novel writing application with modular, component-based architecture.
Features include drag-and-drop organization, codex system for worldbuilding, and tag-based filtering.

## Project Structure

```
novelWriter/
├── index.html              # Main HTML structure and styles
├── main.js                 # Electron main process
├── renderer.js             # (Legacy - can be removed)
├── package.json            # Project dependencies
├── data/                   # Data files
│   └── book-data.json      # Book content (title, codex, acts, chapters)
└── js/                     # Modular JavaScript components
    ├── app.js              # Main application controller
    ├── data.js             # Data model and state management
    ├── codex.js            # Codex/worldbuilding system
    ├── filter.js           # Tag-based filtering system
    ├── renderer.js         # UI rendering logic
    ├── dragdrop.js         # Drag and drop functionality
    ├── modals.js           # Modal dialogs management
    ├── editor.js           # Inline editing capabilities
    ├── section-editor.js   # Section content editor
    └── events.js           # Event handlers
```

## Architecture

### 1. Main Controller (`app.js`)
- **NovelWriterApp Class**: Application entry point and coordinator
- Initializes and coordinates all sub-modules
- Manages application lifecycle
- Handles book title editing
- Setup codex and filter event handlers
- **Lines of code**: ~242 lines

### 2. Data Layer (`data.js` + `data/book-data.json`) ✨ REFACTORED
- **BookData Class**: Manages entire book structure
- **Separation of concerns**: Data separated from code
- Loads book data from external JSON file (`book-data.json`)
- Persists changes to localStorage (browser limitation)
- CRUD operations for acts, chapters, and sections
- Centralized data access and manipulation
- **Benefits**:
  - Easy to edit book content without touching code
  - Better version control for content vs code
  - Possibility to load different books
  - Data portability

### 3. Presentation Layer (`renderer.js`)
- **UIRenderer Class**: HTML generation and DOM manipulation
- Separates rendering logic from business logic
- Pure rendering functions (no side effects)
- Methods for rendering acts, chapters, sections

### 4. Filter System (`filter.js`) ✨ NEW
- **FilterManager Class**: Tag-based filtering with autocomplete
- Features:
  - Autocomplete dropdown for available tags
  - Multiple tag selection with AND logic
  - Keyboard navigation (↑↓ Enter Esc)
  - Visual feedback with selected tag badges
  - Integration with codex system
- **Lines of code**: ~300 lines

### 5. Codex System (`codex.js`)
- **Codex Class**: Worldbuilding and reference management

#### Inline Editing (`editor.js`)
- **InlineEditor Class**: Double-click editing
- Chapter title editing
- Act title editing
- Inline input replacement

#### Section Editor (`section-editor.js`)
- **SectionEditor Class**: Section content editing
- Opens writing panel for section content
- (Full editor to be implemented)

#### Event Handlers (`events.js`)
- **EventHandlers Class**: Coordinates button clicks
- Add chapter/act buttons
- Settings buttons
- Centralized event setup

### 4. Application Layer (`app.js`)
- **NovelWriterApp Class**: Main application controller
- Initializes all modules
- Coordinates between layers
- Handles application lifecycle

## Module Dependencies

```
app.js
  ├── data.js (BookData)
  ├── renderer.js (UIRenderer)
  ├── dragdrop.js (DragDropManager)
  ├── modals.js (ModalManager, ChapterPropertiesModal)
  ├── editor.js (InlineEditor)
  ├── section-editor.js (SectionEditor)
  └── events.js (EventHandlers)
```

## Key Design Patterns

### 1. Single Responsibility Principle
Each module has one clear purpose:
- Data management
- Rendering
- User interactions
- Event handling

### 2. Separation of Concerns
- Data layer doesn't know about UI
- UI layer doesn't directly modify data
- Interaction layer coordinates between them

### 3. Callback Pattern
Modules use callbacks to notify when re-rendering is needed:
```javascript
new DragDropManager(bookData, () => this.update())
```

### 4. Singleton Data Store
One source of truth for book data:
```javascript
const bookData = new BookData();
```

## Data Flow

```
User Action
    ↓
Event Handler (events.js)
    ↓
Data Modification (data.js)
    ↓
Callback Triggered
    ↓
Re-render (renderer.js)
    ↓
Re-setup Interactions (dragdrop.js, editor.js, etc.)
```

## Features

### Book Structure
- **Acts**: Top-level containers
- **Chapters**: Contained within acts
- **Sections**: Content units within chapters

### Interactions
- ✅ Drag and drop chapter reordering
- ✅ Double-click to edit titles (acts and chapters)
- ✅ Chapter properties modal (numbering, visibility, delete)
- ✅ Add/remove chapters and acts
- ✅ Section tags display
- ✅ Section editor buttons

### Chapter Properties
- **Numbering**: Toggle chapter numbering (for prologues, appendices)
- **Visible in Final Text**: Control inclusion in compilation
- **Delete**: Remove chapter with confirmation

## Future Enhancements

### Section Editor
- Full-screen writing panel
- Rich text editor
- Tags management interface
- Content versioning

### Data Persistence
- Save/load book data
- Auto-save functionality
- Export to various formats

### Additional Features
- Section reordering
- Search and filter
- Statistics and word count
- Multiple book projects

## Development

### Running the Application
```bash
npm start
```

### Code Organization Guidelines
1. Keep modules focused and small
2. Use clear, descriptive class and method names
3. Document complex logic with comments
4. Follow the callback pattern for updates
5. Maintain separation between data and UI

### Adding New Features
1. Identify which layer the feature belongs to
2. Create new module if needed or extend existing
3. Update app.js to initialize new modules
4. Follow the callback pattern for re-rendering
5. Update this README

## Benefits of This Architecture

1. **Maintainability**: Each module is small and focused
2. **Testability**: Modules can be tested independently
3. **Reusability**: Components can be reused across features
4. **Scalability**: Easy to add new features without affecting existing code
5. **Clarity**: Clear separation of concerns makes code easier to understand
6. **Debugging**: Isolated modules make bugs easier to track down

## Migration Notes

The original `renderer.js` file (851 lines) has been refactored into:
- `js/data.js` (245 lines) - Data management
- `js/renderer.js` (104 lines) - UI rendering
- `js/dragdrop.js` (95 lines) - Drag and drop
- `js/modals.js` (150 lines) - Modal dialogs
- `js/editor.js` (120 lines) - Inline editing
- `js/section-editor.js` (40 lines) - Section editor
- `js/events.js` (65 lines) - Event handlers
- `js/app.js` (70 lines) - Application controller

Total: ~889 lines (with better organization and extensibility)

The old `renderer.js` can now be safely removed.
