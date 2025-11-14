/**
 * LLM Module - Integration with OpenAI-compatible APIs
 *
 * Provides AI-powered text generation and manipulation features.
 * Features:
 * - Configurable API endpoint and key
 * - Multiple prompt templates for different actions
 * - Generate, summarize, expand, rewrite text
 * - Change point of view
 */
class LLMManager {
  constructor() {
    this.config = {
      apiUrl: 'https://api.openai.com/v1',
      apiKey: '',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 2000
    };

    // Default prompts (immutable)
    this.defaultPrompts = {
      generate: {
        name: 'Gerar Texto da Seção',
        systemPrompt: 'Você é um escritor criativo especializado em narrativas envolventes.',
        userPrompt: `Com base no seguinte resumo, escreva o texto completo da seção narrativa:

Resumo: {summary}

Contexto do Livro:
Título: {bookTitle}
Capítulo: {chapterTitle}
Seção: {sectionTitle}

Tags/Temas: {tags}

Escreva um texto narrativo detalhado e envolvente que desenvolva este resumo.`
      },
      summarize: {
        name: 'Resumir Texto',
        systemPrompt: 'Você é um assistente que cria resumos concisos e informativos.',
        userPrompt: `Crie um resumo conciso do seguinte texto, capturando os pontos principais:

{text}

Crie um resumo em um único parágrafo.`
      },
      expand: {
        name: 'Expandir Texto',
        systemPrompt: 'Você é um escritor criativo que adiciona detalhes e profundidade às narrativas.',
        userPrompt: `Expanda o seguinte texto, adicionando mais detalhes, descrições e desenvolvimento:

{text}

Mantenha o estilo e o tom originais, mas torne a narrativa mais rica e detalhada.`
      },
      rewrite: {
        name: 'Reescrever Texto',
        systemPrompt: 'Você é um editor experiente que melhora a qualidade da escrita.',
        userPrompt: `Reescreva o seguinte texto melhorando a clareza, o fluxo e o impacto narrativo:

{text}

Mantenha a mesma informação e tom, mas melhore a qualidade da escrita.`
      },
      changePOV: {
        name: 'Mudar Ponto de Vista',
        systemPrompt: 'Você é especialista em narrativa e pontos de vista literários.',
        userPrompt: `Reescreva o seguinte texto mudando o ponto de vista para: {targetPOV}

Texto original:
{text}

Mantenha o conteúdo e os eventos, mas adapte a perspectiva narrativa.`
      },
      continueStory: {
        name: 'Continuar História',
        systemPrompt: 'Você é um escritor criativo que dá continuidade natural às narrativas.',
        userPrompt: `Continue a seguinte história de forma natural e envolvente:

{text}

Escreva o próximo parágrafo ou seção, mantendo o estilo e o tom.`
      },
      addDialogue: {
        name: 'Adicionar Diálogo',
        systemPrompt: 'Você é especialista em escrever diálogos naturais e envolventes.',
        userPrompt: `Adicione diálogo natural ao seguinte texto narrativo:

{text}

Insira diálogos entre os personagens que sejam relevantes e naturais ao contexto.`
      },
      improveDescription: {
        name: 'Melhorar Descrições',
        systemPrompt: 'Você é especialista em criar descrições vívidas e sensoriais.',
        userPrompt: `Melhore as descrições no seguinte texto, adicionando mais detalhes sensoriais:

{text}

Adicione descrições mais vívidas de cenários, personagens e ambientes.`
      }
    };

    // Working copy of prompts
    this.prompts = JSON.parse(JSON.stringify(this.defaultPrompts));

    // Load configuration and custom prompts
    this.loadConfig();
    this.loadCustomPrompts();
  }

