import { CodexSidebar } from './CodexSidebar';
import { EditorPanel } from './EditorPanel';
import { useState } from 'react';

export function WriteView() {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  return (
    <div className="flex flex-1 overflow-hidden min-w-0">
      <CodexSidebar
        selectedEntry={selectedEntry}
        onSelectEntry={setSelectedEntry}
      />
      <EditorPanel />
    </div>
  );
}
