# Multi-Language Support Implementation

## Summary

Added comprehensive multi-language support to NovelWriter, allowing users to write books in Portuguese or English with language-specific AI prompts and assistance.

## Files Created

### 1. `js/prompts.js`
**Purpose:** Multi-language prompt library  
**Features:**
- PromptsLibrary class managing prompts for all languages
- Portuguese (pt-BR) prompts - 12 complete templates
- English (en-US) prompts - 12 complete templates
- Language normalization and fallback handling
- Easy extension for additional languages

**Prompt Templates Include:**
1. Generate Section Text - Convert summaries to full prose
2. Summarize Text - Create concise summaries
3. Expand Text - Add detail and depth
4. Rewrite Text - Improve writing quality
5. Change Point of View - Convert narrative perspective
6. Continue Story - Natural story continuation
7. Add Dialogue - Insert character dialogues
8. Improve Descriptions - Enhance sensory details
9. Create Scene - Build complete dramatic scenes
10. Develop Character - Add psychological depth
11. Add Tension - Increase suspense
12. Adjust Pacing - Control narrative rhythm

### 2. `data/book-data-english.json`
**Purpose:** Example book structure in English  
**Content:** Sample book with English content demonstrating the structure

### 3. `PROMPTS.md`
**Purpose:** Complete documentation of AI prompts system  
**Sections:**
- Overview of prompt system
- Detailed explanation of each prompt
- Usage examples and best practices
- Customization guide
- Workflow examples
- Troubleshooting tips

## Files Modified

### 1. `js/llm.js`
**Changes:**
- Integrated PromptsLibrary for multi-language support
- Added `setLanguage()` method to change prompt language
- Added `getLanguage()` method to retrieve current language
- Added `getAvailableLanguages()` method
- Modified constructor to use PromptsLibrary
- Deprecated old `_initializeDefaultPrompts()` method

**New Methods:**
```javascript
_initializePromptsForLanguage(language)
setLanguage(language)
getLanguage()
getAvailableLanguages()
```

### 2. `js/data.js`
**Changes:**
- Added language field support in book data structure
- Modified `loadData()` to ensure language field exists (default: pt-BR)
- Added fallback structure includes language field
- Added `getLanguage()` method
- Added `setLanguage()` method

**New Methods:**
```javascript
getLanguage()
setLanguage(language)
```

### 3. `js/app.js`
**Changes:**
- Added `setupLanguageSelector()` method
- Integrated language selector in initialization
- Language changes update LLM Manager prompts
- Automatic sync between book language and AI prompts

**New Method:**
```javascript
setupLanguageSelector()
```

### 4. `data/book-data.json`
**Changes:**
- Added `"language": "pt-BR"` field to book structure
- Maintains backward compatibility

### 5. `index.html`
**Changes:**
- Added CSS styles for language selector
- Added language dropdown UI component next to book title
- Added `prompts.js` script import
- Modified title-filter-row structure

**New UI Elements:**
```html
<div class="language-selector">
  <span>🌐</span>
  <select id="book-language">
    <option value="pt-BR">🇧🇷 Português</option>
    <option value="en-US">🇺🇸 English</option>
  </select>
</div>
```

### 6. `readme.txt`
**Changes:**
- Added multi-language support to features list
- Updated project structure documentation
- Added "Changing Book Language" section
- Added "Supported Languages" section
- Added reference to PROMPTS.md documentation
- Updated version history

## Technical Architecture

### Language Flow

```
1. User selects language in UI (🌐 selector)
   ↓
2. app.js captures change event
   ↓
3. bookData.setLanguage(newLanguage) updates book data
   ↓
4. llmManager.setLanguage(newLanguage) updates prompts
   ↓
5. PromptsLibrary.getPromptsForLanguage(language) returns localized prompts
   ↓
6. AI operations use language-appropriate prompts
```

### Data Structure

```json
{
  "title": "Book Title",
  "language": "pt-BR",  // NEW FIELD
  "codex": { ... },
  "acts": [ ... ]
}
```

### Module Dependencies

```
PromptsLibrary (prompts.js)
    ↓
LLMManager (llm.js)
    ↓
AIPanelManager (ai-panel.js)
    ↓
User Actions
```

## Benefits

1. **Native Language Support**
   - Writers can work in their native language
   - AI understands cultural and linguistic nuances
   - Proper formatting conventions (dialogue marks, etc.)

2. **Better AI Results**
   - Prompts optimized for each language
   - Genre-appropriate vocabulary
   - Natural-sounding output

3. **Easy Extension**
   - Simple to add new languages
   - All prompts centralized in one module
   - Clear structure for translation

4. **User Experience**
   - Visual language indicator (flags)
   - One-click language switching
   - Automatic prompt adaptation

## Usage

### For Users

1. **Select Language:**
   - Click the 🌐 icon next to book title
   - Choose Portuguese or English
   - AI prompts automatically adapt

2. **Writing in Different Languages:**
   - Each book can have its own language setting
   - Language persists with book data
   - Switch anytime during writing process

### For Developers

1. **Adding a New Language:**

```javascript
// In js/prompts.js, add to _initializePrompts():
'es-ES': this._getSpanishPrompts(),

// Create new method:
_getSpanishPrompts() {
  return {
    generate: {
      name: 'Generar Texto',
      systemPrompt: 'Eres un escritor creativo...',
      userPrompt: 'Basándote en el siguiente resumen...'
    },
    // ... other prompts
  };
}

// Add to getAvailableLanguages():
{ code: 'es-ES', name: 'Español', flag: '🇪🇸' }
```

2. **Customizing Prompts:**
   - Edit prompts directly in AI Panel
   - Or modify `js/prompts.js` for default changes
   - Custom prompts saved in localStorage

## Testing Checklist

- [x] Language selector appears in UI
- [x] Portuguese prompts load correctly
- [x] English prompts load correctly
- [x] Language changes persist in localStorage
- [x] LLM Manager receives language updates
- [x] Book data includes language field
- [x] Default language is pt-BR for new books
- [x] Backward compatibility maintained
- [x] Documentation complete

## Future Enhancements

Potential additions:

1. **More Languages:**
   - Spanish (es-ES)
   - French (fr-FR)
   - German (de-DE)
   - Italian (it-IT)

2. **Advanced Features:**
   - Automatic language detection
   - Translation between languages
   - Mixed-language books (bilingual)
   - Regional variations (pt-PT, en-GB, etc.)

3. **UI Improvements:**
   - Language-specific UI translations
   - Keyboard shortcuts per language
   - Language-specific spell checking

4. **Genre Templates:**
   - Genre-specific prompts per language
   - Cultural adaptation of prompts
   - Regional writing conventions

## Notes

- All prompts are stored in `js/prompts.js` for easy maintenance
- Language setting is per-book, not global
- Custom prompt edits are language-agnostic (apply to current language only)
- Reset prompt functionality restores language-specific defaults

## Backward Compatibility

- Books without `language` field default to `pt-BR`
- All existing functionality preserved
- No breaking changes to API
- Storage format enhanced, not changed

---

**Implementation Date:** November 15, 2025  
**Version:** 1.0.0  
**Developer:** NovelWriter Team
