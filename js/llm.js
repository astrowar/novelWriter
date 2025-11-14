/**
 * LLM Module - Integration with OpenAI-compatible APIs
 *
 * Manages AI-powered text generation and manipulation features.
 *
 * @class LLMManager
 * @description Provides a comprehensive interface for interacting with OpenAI-compatible APIs
 *
 * Features:
 * - Configurable API endpoint and authentication
 * - Multiple customizable prompt templates
 * - Text generation, summarization, expansion, and rewriting
 * - Point of view transformation
 * - Persistent configuration and prompt storage
 */
class LLMManager {
  // Storage keys
  static CONFIG_KEY = 'llmConfig';
  static PROMPTS_KEY = 'llmCustomPrompts';

  // Default configuration
  static DEFAULT_CONFIG = {
    apiUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000
  };

  constructor() {
    this.config = { ...LLMManager.DEFAULT_CONFIG };
    this.defaultPrompts = this._initializeDefaultPrompts();
    this.prompts = this._clonePrompts(this.defaultPrompts);

    this._loadConfiguration();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize default prompt templates
   * @private
   * @returns {Object} Default prompts object
   */
  _initializeDefaultPrompts() {
    return {
      generate: {
        name: 'Generate Section Text',
        systemPrompt: 'You are a creative writer specialized in engaging narratives.',
        userPrompt: `Based on the following summary, write the complete text for the narrative section:

Summary: {summary}

Book Context:
Title: {bookTitle}
Chapter: {chapterTitle}
Section: {sectionTitle}

Tags/Themes: {tags}

Write a detailed and engaging narrative text that develops this summary.`
      },
      summarize: {
        name: 'Summarize Text',
        systemPrompt: 'You are an assistant who creates concise and informative summaries.',
        userPrompt: `Create a concise summary of the following text, capturing the main points:

{text}

Create a summary in a single paragraph.`
      },
      expand: {
        name: 'Expand Text',
        systemPrompt: 'You are a creative writer who adds details and depth to narratives.',
        userPrompt: `Expand the following text, adding more details, descriptions, and development:

{text}

Maintain the original style and tone, but make the narrative richer and more detailed.`
      },
      rewrite: {
        name: 'Rewrite Text',
        systemPrompt: 'You are an experienced editor who improves writing quality.',
        userPrompt: `Rewrite the following text improving clarity, flow, and narrative impact:

{text}

Keep the same information and tone, but improve the writing quality.`
      },
      changePOV: {
        name: 'Change Point of View',
        systemPrompt: 'You are an expert in narrative and literary points of view.',
        userPrompt: `Rewrite the following text changing the point of view to: {targetPOV}

Original text:
{text}

Keep the content and events, but adapt the narrative perspective.`
      },
      continueStory: {
        name: 'Continue Story',
        systemPrompt: 'You are a creative writer who naturally continues narratives.',
        userPrompt: `Continue the following story in a natural and engaging way:

{text}

Write the next paragraph or section, maintaining the style and tone.`
      },
      addDialogue: {
        name: 'Add Dialogue',
        systemPrompt: 'You are an expert at writing natural and engaging dialogue.',
        userPrompt: `Add natural dialogue to the following narrative text:

{text}

Insert dialogues between characters that are relevant and natural to the context.`
      },
      improveDescription: {
        name: 'Improve Descriptions',
        systemPrompt: 'You are an expert at creating vivid and sensory descriptions.',
        userPrompt: `Improve the descriptions in the following text, adding more sensory details:

{text}
Add more vivid descriptions of settings, characters, and environments.`
      }
    };
  }

  /**
   * Deep clone prompts object
   * @private
   */
  _clonePrompts(prompts) {
    return JSON.parse(JSON.stringify(prompts));
  }

  /**
   * Load all configuration and prompts from storage
   * @private
   */
  _loadConfiguration() {
    this._loadConfig();
    this._loadCustomPrompts();
  }

  // ============================================================================
  // CONFIGURATION MANAGEMENT
  // ============================================================================

  /**
   * Load configuration from localStorage
   * @private
   */
  _loadConfig() {
    const saved = localStorage.getItem(LLMManager.CONFIG_KEY);
    if (saved) {
      try {
        this.config = { ...this.config, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Error loading LLM config:', error);
      }
    }
  }

  /**
   * Save configuration to localStorage
   * @private
   */
  _saveConfig() {
    localStorage.setItem(LLMManager.CONFIG_KEY, JSON.stringify(this.config));
  }

  /**
   * Update configuration
   * @param {Object} newConfig - Configuration updates
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this._saveConfig();
  }

  /**
   * Get current configuration (returns a copy)
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Validate configuration completeness
   * @returns {Object} { valid: boolean, missing: string[] }
   */
  validateConfig() {
    const missing = [];
    if (!this.config.apiUrl) missing.push('apiUrl');
    if (!this.config.apiKey) missing.push('apiKey');
    if (!this.config.model) missing.push('model');

    return {
      valid: missing.length === 0,
      missing
    };
  }

  // ============================================================================
  // PROMPT MANAGEMENT
  // ============================================================================

  /**
   * Get a specific prompt by action key
   * @param {string} actionKey - The prompt action identifier
   * @returns {Object|null} Prompt object with name and template
   */
  getPrompt(actionKey) {
    const prompt = this.prompts[actionKey];
    if (!prompt) return null;

    return {
      name: prompt.name,
      template: `${prompt.systemPrompt}\n\n${prompt.userPrompt}`
    };
  }

  /**
   * Get list of available prompts for UI
   * @returns {Array} Array of prompt objects
   */
  getAvailablePrompts() {
    return Object.keys(this.prompts).map(key => ({
      action: key,
      name: this.prompts[key].name,
      template: `${this.prompts[key].systemPrompt}\n\n${this.prompts[key].userPrompt}`
    }));
  }

  /**
   * Get list of available actions
   * @returns {Array} Array of action objects with key and name
   */
  getAvailableActions() {
    return Object.keys(this.prompts).map(key => ({
      key,
      name: this.prompts[key].name
    }));
  }

  /**
   * Update a prompt template
   * @param {string} actionKey - The prompt action identifier
   * @param {string} templateString - New template (system\n\nuser format)
   */
  updatePrompt(actionKey, templateString) {
    if (!this.prompts[actionKey]) {
      console.warn(`Prompt not found: ${actionKey}`);
      return;
    }

    // Split template into system and user prompts
    const parts = templateString.split('\n\n');

    if (parts.length >= 2) {
      this.prompts[actionKey].systemPrompt = parts[0];
      this.prompts[actionKey].userPrompt = parts.slice(1).join('\n\n');
    } else {
      // If no clear separator, treat it all as user prompt
      this.prompts[actionKey].userPrompt = templateString;
    }

    this._saveCustomPrompts();
  }

  /**
   * Reset prompt to default
   * @param {string} actionKey - The prompt action identifier
   */
  resetPrompt(actionKey) {
    if (!this.defaultPrompts[actionKey]) {
      console.warn(`Default prompt not found: ${actionKey}`);
      return;
    }

    // Reset to default
    this.prompts[actionKey] = this._clonePrompts({
      [actionKey]: this.defaultPrompts[actionKey]
    })[actionKey];

    // Update storage
    this._removeCustomPrompt(actionKey);
  }

  /**
   * Load custom prompts from localStorage
   * @private
   */
  _loadCustomPrompts() {
    const saved = localStorage.getItem(LLMManager.PROMPTS_KEY);
    if (!saved) return;

    try {
      const customPrompts = JSON.parse(saved);
      for (const key in customPrompts) {
        if (this.prompts[key]) {
          this.prompts[key] = { ...customPrompts[key] };
        }
      }
    } catch (error) {
      console.error('Error loading custom prompts:', error);
    }
  }

  /**
   * Save all custom prompts to localStorage
   * @private
   */
  _saveCustomPrompts() {
    const customPrompts = {};

    for (const key in this.prompts) {
      customPrompts[key] = {
        systemPrompt: this.prompts[key].systemPrompt,
        userPrompt: this.prompts[key].userPrompt,
        name: this.prompts[key].name
      };
    }

    localStorage.setItem(LLMManager.PROMPTS_KEY, JSON.stringify(customPrompts));
  }

  /**
   * Remove a specific custom prompt from storage
   * @private
   */
  _removeCustomPrompt(actionKey) {
    const saved = localStorage.getItem(LLMManager.PROMPTS_KEY);
    if (!saved) return;

    try {
      const customPrompts = JSON.parse(saved);
      delete customPrompts[actionKey];
      localStorage.setItem(LLMManager.PROMPTS_KEY, JSON.stringify(customPrompts));
    } catch (error) {
      console.error('Error removing custom prompt:', error);
    }
  }

  /**
   * Replace variables in prompt template
   * @private
   * @param {string} template - Template string with {variable} placeholders
   * @param {Object} variables - Variable values to replace
   * @returns {string} Filled template
   */
  _fillPromptTemplate(template, variables) {
    let filled = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{${key}}`, 'g');
      filled = filled.replace(regex, value || '');
    }

    return filled;
  }

  // ============================================================================
  // API UTILITIES
  // ============================================================================

  /**
   * Build full API URL with endpoint
   * @private
   * @param {string} endpoint - API endpoint (e.g., '/v1/models')
   * @returns {string} Complete URL
   */
  _buildApiUrl(endpoint) {
    let baseUrl = this.config.apiUrl.replace(/\/+$/, ''); // Remove trailing slashes
    return `${baseUrl}${endpoint}`;
  }

  /**
   * Create authorization headers
   * @private
   * @returns {Object} Headers object
   */
  _createHeaders(includeContentType = false) {
    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`
    };

    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  /**
   * Handle API errors
   * @private
   */
  async _handleApiError(response) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const error = await response.json();
      errorMessage = error.error?.message || error.message || errorMessage;
    } catch (e) {
      // If we can't parse error JSON, use the default message
    }

    throw new Error(errorMessage);
  }

