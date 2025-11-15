import { useState } from 'react';
import { Save, MoreVertical } from 'lucide-react';

export function EditorPanel() {
  const [content, setContent] = useState(
    `Chapter One\n\nThe rain fell in sheets against the windows of the old manor, each drop a whisper of secrets long buried. Aria stood in the great hall, her fingers tracing the worn spine of the ancient tome she'd discovered in the library's forgotten corner.\n\nShe had always known this place held mysteries, but nothing could have prepared her for what she was about to uncover...`
  );
  const [title, setTitle] = useState('Chapter One');

  return (
    <main className="flex-1 min-w-[500px] flex flex-col bg-white">
      <header className="bg-white px-16 py-12 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border-none outline-none text-black uppercase tracking-widest text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:opacity-70 transition-opacity">
            <Save className="w-4 h-4 text-black" />
          </button>
          <button className="p-2 hover:opacity-70 transition-opacity">
            <MoreVertical className="w-4 h-4 text-black" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto px-16 py-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[calc(100vh-300px)] bg-transparent border-none outline-none resize-none text-black leading-loose"
            placeholder="Start writing..."
          />
        </div>
      </div>

      <footer className="bg-white px-16 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-neutral-400 uppercase tracking-widest">
          <span>Auto-saved 2 min ago</span>
          <span>1,247 words</span>
        </div>
      </footer>
    </main>
  );
}