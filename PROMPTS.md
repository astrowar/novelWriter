# AI Prompts Documentation

## Overview

NovelWriter includes a comprehensive set of AI prompts designed to assist with various aspects of creative writing. The prompts are stored in external JSON files for easy editing and maintenance, available in multiple languages.

## Supported Languages

- **Portuguese (pt-BR)** - Português Brasileiro
- **English (en-US)** - American English

The language setting is automatically synchronized with your book's language preference. Change it using the language selector (🌐) next to the book title.

## Prompt Files Structure

Prompts are stored in JSON files located in the `data/` directory:

- `data/prompts-pt-BR.json` - Portuguese prompts
- `data/prompts-en-US.json` - English prompts

### JSON File Format

Each prompt file contains:

```json
{
  "metadata": {
    "language": "pt-BR",
    "languageName": "Português (Brasil)",
    "version": "1.0.0",
    "lastUpdate": "2025-11-15",
    "author": "NovelWriter Team",
    "description": "Prompts description"
  },
  "prompts": {
    "promptKey": {
      "name": "Prompt Display Name",
      "systemPrompt": "AI role and context",
      "userPrompt": "Instructions with {variables}"
    }
  }
}
```

### Metadata Fields

- **language**: Language code (ISO 639-1 + ISO 3166-1)
- **languageName**: Full language name for display
- **version**: Semantic version (MAJOR.MINOR.PATCH)
- **lastUpdate**: Date of last modification (YYYY-MM-DD)
- **author**: Creator/maintainer of the prompts
- **description**: Brief description of the prompt set

---

## Available Prompts

### 1. Generate Section Text (Gerar Texto da Seção)

**Purpose:** Generate complete narrative text from a summary or outline.

**Use Case:** 
- Converting outlines into full prose
- Expanding brief ideas into complete scenes
- Creating first drafts from notes

**Variables:**
- `{summary}` - Section summary or outline
- `{bookTitle}` - Your book's title
- `{chapterTitle}` - Current chapter title
- `{sectionTitle}` - Current section title
- `{tags}` - Relevant tags/themes

**Example Input:**
```
Summary: John meets Emma for the first time at a café
Tags: John, Emma, Café, First Meeting
```

---

### 2. Summarize Text (Resumir Texto)

**Purpose:** Create concise summaries of longer text passages.

**Use Case:**
- Creating chapter summaries
- Condensing long sections
- Generating quick reference notes

**Variables:**
- `{text}` - The text to summarize

---

### 3. Expand Text (Expandir Texto)

**Purpose:** Add detail, description, and development to existing text.

**Use Case:**
- Enriching sparse descriptions
- Adding sensory details
- Developing scenes further
- Increasing word count meaningfully

**Variables:**
- `{text}` - The text to expand

---

### 4. Rewrite Text (Reescrever Texto)

**Purpose:** Improve writing quality, clarity, and flow.

**Use Case:**
- Editing rough drafts
- Improving prose style
- Fixing awkward phrasing
- Enhancing narrative impact

**Variables:**
- `{text}` - The text to rewrite

---

### 5. Change Point of View (Mudar Ponto de Vista)

**Purpose:** Convert narrative perspective (first person ↔ third person, etc.).

**Use Case:**
- Experimenting with different POVs
- Adapting scenes for different characters
- Finding the right narrative voice

**Variables:**
- `{text}` - The original text
- `{targetPOV}` - Desired point of view (e.g., "first person", "third person limited")

**Example:**
```
Original: "I walked into the room and saw her standing by the window."
Target POV: Third person limited
Result: "John walked into the room and saw her standing by the window."
```

---

### 6. Continue Story (Continuar História)

**Purpose:** Generate natural continuation of narrative.

**Use Case:**
- Overcoming writer's block
- Exploring story possibilities
- Maintaining narrative momentum

**Variables:**
- `{text}` - The text to continue from

---

### 7. Add Dialogue (Adicionar Diálogo)

**Purpose:** Insert natural, relevant dialogue into narrative passages.

**Use Case:**
- Breaking up exposition
- Revealing character personality
- Creating interaction between characters
- Adding dramatic tension

**Variables:**
- `{text}` - The narrative text to enhance with dialogue

