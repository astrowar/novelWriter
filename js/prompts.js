/**
 * Prompts Module - Multi-language prompt templates
 * 
 * Manages prompt templates for different languages loaded from external JSON files
 * Currently supports: Portuguese (pt-BR) and English (en-US)
 */
class PromptsLibrary {
  constructor() {
    this.prompts = {};
    this.metadata = {};
    this.loadedLanguages = new Set();
  }

  /**
   * Load prompts for a specific language from JSON file
   * @private
   * @param {string} language - Language code (pt-BR, en-US, etc.)
   * @returns {Promise<Object>} Prompts object for the language
   */
  async _loadLanguageFile(language) {
    try {
      const response = await fetch(`./data/prompts-${language}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Store metadata
      this.metadata[language] = data.metadata;
      
      // Store prompts
      this.prompts[language] = data.prompts;
      this.loadedLanguages.add(language);
      
      console.log(`Loaded prompts for ${language} (v${data.metadata.version})`);
      return data.prompts;
    } catch (error) {
      console.error(`Error loading prompts for ${language}:`, error);
      return null;
    }
  }

  /**
   * Get prompts for a specific language
   * @param {string} language - Language code (pt-BR, en-US, etc.)
   * @returns {Promise<Object>} Prompts object for the language
   */
  async getPromptsForLanguage(language) {
    const lang = this._normalizeLanguageCode(language);
    
    // Load if not already loaded
    if (!this.loadedLanguages.has(lang)) {
      await this._loadLanguageFile(lang);
    }
    
    if (this.prompts[lang]) {
      return this._clonePrompts(this.prompts[lang]);
    }
    
    // Fallback to Portuguese if language not found
    console.warn(`Language ${language} not found, falling back to pt-BR`);
    if (!this.loadedLanguages.has('pt-BR')) {
      await this._loadLanguageFile('pt-BR');
    }
    return this._clonePrompts(this.prompts['pt-BR']);
  }

  /**
   * Get metadata for a specific language
   * @param {string} language - Language code (pt-BR, en-US, etc.)
   * @returns {Object|null} Metadata object or null if not loaded
   */
  getMetadata(language) {
    const lang = this._normalizeLanguageCode(language);
    return this.metadata[lang] || null;
  }

  /**
   * Get available languages
   * @returns {Array} Array of language objects with code and name
   */
  getAvailableLanguages() {
    return [
      { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
      { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' }
    ];
  }

  /**
   * Preload all available languages
   * @returns {Promise<void>}
   */
  async preloadAllLanguages() {
    const languages = this.getAvailableLanguages();
    const promises = languages.map(lang => this._loadLanguageFile(lang.code));
    await Promise.all(promises);
  }

  /**
   * Normalize language code
   * @private
   */
  _normalizeLanguageCode(code) {
    if (!code) return 'pt-BR';
    
    // Convert common variations
    const normalized = code.toLowerCase().replace('_', '-');
    
    if (normalized.startsWith('pt')) return 'pt-BR';
    if (normalized.startsWith('en')) return 'en-US';
    
    return code;
  }

  /**
   * Deep clone prompts object
   * @private
   */
  _clonePrompts(prompts) {
    return JSON.parse(JSON.stringify(prompts));
  }
}

// Make PromptsLibrary available globally
window.PromptsLibrary = PromptsLibrary;
