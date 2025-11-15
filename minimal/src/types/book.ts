// Type definitions for the book data structure
export interface CodexEntry {
  id: number;
  name: string;
  category: string;
  description: string;
  tags: string[];
}

export interface Codex {
  categories: string[];
  entries: CodexEntry[];
}

export interface Section {
  id: number;
  title: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface Chapter {
  id: number;
  title: string;
  numbering: boolean;
  visibleInFinal: boolean;
  sections: Section[];
}

export interface Act {
  id: number;
  title: string;
  chapters: Chapter[];
}

export interface BookData {
  title: string;
  codex: Codex;
  acts: Act[];
}

// Default empty book data
export const createEmptyBook = (): BookData => ({
  title: 'Untitled Book',
  codex: {
    categories: ['Character', 'Locals', 'Plots', 'Object', 'Lore', 'Other'],
    entries: []
  },
  acts: []
});
