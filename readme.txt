================================================================================
                            NOVEL WRITER
================================================================================

A powerful Electron-based novel writing application with AI integration,
featuring drag-and-drop organization, worldbuilding codex system, and 
intelligent tag-based filtering.

================================================================================
                              FEATURES
================================================================================

📚 HIERARCHICAL STRUCTURE
  • Organize your novel into Acts, Chapters, and Sections
  • Drag-and-drop to reorder elements
  • Inline editing for quick title changes
  
🌐 MULTI-LANGUAGE SUPPORT
  • Portuguese (pt-BR) and English (en-US) support
  • AI prompts adapted to each language
  • Language-specific writing assistance
  • Easy language switching per book
  
🏷️ TAG-BASED FILTERING
  • Filter content by character, location, or custom tags
  • Autocomplete suggestions for existing tags
  • Multiple tag selection with AND logic
  • Keyboard navigation support
  
📖 CODEX SYSTEM
  • Worldbuilding reference management
  • Character profiles and relationships
  • Location descriptions
  • Custom worldbuilding categories
  
🤖 AI INTEGRATION
  • AI-assisted writing panel
  • Content generation support
  • Intelligent suggestions
  
✨ MODERN UI
  • Clean, distraction-free interface
  • Responsive design
  • Modal-based editors
  • Visual feedback for all interactions

================================================================================
                          GETTING STARTED
================================================================================

INSTALLATION
------------
1. Clone the repository:
   git clone <repository-url>
   cd novelWriter

2. Install dependencies:
   npm install

3. Start the application:
   npm start

SYSTEM REQUIREMENTS
-------------------
• Node.js (v14 or higher)
• Electron v39.1.2+
• Windows/macOS/Linux

================================================================================
                          PROJECT STRUCTURE
================================================================================

novelWriter/
├── index.html              Main application UI and styles
├── main.js                 Electron main process
├── renderer.js             Main renderer entry point
├── package.json            Project configuration
│
├── data/                   Data storage
│   ├── book-data.json          Current book structure (Portuguese)
│   ├── book-data-english.json  Example book in English
│   ├── book-data-v2.json       Alternative book version
│   ├── prompts-pt-BR.json      Portuguese AI prompts
│   └── prompts-en-US.json      English AI prompts
│
└── js/                     Modular JavaScript components
    ├── app.js              Application controller (242 lines)
    ├── data.js             Data model & state management
    ├── renderer.js         UI rendering engine
    ├── codex.js            Worldbuilding system
    ├── filter.js           Tag filtering (300 lines)
    ├── dragdrop.js         Drag & drop functionality
    ├── modals.js           Modal dialog manager
    ├── editor.js           Inline editing system
    ├── section-editor.js   Section content editor
    ├── events.js           Event coordination
    ├── ai-panel.js         AI integration panel
    ├── llm.js              LLM API interface
    ├── prompts.js          Multi-language AI prompts
    └── i18n-config.js      Internationalization

================================================================================
                            ARCHITECTURE
================================================================================

MODULAR DESIGN
--------------
The application follows a clean modular architecture with separation of 
concerns:

1. DATA LAYER (data.js + book-data.json)
   • BookData class manages entire book structure
   • External JSON for easy content editing
   • CRUD operations for acts, chapters, sections
   • localStorage persistence

2. PRESENTATION LAYER (renderer.js)
   • UIRenderer class for HTML generation
   • Pure rendering functions
   • No side effects or business logic

3. BUSINESS LOGIC LAYER
   • FilterManager: Tag-based filtering with autocomplete
   • Codex: Worldbuilding reference system
   • InlineEditor: Quick inline editing
   • SectionEditor: Full content editing

4. APPLICATION LAYER (app.js)
   • NovelWriterApp class coordinates all modules
   • Lifecycle management
   • Event coordination

DEPENDENCY FLOW
---------------
app.js
  ├── data.js (BookData)
  ├── renderer.js (UIRenderer)
  ├── filter.js (FilterManager)
  ├── codex.js (Codex)
  ├── dragdrop.js (DragDrop)
  ├── modals.js (ModalManager)
  ├── editor.js (InlineEditor)
  ├── section-editor.js (SectionEditor)
  └── events.js (EventHandlers)

================================================================================
                             USAGE GUIDE
================================================================================

BASIC WORKFLOW
--------------
1. Start the application with 'npm start'
2. Edit book title by double-clicking it
3. Add Acts using the "Add Act" button
4. Add Chapters within each Act
5. Add Sections within each Chapter
6. Use drag-and-drop to reorder elements
7. Double-click titles for inline editing
8. Click sections to edit content

