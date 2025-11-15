import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, User, MapPin, Book, Lightbulb, Box, ScrollText, FileText } from 'lucide-react';
import { useBook } from '../context/BookContext';
import { CodexEditorPanel } from './CodexEditorPanel';
import { CodexEntry } from '../types/book';

interface CodexSidebarProps {
  selectedEntry: string | null;
  onSelectEntry: (id: string) => void;
}

const ICON_MAP: Record<string, any> = {
  'Character': User,
  'Locals': MapPin,
  'Plots': Book,
  'Object': Box,
  'Lore': ScrollText,
  'Other': FileText,
};

export function CodexSidebar({ selectedEntry, onSelectEntry }: CodexSidebarProps) {
  const { bookData, setBookData } = useBook();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string>('');
  const [editingEntry, setEditingEntry] = useState<CodexEntry | null>(null);

  // Initialize expanded sections from categories
  useEffect(() => {
    if (bookData.codex.categories.length > 0) {
      setExpandedSections(new Set(bookData.codex.categories));
    }
  }, [bookData.codex.categories]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddEntry = (category: string) => {
    setEditingCategory(category);
    setEditingEntry(null);
    setIsEditorOpen(true);
  };

  const handleEditEntry = (entry: CodexEntry) => {
    setEditingCategory(entry.category);
    setEditingEntry(entry);
    setIsEditorOpen(true);
  };

  const handleSaveEntry = (entry: Omit<CodexEntry, 'id'>) => {
    if (editingEntry) {
      // Update existing entry
      setBookData({
        ...bookData,
        codex: {
          ...bookData.codex,
          entries: bookData.codex.entries.map(e =>
            e.id === editingEntry.id
              ? { ...entry, id: editingEntry.id }
              : e
          ),
        },
      });
    } else {
      // Add new entry
      const newEntry: CodexEntry = {
        ...entry,
        id: Date.now(),
      };

      setBookData({
        ...bookData,
        codex: {
          ...bookData.codex,
          entries: [...bookData.codex.entries, newEntry],
        },
      });
    }
  };

  const handleDeleteEntry = (entryId: number) => {
    setBookData({
      ...bookData,
      codex: {
        ...bookData.codex,
        entries: bookData.codex.entries.filter(e => e.id !== entryId),
      },
    });
    handleCloseEditor();
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingEntry(null);
    setEditingCategory('');
  };

  return (
    <div className="flex flex-shrink-0">
      <aside className="w-80 flex-shrink-0 flex flex-col bg-white">
        <div className="px-12 py-12">
          <h1 className="text-black uppercase tracking-widest text-xs">Codex</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-12">
          {bookData.codex.categories.map((category) => {
            const isExpanded = expandedSections.has(category);
            const Icon = ICON_MAP[category] || FileText;
            const categoryEntries = bookData.codex.entries.filter((e) => e.category === category);

            return (
              <div key={category} className="mb-10">
                <button
                  onClick={() => toggleSection(category)}
                  className="flex items-center gap-3 w-full text-black hover:opacity-70 mb-4 uppercase text-xs tracking-widest"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <Icon className="w-4 h-4" />
                  <span>{category}</span>
                </button>

                {isExpanded && (
                  <div className="ml-0 space-y-1 mb-8">
                    {categoryEntries.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => handleEditEntry(entry)}
                        className={`block w-full text-left px-0 py-1.5 text-sm transition-opacity ${
                          selectedEntry === entry.id.toString()
                            ? 'text-black opacity-100'
                            : 'text-neutral-500 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {entry.name}
                      </button>
                    ))}
                    <button
                      onClick={() => handleAddEntry(category)}
                      className="flex items-center gap-2 w-full text-left px-0 py-1.5 text-sm text-neutral-400 hover:opacity-70 mt-3"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add {category.toLowerCase()}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {isEditorOpen && (
        <CodexEditorPanel
          isOpen={isEditorOpen}
          onClose={handleCloseEditor}
          onSave={handleSaveEntry}
          onDelete={editingEntry ? () => handleDeleteEntry(editingEntry.id) : undefined}
          category={editingCategory}
          editEntry={editingEntry}
        />
      )}
    </div>
  );
}