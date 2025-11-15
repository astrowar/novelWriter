import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BookProvider } from './context/BookContext';
import { TopNav } from './components/TopNav';
import { OverviewView } from './components/OverviewView';
import { WriteView } from './components/WriteView';
import { IAView } from './components/IAView';
import { PrintView } from './components/PrintView';

export default function App() {
  const [activeView, setActiveView] = useState<'overview' | 'write' | 'ia' | 'print'>('write');

  return (
    <BookProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen bg-white">
          <TopNav activeView={activeView} onViewChange={setActiveView} />
          {activeView === 'overview' && <OverviewView />}
          {activeView === 'write' && <WriteView />}
          {activeView === 'ia' && <IAView />}
          {activeView === 'print' && <PrintView />}
        </div>
      </DndProvider>
    </BookProvider>
  );
}