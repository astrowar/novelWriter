import { Save, FolderOpen, FileText } from 'lucide-react';
import { useBook } from '../context/BookContext';

interface TopNavProps {
  activeView: 'overview' | 'write' | 'ia' | 'print';
  onViewChange: (view: 'overview' | 'write' | 'ia' | 'print') => void;
}

export function TopNav({ activeView, onViewChange }: TopNavProps) {
  const { saveBook, loadBook, newBook, isDirty, currentFilePath } = useBook();

  const navItems = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'write' as const, label: 'Write' },
    { id: 'ia' as const, label: 'IA' },
    { id: 'print' as const, label: 'Print' },
  ];

  return (
    <nav className="bg-white px-12 py-8 border-b border-neutral-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="uppercase tracking-widest text-xs text-black mr-8">
            Book Editor
          </div>
          <div className="flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`uppercase tracking-widest text-xs transition-opacity ${
                  activeView === item.id
                    ? 'text-black opacity-100'
                    : 'text-neutral-400 opacity-70 hover:opacity-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {currentFilePath && (
            <span className="text-xs text-neutral-400 mr-2">
              {currentFilePath.split('/').pop()}{isDirty ? ' *' : ''}
            </span>
          )}
          <button
            onClick={newBook}
            className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black transition-colors"
            title="New Book"
          >
            <FileText className="w-4 h-4" />
            <span>New</span>
          </button>
          <button
            onClick={loadBook}
            className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-black transition-colors"
            title="Load Book"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Load</span>
          </button>
          <button
            onClick={saveBook}
            className={`flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest transition-colors ${
              isDirty
                ? 'text-black bg-neutral-100'
                : 'text-neutral-600 hover:text-black'
            }`}
            title="Save Book"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