  // ============================================================================
  // API METHODS
  // ============================================================================

  /**
   * Fetch available models from API
   * @returns {Promise<Array>} List of available models
   * @throws {Error} If API key is missing or request fails
   */
  async fetchModels() {
    const validation = this.validateConfig();
    if (!this.config.apiKey) {
      throw new Error('API Key não configurada. Configure a API Key primeiro.');
    }

    try {
      const url = this._buildApiUrl('/v1/models');
      const response = await fetch(url, {
        method: 'GET',
        headers: this._createHeaders()
      });

      if (!response.ok) {
        await this._handleApiError(response);
      }

      const data = await response.json();

      // OpenAI format: { "data": [ { "id": "model-name", ... }, ... ] }
      if (data.data && Array.isArray(data.data)) {
        return data.data.map(model => ({
          id: model.id,
          name: model.id,
          owned_by: model.owned_by || 'unknown'
        }));
      }

      // Alternative format: array of model objects
      if (Array.isArray(data)) {
        return data.map(model => ({
          id: model.id || model.name,
          name: model.id || model.name,
          owned_by: model.owned_by || 'unknown'
        }));
      }

      throw new Error('Formato de resposta inesperado');
    } catch (error) {
      console.error('Error fetching models:', error);
      throw new Error(`Falha ao buscar modelos: ${error.message}`);
    }
  }

