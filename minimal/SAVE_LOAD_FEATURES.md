# Save & Load Features

## Features Added

### 1. **File Operations**
- **New Book**: Create a new empty book (warns if unsaved changes)
- **Save**: Save the current book to a JSON file
- **Load**: Load a book from a JSON file

### 2. **Auto-Save**
- Automatically saves every 30 seconds when there are unsaved changes
- Only works when a file path is set (after first manual save)
- Displays an asterisk (*) next to filename when there are unsaved changes

### 3. **Browser Fallback**
- When not running in Electron, falls back to browser file download/upload
- Works seamlessly in both environments

## How to Use

### In Electron App:

1. **Create New Book**
   - Click the "New" button in the top nav
   - Confirms before discarding unsaved changes

2. **Save Book**
   - Click the "Save" button
   - Choose a location and filename
   - File is saved as JSON format
   - Auto-save activates after first save

3. **Load Book**
   - Click the "Load" button
   - Select a JSON file (e.g., `book-data-v2.json`)
   - Book data is loaded into the editor

4. **Auto-Save Indicator**
   - Filename shown in top nav
   - Asterisk (*) indicates unsaved changes
   - Changes auto-save every 30 seconds

### File Format

The app uses the same format as `book-data-v2.json`:

```json
{
  "title": "Book Title",
  "codex": {
    "categories": ["Character", "Locals", "Plots", "Object", "Lore", "Other"],
    "entries": [
      {
        "id": 1,
        "name": "Entry Name",
        "category": "Character",
        "description": "Description",
        "tags": ["tag1", "tag2"]
      }
    ]
  },
  "acts": [
    {
      "id": 1,
      "title": "Act Title",
      "chapters": [
        {
          "id": 1,
          "title": "Chapter Title",
          "numbering": true,
          "visibleInFinal": true,
          "sections": [
            {
              "id": 1,
              "title": "Section Title",
              "summary": "Section summary",
              "content": "Section content",
              "tags": ["tag1"]
            }
          ]
        }
      ]
    }
  ]
}
```

## Implementation Details

### Files Created/Modified:

1. **`src/types/book.ts`** - TypeScript type definitions
2. **`src/context/BookContext.tsx`** - React context for book state management
3. **`electron/main.ts`** - IPC handlers for file operations
4. **`electron/preload.ts`** - Exposed APIs to renderer
5. **`electron/electron.d.ts`** - TypeScript definitions for Electron API
6. **`src/components/TopNav.tsx`** - UI for save/load buttons
7. **`src/App.tsx`** - Wrapped with BookProvider

### Key Features:

- **React Context**: Centralized book state management
- **Auto-save**: Periodic saves every 30 seconds
- **Dirty Flag**: Tracks unsaved changes
- **Electron IPC**: Secure communication between processes
- **Browser Fallback**: Works without Electron
- **Type Safety**: Full TypeScript support

## Next Steps

To integrate with existing components:

1. Import `useBook` hook in your components
2. Use `bookData` to access book content
3. Use `setBookData` to update book content
4. Changes are automatically tracked and saved

Example:
```tsx
import { useBook } from '../context/BookContext';

function YourComponent() {
  const { bookData, setBookData } = useBook();

  // Read data
  const title = bookData.title;

  // Update data
  const updateTitle = (newTitle: string) => {
    setBookData({ ...bookData, title: newTitle });
  };

  return <div>{title}</div>;
}
```