**Note:** 
- Portuguese uses travessões (—) for dialogue
- English uses quotation marks (" ")

---

### 8. Improve Descriptions (Melhorar Descrições)

**Purpose:** Enhance sensory details and create vivid imagery.

**Use Case:**
- Making scenes more immersive
- Adding atmosphere
- Engaging reader senses
- Avoiding tell-don't-show issues

**Variables:**
- `{text}` - The text to enhance

**Focus Areas:**
- Visual details
- Sounds and acoustics
- Smells and scents
- Textures and tactile sensations
- Tastes (when relevant)

---

### 9. Create Scene (Criar Cena)

**Purpose:** Build complete dramatic scenes from basic information.

**Use Case:**
- Creating new scenes from scratch
- Developing plot points
- Writing pivotal moments

**Variables:**
- `{context}` - Scene context and background
- `{characters}` - Characters involved
- `{objective}` - What the scene should accomplish

**Structure:**
- Beginning (setup)
- Middle (development/conflict)
- End (resolution/transition)

---

### 10. Develop Character (Desenvolver Personagem)

**Purpose:** Add psychological depth and character-specific details.

**Use Case:**
- Revealing character motivations
- Showing internal conflict
- Adding emotional layers
- Differentiating character voices

**Variables:**
- `{text}` - The scene or text
- `{character}` - Character to develop

**Elements Added:**
- Internal thoughts
- Emotional reactions
- Character-specific perceptions
- Motivations and goals

---

### 11. Add Tension (Adicionar Tensão)

**Purpose:** Increase dramatic tension and suspense.

**Use Case:**
- Making scenes more engaging
- Building towards climax
- Creating page-turning moments
- Raising stakes

**Variables:**
- `{text}` - The text to enhance

**Techniques:**
- Introducing obstacles
- Creating uncertainty
- Revealing information gradually
- Heightening conflict
- Using time pressure

---

### 12. Adjust Pacing (Ajustar Ritmo)

**Purpose:** Control narrative speed and rhythm.

**Use Case:**
- Fixing pacing issues
- Creating varied reading experience
- Matching pace to content

**Variables:**
- `{text}` - The text to adjust
- `{pacingType}` - Desired pacing:
  - **Fast:** Short sentences, direct action, minimal description
  - **Slow:** Long sentences, detailed description, reflection
  - **Balanced:** Mix of both styles

**Examples:**

**Fast Pacing:**
```
She ran. Footsteps behind her. Faster. Turn the corner. Keep going.
```

**Slow Pacing:**
```
She moved through the ancient hallway, her fingers trailing along 
the cold stone walls as memories flooded her mind, each step echoing 
in the vast emptiness of the forgotten palace.
```

---

## Customizing Prompts

### Accessing Prompt Editor

1. Open the AI Panel (🤖 icon in toolbar)
2. Scroll to "Available Actions" section
3. Click "Edit" button next to any prompt
4. Modify system prompt or user prompt
5. Click "Save" to apply changes

### Best Practices for Custom Prompts

1. **Be Specific:** Clear instructions yield better results
2. **Use Variables:** Include relevant context variables
3. **Set Expectations:** Tell the AI what style/tone to use
4. **Provide Examples:** Show the AI what you want
5. **Test Iterations:** Try different versions to see what works best

### Resetting Prompts

Click the "Reset to Default" button in the prompt editor to restore original prompts.

---

## Tips for Best Results

### General Guidelines

1. **Provide Context:** The more context in your variables, the better the output
2. **Be Clear:** Specific requests produce more accurate results
3. **Iterate:** Use prompts multiple times with refinements
4. **Combine Prompts:** Use multiple prompts in sequence (generate → expand → add dialogue)
5. **Edit Output:** AI is a tool, not a replacement for your creativity

### Language-Specific Notes

#### Portuguese (pt-BR)
- Prompts use formal, literary Brazilian Portuguese
- Dialogue uses travessões (—) as per Brazilian convention
- Cultural references and expressions are appropriate to Brazilian context

#### English (en-US)
- Prompts use American English spelling and conventions
- Dialogue uses double quotation marks (" ")
- Style is literary and suitable for creative fiction

---

## Workflow Examples

### Example 1: Creating a New Scene from Scratch

