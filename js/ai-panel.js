/**
 * AI Panel Manager
 * Handles the AI Assistant configuration panel UI
 */
class AIPanelManager {
  constructor() {
    this.panel = document.getElementById('ai-panel');
    this.closeBtn = document.getElementById('ai-panel-close');
    this.saveConfigBtn = document.getElementById('ai-save-config-btn');
    this.testBtn = document.getElementById('ai-test-btn');
    this.fetchModelsBtn = document.getElementById('ai-fetch-models-btn');
    this.promptsList = document.getElementById('ai-prompts-list');

    // Input fields
    this.apiUrlInput = document.getElementById('ai-api-url');
    this.apiKeyInput = document.getElementById('ai-api-key');
    this.modelInput = document.getElementById('ai-model');
    this.temperatureInput = document.getElementById('ai-temperature');
    this.maxTokensInput = document.getElementById('ai-max-tokens');

    // Prompt editor modal
    this.promptModal = document.getElementById('ai-prompt-modal');
    this.promptNameInput = document.getElementById('ai-prompt-name');
    this.promptTemplateInput = document.getElementById('ai-prompt-template');
    this.promptSaveBtn = document.getElementById('ai-prompt-save');
    this.promptCancelBtn = document.getElementById('ai-prompt-cancel');
    this.promptResetBtn = document.getElementById('ai-prompt-reset');

    // Message area
    this.messageArea = document.getElementById('ai-config-message');

    this.llmManager = null;
    this.currentPromptBeingEdited = null;

    this.init();
  }

