import { useState, useEffect, KeyboardEvent } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { CodexEntry } from '../types/book';

interface CodexEditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<CodexEntry, 'id'>) => void;
  onDelete?: () => void;
  category: string;
  editEntry?: CodexEntry | null;
}

export function CodexEditorPanel({
  isOpen,
  onClose,
  onSave,
  onDelete,
  category,
  editEntry
}: CodexEditorPanelProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    if (editEntry) {
      setName(editEntry.name);
      setDescription(editEntry.description);
      setTags(editEntry.tags);
    } else {
      setName('');
      setDescription('');
      setTags([]);
    }
    setCurrentTag('');
  }, [editEntry, isOpen]);

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setCurrentTag('');
      // Auto-save tags
      autoSave(name, description, newTags);
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    // Auto-save after removing tag
    autoSave(name, description, newTags);
  };

  const autoSave = (currentName: string, currentDescription: string, currentTags: string[]) => {
    if (!currentName.trim()) return;

    onSave({
      name: currentName.trim(),
      category,
      description: currentDescription.trim(),
      tags: currentTags
    });
  };

  const handleNameBlur = () => {
    autoSave(name, description, tags);
  };

  const handleDescriptionBlur = () => {
    autoSave(name, description, tags);
  };

  const handleCloseWithSave = () => {
    if (name.trim()) {
      autoSave(name, description, tags);
    }
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setTags([]);
    setCurrentTag('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="w-96 max-w-96 min-w-96 flex-shrink-0 flex flex-col bg-white border-l border-neutral-200 h-full overflow-hidden">
      {/* Header - Only back button */}
      <div className="px-8 py-12">
        <button
          onClick={handleCloseWithSave}
          className="text-neutral-400 hover:text-black transition-colors"
          title="Close and Save"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

  {/* Form */}
  <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-8 py-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder={`Enter ${category.toLowerCase()} name`}
            className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add a description..."
            rows={8}
            className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:border-black transition-colors resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={handleAddTag}
            placeholder="Type and press Enter to add tag"
            className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
          />
          {tags.length > 0 && (
            <div className="mt-3 rounded border border-neutral-200 bg-neutral-50/50 p-2 max-h-28 overflow-y-auto overflow-x-hidden">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-neutral-700 rounded-full text-xs shadow-sm"
                  >
                    <span className="truncate max-w-32">{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-black transition-colors flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Delete button at the very bottom */}
      {onDelete && (
        <div className="px-8 py-6 border-t border-neutral-200 flex justify-center">
          <button
            onClick={onDelete}
            className="text-xs text-neutral-400 hover:text-red-600 transition-colors"
          >
            delete
          </button>
        </div>
      )}
    </div>
  );
}
