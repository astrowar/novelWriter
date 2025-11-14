# Configuração de Internacionalização (i18n)

## Visão Geral

O arquivo `i18n-config.js` fornece um sistema de mapeamento de termos multilíngue para identificar diferentes tipos de entradas no Codex. Isso permite que usuários criem entradas em qualquer idioma e o sistema ainda consiga reconhecê-las corretamente.

## Tipos Disponíveis

A configuração suporta os seguintes tipos:

- **character** - Personagens (protagonistas, antagonistas, NPCs)
- **location** - Locais e cenários
- **plot** - Enredos e arcos narrativos
- **object** - Objetos e artefatos
- **lore** - História do mundo, mitologia
- **event** - Eventos específicos
- **organization** - Organizações, grupos, facções
- **concept** - Conceitos abstratos e temas

## Como Funciona

Cada tipo possui duas listas de termos:

### Categories (Categorias)
Termos que identificam a categoria principal de uma entrada. Por exemplo, para `character`:
```javascript
categories: [
  'character',
  'characters',
  'personagem',
  'personagens',
  'pessoa',
  'pessoas'
]
```

### Tags (Etiquetas)
Termos que podem aparecer nas tags de uma entrada. Por exemplo:
```javascript
tags: [
  'character',
  'personagem',
  'pc',
  'npc',
  'protagonist',
  'protagonista'
]
```

## Como Usar

### Filtrando Personagens

```javascript
// No Section Editor, para obter lista de personagens:
const characters = I18nHelper.filterByType(
  this.bookData.data.codex.entries,
  'character'
);
```

### Verificando se Uma Entrada é de um Tipo

```javascript
// Verificar por categoria
const isCharacter = I18nHelper.matchesCategory(entry.category, 'character');

// Verificar por tags
const hasCharacterTag = I18nHelper.matchesTag(entry.tags, 'character');

// Verificar ambos (categoria OU tags)
const isCharacterEntry = I18nHelper.matchesType(entry, 'character');
```

### Listar Todos os Tipos Disponíveis

```javascript
const types = I18nHelper.getAvailableTypes();
// Retorna: ['character', 'location', 'plot', 'object', 'lore', 'event', 'organization', 'concept']
```

## Adicionando Novos Idiomas

Para adicionar suporte a um novo idioma, basta adicionar os termos equivalentes nas listas existentes:

```javascript
character: {
  categories: [
    'character',
    'personagem',
    'キャラクター',  // Japonês
    '角色',          // Chinês
    // ... adicione mais
  ],
  tags: [
    'character',
    'personagem',
    'キャラ',
    '主角',
    // ... adicione mais
  ]
}
```

## Adicionando Novos Tipos

Para adicionar um novo tipo de entrada:

1. Adicione um novo objeto no `I18nConfig`:

```javascript
const I18nConfig = {
  // ... tipos existentes ...

  // Novo tipo
  creature: {
    categories: [
      'creature',
      'creatures',
      'criatura',
      'criaturas',
      'monster',
      'monstro'
    ],
    tags: [
      'creature',
      'criatura',
      'beast',
      'fera',
      'monster',
      'monstro'
    ]
  }
};
```

2. Use o `I18nHelper` para filtrar:

```javascript
const creatures = I18nHelper.filterByType(entries, 'creature');
```

## Exemplo de Uso no Codex

Quando um usuário cria uma entrada no Codex:

```javascript
{
  name: "João Silva",
  category: "Personagem",  // Reconhecido como 'character'
  tags: ["protagonista", "herói"],  // Reconhecidos como character tags
  description: "..."
}
```

Ou em inglês:

```javascript
{
  name: "John Smith",
  category: "Character",  // Reconhecido como 'character'
  tags: ["protagonist", "hero"],  // Reconhecidos como character tags
  description: "..."
}
```

Ambos serão corretamente identificados como personagens pelo sistema.

## Implementação no Scene Editor

No editor de cenas, ao selecionar o narrador:

1. O sistema busca todas as entradas do Codex
2. Usa `I18nHelper.filterByType(entries, 'character')` para filtrar apenas personagens
3. Popula o dropdown com os nomes dos personagens encontrados
4. Funciona independente do idioma usado nas categorias/tags

## Benefícios

- **Multilíngue**: Suporta múltiplos idiomas simultaneamente
- **Flexível**: Fácil adicionar novos termos ou idiomas
- **Consistente**: Centraliza toda a lógica de identificação
- **Extensível**: Simples adicionar novos tipos de entradas
- **Manutenível**: Um único lugar para gerenciar todos os termos

## Manutenção

Para manter a configuração:

1. **Adicione termos comuns** que usuários possam usar
2. **Mantenha consistência** entre categories e tags
3. **Teste diferentes idiomas** para garantir cobertura
4. **Documente mudanças** quando adicionar novos tipos

## Debug

Para verificar o que está sendo reconhecido:

```javascript
// No console do navegador
console.log('Tipos disponíveis:', I18nHelper.getAvailableTypes());

// Ver todas as entradas de um tipo
const chars = I18nHelper.filterByType(bookData.data.codex.entries, 'character');
console.log('Personagens encontrados:', chars);

// Verificar uma entrada específica
const entry = bookData.data.codex.entries[0];
console.log('É personagem?', I18nHelper.matchesType(entry, 'character'));
```