FILTERING CONTENT
-----------------
1. Click the filter icon in the toolbar
2. Type to see autocomplete suggestions
3. Select tags to filter (multiple tags = AND logic)
4. Use ↑↓ arrows to navigate, Enter to select
5. Click tag badges to remove filters
6. Press Esc to close autocomplete

USING THE CODEX
---------------
1. Access the Codex panel from the toolbar
2. Add characters, locations, items, etc.
3. Link codex entries to sections via tags
4. Reference worldbuilding details while writing

AI-ASSISTED WRITING
-------------------
1. Open the AI panel from the toolbar
2. Select a section to work on
3. Use AI suggestions for content generation
4. Integrate AI-generated content into your novel

CHANGING BOOK LANGUAGE
----------------------
1. Use the language selector (🌐) next to the book title
2. Select Portuguese (🇧🇷) or English (🇺🇸)
3. AI prompts automatically adapt to the selected language
4. Write in your preferred language with native AI support

================================================================================
                          DATA MANAGEMENT
================================================================================

DATA STORAGE
------------
• Primary data: data/book-data.json
• Runtime persistence: localStorage
• Automatic save on changes

BOOK DATA STRUCTURE
-------------------
{
  "title": "Book Title",
  "language": "pt-BR",  // or "en-US"
  "codex": { /* worldbuilding entries */ },
  "acts": [
    {
      "id": "unique-id",
      "title": "Act Title",
      "chapters": [
        {
          "id": "unique-id",
          "title": "Chapter Title",
          "sections": [
            {
              "id": "unique-id",
              "content": "Section content",
              "tags": ["character", "location"]
            }
          ]
        }
      ]
    }
  ]
}

SUPPORTED LANGUAGES
-------------------
• Portuguese (pt-BR) - Português Brasileiro
• English (en-US) - American English

The language setting controls:
• AI prompt templates and instructions
• Writing style suggestions
• Content generation language
• Interface language preferences

Prompts are stored in external JSON files:
• data/prompts-pt-BR.json - Portuguese prompts with metadata
• data/prompts-en-US.json - English prompts with metadata

Each file includes version control and update tracking.

BACKUP & RECOVERY
-----------------
• Book data is stored in JSON format
• Easy to backup by copying book-data.json
• Version control friendly
• Can maintain multiple book versions (v1, v2, etc.)

================================================================================
                           DEVELOPMENT
================================================================================

ADDING NEW FEATURES
-------------------
1. Follow the modular architecture
2. Create new module in js/ directory
3. Integrate via app.js controller
4. Update ARCHITECTURE.md with changes

CODE STYLE
----------
• ES6+ JavaScript classes
• Modular design with single responsibility
• Descriptive naming conventions
• Event-driven architecture
• No global variables (except initialization)

REFACTORING NOTES
-----------------
See REFACTORING.md for detailed refactoring history and decisions.
See ARCHITECTURE.md for complete technical documentation.

================================================================================
                        INTERNATIONALIZATION
================================================================================

The application supports internationalization (i18n):
• Configuration: I18N_CONFIG.md
• Implementation: js/i18n-config.js
• Language files can be added for multi-language support

================================================================================
                           QUICK REFERENCE
================================================================================

KEYBOARD SHORTCUTS
------------------
• Double-click: Edit titles inline
• Drag & Drop: Reorder acts, chapters, sections
• Esc: Close modals and autocomplete
• ↑↓: Navigate autocomplete suggestions
• Enter: Select autocomplete item

COMMAND LINE
------------
• npm start          Start the application
• npm test           Run tests (not yet implemented)

FILES TO EDIT
-------------
• data/book-data.json     Your book content
• index.html              UI customization
• js/app.js               Main application logic
• package.json            Project configuration

DOCUMENTATION
-------------
• ARCHITECTURE.md         Technical architecture details
• REFACTORING.md          Refactoring history and decisions
• I18N_CONFIG.md          Internationalization setup
• PROMPTS.md              AI prompts guide and customization
• QUICKREF.md             Quick reference guide

================================================================================
                            LICENSE
================================================================================

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

================================================================================
                            SUPPORT
================================================================================

For questions, issues, or contributions:
• Repository: https://github.com/astrowar/novelWriter
• Issues: Open an issue on GitHub
• Documentation: See ARCHITECTURE.md and other .md files

================================================================================
                          VERSION HISTORY
================================================================================

v1.0.0 (Current)
• Initial release
• Modular architecture with component separation
• Tag-based filtering with autocomplete
• Codex worldbuilding system
• Drag-and-drop organization
• AI integration panel
• Multi-language support (Portuguese & English)
• Language-specific AI prompts
• Internationalization support

================================================================================

Happy Writing! 📖✨