1. **Create Scene** prompt with context
2. **Add Dialogue** to make it more engaging
3. **Develop Character** to add depth
4. **Improve Descriptions** for sensory detail
5. Manual editing and refinement

### Example 2: Improving an Existing Draft

1. **Rewrite Text** for better quality
2. **Add Tension** to increase engagement
3. **Adjust Pacing** to match desired rhythm
4. **Improve Descriptions** for vividness
5. Final polish

### Example 3: Expanding an Outline

1. **Generate Section Text** from outline
2. **Expand Text** to add detail
3. **Add Dialogue** where appropriate
4. **Develop Character** for key characters
5. **Adjust Pacing** for variety

---

## Technical Details

### Prompt Structure

Each prompt consists of two parts:

1. **System Prompt:** Sets the AI's role and expertise
   ```
   You are a creative writer specialized in engaging narratives.
   ```

2. **User Prompt:** Contains instructions and variable placeholders
   ```
   Write a detailed narrative based on: {summary}
   Context: {bookTitle}, {chapterTitle}
   ```

### Variable Substitution

Variables in curly braces `{variableName}` are automatically replaced with:
- Book metadata (title, chapter, section)
- User-provided content (text, summaries)
- Context information (tags, characters)

---

## Troubleshooting

### AI Output Not in Expected Language

**Solution:** Check book language setting (🌐) and ensure it matches your desired output language.

### Prompts Not Appearing

**Solution:** Ensure `prompts.js` is loaded before `llm.js` in the HTML file.

### Custom Prompts Lost

**Solution:** Custom prompts are saved in localStorage. Clear browser cache cautiously.

### Poor Quality Output

**Solutions:**
- Provide more context in variables
- Be more specific in instructions
- Try different temperature settings in AI config
- Use a different/better language model
- Refine the prompt template

---

## Future Enhancements

Planned features for prompt system:

- [ ] Additional languages (Spanish, French, German)
- [ ] Genre-specific prompt sets (mystery, romance, sci-fi)
- [ ] Custom prompt templates export/import
- [ ] Community prompt library
- [ ] Prompt chaining/workflows
- [ ] Voice/style presets per character

---

## Contributing

To add support for a new language:

1. Create a new JSON file: `data/prompts-[language-code].json`
2. Copy the structure from an existing prompt file
3. Update the metadata section with new language information
4. Translate all prompt templates to the target language
5. Add the language to `getAvailableLanguages()` in `js/prompts.js`
6. Add the language option to the HTML select in `index.html`
7. Test all prompts thoroughly

### Example: Adding Spanish Support

**Step 1:** Create `data/prompts-es-ES.json`

```json
{
  "metadata": {
    "language": "es-ES",
    "languageName": "Español (España)",
    "version": "1.0.0",
    "lastUpdate": "2025-11-15",
    "author": "Your Name",
    "description": "Prompts de IA optimizados para escritura creativa en español"
  },
  "prompts": {
    "generate": {
      "name": "Generar Texto de Sección",
      "systemPrompt": "Eres un escritor creativo especializado en narrativas cautivadoras.",
      "userPrompt": "Basándote en el siguiente resumen, escribe el texto completo..."
    }
    // ... more prompts
  }
}
```

**Step 2:** Update `js/prompts.js`

```javascript
getAvailableLanguages() {
  return [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' }  // NEW
  ];
}
```

**Step 3:** Update `index.html`

```html
<select id="book-language">
  <option value="pt-BR">🇧🇷 Português</option>
  <option value="en-US">🇺🇸 English</option>
  <option value="es-ES">🇪🇸 Español</option>  <!-- NEW -->
</select>
```

### Editing Existing Prompts

To modify prompts:

1. **Via JSON Files (Permanent):**
   - Edit the appropriate `data/prompts-*.json` file
   - Update the `version` and `lastUpdate` fields in metadata
   - Save the file
   - Refresh the application

2. **Via UI (Session Only):**
   - Open AI Panel
   - Click "Edit" on any prompt
   - Modify and save
   - Changes stored in localStorage

---

## License

These prompts are part of NovelWriter and are distributed under the MIT License.

---

**Last Updated:** November 2025  
**Version:** 1.0.0