  /**
   * Load configuration from localStorage
   */
  loadConfig() {
    const saved = localStorage.getItem('llmConfig');
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
   */
  saveConfig() {
    localStorage.setItem('llmConfig', JSON.stringify(this.config));
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Get a specific prompt by action key
   */
  getPrompt(actionKey) {
    return this.prompts[actionKey] ? {
      name: this.prompts[actionKey].name,
      template: this.prompts[actionKey].systemPrompt + '\n\n' + this.prompts[actionKey].userPrompt
    } : null;
  }

  /**
   * Get list of available prompts for UI
   */
  getAvailablePrompts() {
    return Object.keys(this.prompts).map(key => ({
      action: key,
      name: this.prompts[key].name,
      template: this.prompts[key].systemPrompt + '\n\n' + this.prompts[key].userPrompt
    }));
  }

  /**
   * Replace variables in prompt template
   */
  fillPromptTemplate(template, variables) {
    let filled = template;
    for (const [key, value] of Object.entries(variables)) {
      filled = filled.replace(new RegExp(`{${key}}`, 'g'), value || '');
    }
    return filled;
  }

  /**
   * Build full API URL
   */
  buildApiUrl(endpoint) {
    let baseUrl = this.config.apiUrl;

    // Remove trailing slash
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }

    return `${baseUrl}${endpoint}`;
  }  /**
   * Fetch available models from API
   */
  async fetchModels() {
    if (!this.config.apiKey) {
      throw new Error('API Key não configurada. Configure a API Key primeiro.');
    }

    try {
      const url = this.buildApiUrl('/v1/models');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

      // Alternative format: just array of model objects
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
   * Call OpenAI-compatible API
   */
  async callAPI(systemPrompt, userPrompt) {
    if (!this.config.apiKey) {
      throw new Error('API Key não configurada. Configure em AI Settings.');
    }

    const url = this.buildApiUrl('/v1/chat/completions');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
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
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();

    // Return the content with a consistent format
    if (data.choices && data.choices.length > 0) {
      return {
        content: data.choices[0].message.content
      };
    }

    throw new Error('Resposta da API sem conteúdo válido');
  }

  /**
   * Execute a prompt action
   */
  async executePrompt(actionKey, variables) {
    const prompt = this.prompts[actionKey];
    if (!prompt) {
      throw new Error(`Prompt não encontrado: ${actionKey}`);
    }

    const userPrompt = this.fillPromptTemplate(prompt.userPrompt, variables);
    return await this.callAPI(prompt.systemPrompt, userPrompt);
  }

  /**
   * Generate text for a section
   */
  async generateSectionText(section, chapter, bookTitle) {
    return await this.executePrompt('generate', {
      summary: section.summary || '',
      bookTitle: bookTitle || '',
      chapterTitle: chapter.title || '',
      sectionTitle: section.title || '',
      tags: (section.tags || []).join(', ')
    });
  }

  /**
   * Summarize text
   */
  async summarizeText(text) {
    return await this.executePrompt('summarize', { text });
  }

  /**
   * Expand text
   */
  async expandText(text) {
    return await this.executePrompt('expand', { text });
  }

  /**
   * Rewrite text
   */
  async rewriteText(text) {
    return await this.executePrompt('rewrite', { text });
  }

  /**
   * Change point of view
   */
  async changePOV(text, targetPOV) {
    return await this.executePrompt('changePOV', { text, targetPOV });
  }

  /**
   * Continue story
   */
  async continueStory(text) {
    return await this.executePrompt('continueStory', { text });
  }

  /**
   * Add dialogue
   */
  async addDialogue(text) {
    return await this.executePrompt('addDialogue', { text });
  }

  /**
   * Improve descriptions
   */
  async improveDescription(text) {
    return await this.executePrompt('improveDescription', { text });
  }

  /**
   * Get list of available actions
   */
  getAvailableActions() {
    return Object.keys(this.prompts).map(key => ({
      key,
      name: this.prompts[key].name
    }));
  }

  /**
   * Update a prompt template
   */
  updatePrompt(actionKey, templateString) {
    if (this.prompts[actionKey]) {
      // Split template into system and user prompts
      // Expect format: "system prompt\n\nuser prompt"
      const parts = templateString.split('\n\n');
      if (parts.length >= 2) {
        this.prompts[actionKey].systemPrompt = parts[0];
        this.prompts[actionKey].userPrompt = parts.slice(1).join('\n\n');
      } else {
        // If no clear separator, treat it all as user prompt
        this.prompts[actionKey].userPrompt = templateString;
      }

      // Save custom prompts
      const customPrompts = {};
      for (const key in this.prompts) {
        customPrompts[key] = {
          systemPrompt: this.prompts[key].systemPrompt,
          userPrompt: this.prompts[key].userPrompt,
          name: this.prompts[key].name
        };
      }
      localStorage.setItem('llmCustomPrompts', JSON.stringify(customPrompts));
    }
  }

  /**
   * Load custom prompts
   */
  loadCustomPrompts() {
    const saved = localStorage.getItem('llmCustomPrompts');
    if (saved) {
      try {
        const customPrompts = JSON.parse(saved);
        for (const key in customPrompts) {
          if (this.prompts[key]) {
            this.prompts[key].systemPrompt = customPrompts[key].systemPrompt;
            this.prompts[key].userPrompt = customPrompts[key].userPrompt;
          }
        }
      } catch (error) {
        console.error('Error loading custom prompts:', error);
      }
    }
  }

  /**
   * Reset prompt to default
   */
  resetPrompt(actionKey) {
    if (this.defaultPrompts[actionKey]) {
      // Reset to default
      this.prompts[actionKey] = JSON.parse(JSON.stringify(this.defaultPrompts[actionKey]));

      // Remove from custom prompts in storage
      const saved = localStorage.getItem('llmCustomPrompts');
      if (saved) {
        try {
          const customPrompts = JSON.parse(saved);
          delete customPrompts[actionKey];
          localStorage.setItem('llmCustomPrompts', JSON.stringify(customPrompts));
        } catch (error) {
          console.error('Error resetting prompt:', error);
        }
      }
    }
  }
}