  init() {
    // Initialize LLM Manager
    this.llmManager = new LLMManager();

    // Load configuration from LLM Manager
    this.loadConfiguration();

    // Render prompts list
    this.renderPrompts();

    // Event listeners
    this.closeBtn.addEventListener('click', () => this.close());
    this.saveConfigBtn.addEventListener('click', () => this.saveConfiguration());
    this.testBtn.addEventListener('click', () => this.testAPI());
    this.fetchModelsBtn.addEventListener('click', () => this.fetchModels());

    // Prompt modal event listeners
    this.promptSaveBtn.addEventListener('click', () => this.savePrompt());
    this.promptCancelBtn.addEventListener('click', () => this.closePromptModal());
    this.promptResetBtn.addEventListener('click', () => this.resetPrompt());

    // Handle ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.promptModal.classList.contains('active')) {
          this.closePromptModal();
        } else if (this.panel.style.display === 'flex') {
          this.close();
        }
      }
    });
  }

  /**
   * Show a message in the config area
   */
  showMessage(message, type = 'info') {
    this.messageArea.textContent = message;
    this.messageArea.className = `ai-config-message ${type}`;
    this.messageArea.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideMessage();
    }, 5000);
  }

  /**
   * Hide the message
   */
  hideMessage() {
    this.messageArea.style.display = 'none';
  }

  /**
   * Load configuration from LLM Manager into UI fields
   */
  loadConfiguration() {
    const config = this.llmManager.getConfig();

    this.apiUrlInput.value = config.apiUrl || '';
    this.apiKeyInput.value = config.apiKey || '';
    this.modelInput.value = config.model || 'gpt-3.5-turbo';
    this.temperatureInput.value = config.temperature || 0.7;
    this.maxTokensInput.value = config.maxTokens || 2000;
  }

  /**
   * Save configuration from UI fields to LLM Manager
   */
  saveConfiguration() {
    const config = {
      apiUrl: this.apiUrlInput.value.trim(),
      apiKey: this.apiKeyInput.value.trim(),
      model: this.modelInput.value.trim() || 'gpt-3.5-turbo',
      temperature: parseFloat(this.temperatureInput.value) || 0.7,
      maxTokens: parseInt(this.maxTokensInput.value) || 2000
    };

    // Validate
    if (!config.apiUrl) {
      this.showMessage('Por favor, insira a URL da API', 'error');
      return;
    }

    if (!config.apiKey) {
      this.showMessage('Por favor, insira a API Key', 'error');
      return;
    }

    // Save to LLM Manager
    this.llmManager.updateConfig(config);

    this.showMessage('✅ Configuração salva com sucesso!', 'success');
  }

  /**
   * Test API connection
   */
  async testAPI() {
    try {
      // Save current config first
      this.saveConfiguration();

      this.testBtn.textContent = '⏳ Testando...';
      this.testBtn.disabled = true;

      // Try a simple prompt
      const result = await this.llmManager.callAPI(
        'Você é um assistente útil.',
        'Responda apenas: "API funcionando"'
      );

      if (result && result.content) {
        this.showMessage('✅ API funcionando! Resposta: ' + result.content, 'success');
      } else {
        this.showMessage('⚠️ API respondeu, mas formato inesperado', 'error');
      }
    } catch (error) {
      this.showMessage('❌ Erro ao testar API: ' + error.message, 'error');
    } finally {
      this.testBtn.textContent = '🔍 Test API';
      this.testBtn.disabled = false;
    }
  }

  /**
   * Fetch available models from API
   */
  async fetchModels() {
    try {
      // Save current config first
      this.saveConfiguration();

      this.fetchModelsBtn.textContent = '⏳ Buscando...';
      this.fetchModelsBtn.disabled = true;

      const models = await this.llmManager.fetchModels();

      if (models && models.length > 0) {
        // Clear existing options except the first one
        this.modelInput.innerHTML = '<option value="">Select a model...</option>';

        // Add fetched models
        models.forEach(model => {
          const option = document.createElement('option');
          option.value = model.id;
          option.textContent = model.id + (model.owned_by ? ` (${model.owned_by})` : '');
          this.modelInput.appendChild(option);
        });

        this.showMessage(`✅ ${models.length} modelos carregados com sucesso!`, 'success');

        // Select the first model if current selection is empty
        if (!this.modelInput.value && models.length > 0) {
          this.modelInput.value = models[0].id;
        }
      } else {
        this.showMessage('⚠️ Nenhum modelo encontrado', 'error');
      }
    } catch (error) {
      this.showMessage('❌ Erro ao buscar modelos: ' + error.message, 'error');
    } finally {
      this.fetchModelsBtn.textContent = '🔄 Get Models';
      this.fetchModelsBtn.disabled = false;
    }
  }

  /**
   * Render available prompts
   */
  renderPrompts() {
    const prompts = this.llmManager.getAvailablePrompts();

    this.promptsList.innerHTML = '';

    prompts.forEach(prompt => {
      const item = document.createElement('div');
      item.className = 'ai-prompt-item';

      const header = document.createElement('div');
      header.className = 'ai-prompt-header';

      const name = document.createElement('div');
      name.className = 'ai-prompt-name';
      name.textContent = prompt.name;

      const editBtn = document.createElement('button');
      editBtn.className = 'ai-prompt-edit-btn';
      editBtn.textContent = '✏️ Editar';
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.editPrompt(prompt.action);
      });

      header.appendChild(name);
      header.appendChild(editBtn);

      const description = document.createElement('div');
      description.className = 'ai-prompt-description';
      description.textContent = prompt.template.substring(0, 150) + '...';

      item.appendChild(header);
      item.appendChild(description);

      this.promptsList.appendChild(item);
    });
  }

  /**
   * Edit a prompt
   */
  editPrompt(action) {
    const prompt = this.llmManager.getPrompt(action);
    if (!prompt) return;

    this.currentPromptBeingEdited = action;
    this.promptNameInput.value = prompt.name;
    this.promptTemplateInput.value = prompt.template;

    // Show modal
    this.promptModal.classList.add('active');
  }

  /**
   * Save edited prompt
   */
  savePrompt() {
    if (!this.currentPromptBeingEdited) return;

    const newTemplate = this.promptTemplateInput.value.trim();

    if (!newTemplate) {
      this.showMessage('Por favor, insira um template válido', 'error');
      return;
    }

    this.llmManager.updatePrompt(this.currentPromptBeingEdited, newTemplate);
    this.renderPrompts();
    this.closePromptModal();
    this.showMessage('✅ Prompt atualizado com sucesso!', 'success');
  }

  /**
   * Reset prompt to default
   */
  resetPrompt() {
    if (!this.currentPromptBeingEdited) return;

    if (confirm('Deseja realmente resetar este prompt para o valor padrão?')) {
      this.llmManager.resetPrompt(this.currentPromptBeingEdited);

      // Reload the prompt in the modal
      const prompt = this.llmManager.getPrompt(this.currentPromptBeingEdited);
      this.promptTemplateInput.value = prompt.template;

      this.renderPrompts();
      this.showMessage('✅ Prompt resetado com sucesso!', 'success');
    }
  }

  /**
   * Close prompt modal
   */
  closePromptModal() {
    this.promptModal.classList.remove('active');
    this.currentPromptBeingEdited = null;
  }

  /**
   * Open the AI panel
   */
  open() {
    this.panel.style.display = 'flex';
    this.loadConfiguration();
    this.renderPrompts();
  }

  /**
   * Close the AI panel
   */
  close() {
    this.panel.style.display = 'none';
  }

  /**
   * Toggle panel visibility
   */
  toggle() {
    if (this.panel.style.display === 'flex') {
      this.close();
    } else {
      this.open();
    }
  }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
  window.AIPanelManager = AIPanelManager;

  // Auto-initialize if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.aiPanelManager = new AIPanelManager();
    });
  } else {
    window.aiPanelManager = new AIPanelManager();
  }
}
