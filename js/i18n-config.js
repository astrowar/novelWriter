/**
 * Internationalization configuration for codex categories and tags
 * Maps terms in different languages to canonical types
 */

const I18nConfig = {
  // Character/Personagem identification
  character: {
    categories: [
      'character',
      'characters',
      'personagem',
      'personagens',
      'pessoa',
      'pessoas',
      'персонаж', // Russian
      'персонажи',
      'personnage', // French
      'personnages',
      'personaje', // Spanish
      'personajes',
      'personaggio', // Italian
      'personaggi'
    ],
    tags: [
      'character',
      'personagem',
      'pessoa',
      'pc',
      'npc',
      'protagonist',
      'protagonista',
      'antagonist',
      'antagonista',
      'hero',
      'herói',
      'villain',
      'vilão',
      'supporting',
      'secundário'
    ]
  },

  // Location/Place identification
  location: {
    categories: [
      'location',
      'locations',
      'place',
      'places',
      'local',
      'locais',
      'lugar',
      'lugares',
      'setting',
      'cenário',
      'cenários',
      'locale',
      'locales'
    ],
    tags: [
      'location',
      'local',
      'place',
      'lugar',
      'city',
      'cidade',
      'country',
      'país',
      'building',
      'prédio',
      'room',
      'sala'
    ]
  },

  // Plot/Story identification
  plot: {
    categories: [
      'plot',
      'plots',
      'story',
      'stories',
      'enredo',
      'enredos',
      'trama',
      'tramas',
      'storyline',
      'arc',
      'arco'
    ],
    tags: [
      'plot',
      'enredo',
      'trama',
      'story',
      'storyline',
      'arc',
      'arco',
      'subplot',
      'sub-enredo'
    ]
  },

  // Object/Item identification
  object: {
    categories: [
      'object',
      'objects',
      'item',
      'items',
      'objeto',
      'objetos',
      'thing',
      'things',
      'coisa',
      'coisas',
      'artifact',
      'artefato',
      'artefatos'
    ],
    tags: [
      'object',
      'objeto',
      'item',
      'thing',
      'coisa',
      'weapon',
      'arma',
      'tool',
      'ferramenta',
      'artifact',
      'artefato'
    ]
  },

  // Lore/Background identification
  lore: {
    categories: [
      'lore',
      'background',
      'history',
      'história',
      'mundo',
      'world',
      'worldbuilding',
      'mythology',
      'mitologia',
      'legend',
      'lenda',
      'lendas'
    ],
    tags: [
      'lore',
      'história',
      'history',
      'background',
      'world',
      'mundo',
      'mythology',
      'mitologia',
      'legend',
      'lenda'
    ]
  },

  // Event identification
  event: {
    categories: [
      'event',
      'events',
      'evento',
      'eventos',
      'happening',
      'occurrence',
      'ocorrência'
    ],
    tags: [
      'event',
      'evento',
      'battle',
      'batalha',
      'war',
      'guerra',
      'meeting',
      'encontro',
      'ceremony',
      'cerimônia'
    ]
  },

  // Organization/Group identification
  organization: {
    categories: [
      'organization',
      'organizations',
      'organização',
      'organizações',
      'group',
      'groups',
      'grupo',
      'grupos',
      'faction',
      'factions',
      'facção',
      'facções'
    ],
    tags: [
      'organization',
      'organização',
      'group',
      'grupo',
      'faction',
      'facção',
      'guild',
      'guilda',
      'company',
      'companhia'
    ]
  },

  // Concept/Idea identification
  concept: {
    categories: [
      'concept',
      'concepts',
      'conceito',
      'conceitos',
      'idea',
      'ideas',
      'ideia',
      'ideias',
      'theme',
      'themes',
      'tema',
      'temas'
    ],
    tags: [
      'concept',
      'conceito',
      'idea',
      'ideia',
      'theme',
      'tema',
      'philosophy',
      'filosofia'
    ]
  }
};

/**
 * Helper functions to work with i18n config
 */
const I18nHelper = {
  /**
   * Check if a category name matches a type
   * @param {string} category - Category name to check
   * @param {string} type - Type to match (e.g., 'character', 'location')
   * @returns {boolean}
   */
  matchesCategory(category, type) {
    if (!category || !type) return false;

    const config = I18nConfig[type];
    if (!config) return false;

    const categoryLower = category.toLowerCase().trim();
    return config.categories.some(term =>
      term.toLowerCase() === categoryLower
    );
  },

  /**
   * Check if any tag matches a type
   * @param {Array<string>} tags - Array of tags to check
   * @param {string} type - Type to match (e.g., 'character', 'location')
   * @returns {boolean}
   */
  matchesTag(tags, type) {
    if (!tags || !Array.isArray(tags) || tags.length === 0) return false;
    if (!type) return false;

    const config = I18nConfig[type];
    if (!config) return false;

    return tags.some(tag => {
      const tagLower = tag.toLowerCase().trim();
      return config.tags.some(term =>
        term.toLowerCase() === tagLower ||
        tagLower.includes(term.toLowerCase())
      );
    });
  },

  /**
   * Check if an entry matches a type (by category or tags)
   * @param {Object} entry - Codex entry with category and tags
   * @param {string} type - Type to match (e.g., 'character', 'location')
   * @returns {boolean}
   */
  matchesType(entry, type) {
    if (!entry) return false;

    return this.matchesCategory(entry.category, type) ||
           this.matchesTag(entry.tags, type);
  },

  /**
   * Get all entries of a specific type from codex
   * @param {Array<Object>} entries - Array of codex entries
   * @param {string} type - Type to filter (e.g., 'character', 'location')
   * @returns {Array<Object>}
   */
  filterByType(entries, type) {
    if (!entries || !Array.isArray(entries)) return [];

    return entries.filter(entry => this.matchesType(entry, type));
  },

  /**
   * Get available types
   * @returns {Array<string>}
   */
  getAvailableTypes() {
    return Object.keys(I18nConfig);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { I18nConfig, I18nHelper };
}