  /**
   * Call OpenAI-compatible chat completions API
   * @param {string} systemPrompt - System role prompt
   * @param {string} userPrompt - User role prompt
   * @returns {Promise<Object>} Response with content property
   * @throws {Error} If API key is missing or request fails
   */
  async callAPI(systemPrompt, userPrompt) {
    if (!this.config.apiKey) {
      throw new Error('API Key não configurada. Configure em AI Settings.');
    }

    try {
      const url = this._buildApiUrl('/v1/chat/completions');
      const response = await fetch(url, {
        method: 'POST',
        headers: this._createHeaders(true),
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        })
      });

      if (!response.ok) {
        await this._handleApiError(response);
      }

      const data = await response.json();

      // Extract content from response
      if (data.choices && data.choices.length > 0) {
        return {
          content: data.choices[0].message.content
        };
      }

      throw new Error('Resposta da API sem conteúdo válido');
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }

  /**
   * Call OpenAI-compatible chat completions API with streaming
   * @param {string} systemPrompt - System role prompt
   * @param {string} userPrompt - User role prompt
   * @param {Function} onChunk - Callback function called with each text chunk
   * @param {Function} onComplete - Callback function called when stream completes
   * @param {Function} onError - Callback function called on error
   * @returns {Promise<void>}
   * @throws {Error} If API key is missing or request fails
   */
  async callAPIStream(systemPrompt, userPrompt, onChunk, onComplete, onError) {
    if (!this.config.apiKey) {
      const error = new Error('API Key não configurada. Configure em AI Settings.');
      if (onError) onError(error);
      throw error;
    }

    try {
      const url = this._buildApiUrl('/v1/chat/completions');
      const response = await fetch(url, {
        method: 'POST',
        headers: this._createHeaders(true),
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          stream: true
        })
      });

      if (!response.ok) {
        await this._handleApiError(response);
      }

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode the chunk
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();

          // Skip empty lines and comments
          if (!trimmedLine || trimmedLine.startsWith(':')) continue;

          // Parse SSE format: "data: {...}"
          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6);

            // Check for stream end
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;

              if (content) {
                fullContent += content;
                if (onChunk) onChunk(content, fullContent);
              }
            } catch (e) {
              console.warn('Error parsing SSE chunk:', e);
            }
          }
        }
      }

      if (onComplete) onComplete(fullContent);

    } catch (error) {
      console.error('API stream error:', error);
      if (onError) onError(error);
      throw error;
    }
  }

  // ============================================================================
  // HIGH-LEVEL TEXT OPERATIONS
  // ============================================================================

  /**
   * Execute a prompt action with variables
   * @private
   * @param {string} actionKey - The prompt action identifier
   * @param {Object} variables - Variables to fill in the template
   * @returns {Promise<Object>} API response
   */
  async _executePrompt(actionKey, variables) {
    const prompt = this.prompts[actionKey];
    if (!prompt) {
      throw new Error(`Prompt não encontrado: ${actionKey}`);
    }

    const userPrompt = this._fillPromptTemplate(prompt.userPrompt, variables);
    return await this.callAPI(prompt.systemPrompt, userPrompt);
  }

  /**
   * Generate text for a section
   * @param {Object} section - Section object with summary and tags
   * @param {Object} chapter - Chapter object with title
   * @param {string} bookTitle - Book title
   * @returns {Promise<Object>} Generated text content
   */
  async generateSectionText(section, chapter, bookTitle) {
    return await this._executePrompt('generate', {
      summary: section.summary || '',
      bookTitle: bookTitle || '',
      chapterTitle: chapter.title || '',
      sectionTitle: section.title || '',
      tags: (section.tags || []).join(', ')
    });
  }

  /**
   * Summarize text
   * @param {string} text - Text to summarize
   * @returns {Promise<Object>} Summarized text
   */
  async summarizeText(text) {
    return await this._executePrompt('summarize', { text });
  }

  /**
   * Expand text with more details
   * @param {string} text - Text to expand
   * @returns {Promise<Object>} Expanded text
   */
  async expandText(text) {
    return await this._executePrompt('expand', { text });
  }

  /**
   * Rewrite text for better quality
   * @param {string} text - Text to rewrite
   * @returns {Promise<Object>} Rewritten text
   */
  async rewriteText(text) {
    return await this._executePrompt('rewrite', { text });
  }

  /**
   * Change point of view of text
   * @param {string} text - Text to transform
   * @param {string} targetPOV - Target point of view
   * @returns {Promise<Object>} Transformed text
   */
  async changePOV(text, targetPOV) {
    return await this._executePrompt('changePOV', { text, targetPOV });
  }

  /**
   * Continue story from given text
   * @param {string} text - Text to continue from
   * @returns {Promise<Object>} Continuation text
   */
  async continueStory(text) {
    return await this._executePrompt('continueStory', { text });
  }

  /**
   * Add dialogue to text
   * @param {string} text - Text to enhance with dialogue
   * @returns {Promise<Object>} Text with added dialogue
   */
  async addDialogue(text) {
    return await this._executePrompt('addDialogue', { text });
  }

  /**
   * Improve descriptions in text
   * @param {string} text - Text to enhance
   * @returns {Promise<Object>} Text with improved descriptions
   */
  async improveDescription(text) {
    return await this._executePrompt('improveDescription', { text });
  }
}
