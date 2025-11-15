import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { DraggableChapter } from './DraggableChapter';
import { CodexSidebar } from './CodexSidebar';
import { useBook } from '../context/BookContext';

interface Scene {
  id: string;
  number: number;
  title: string;
  wordCount: number;
  tags: string[];
}

interface Chapter {
  id: string;
  act: number;
  number: number;
  title: string;
  scenes: Scene[];
  wordCount: number;
}

export function OverviewView() {
  const { bookData } = useBook();
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  // Helper to calculate word count from sections
  const calculateWordCount = (sections: any[]) => {
    // Estimate: count words in summary + content
    return sections.reduce((total, section) => {
      const summaryWords = section.summary ? section.summary.split(' ').length : 0;
      const contentWords = section.content ? section.content.split(' ').length : 0;
      return total + summaryWords + contentWords;
    }, 0);
  };

  const moveChapter = useCallback((dragIndex: number, hoverIndex: number) => {
    // TODO: Implement chapter reordering with setBookData
    console.log('Move chapter from', dragIndex, 'to', hoverIndex);
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden">
      <CodexSidebar
        selectedEntry={selectedEntry}
        onSelectEntry={setSelectedEntry}
      />
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto px-16 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-black mb-2">{bookData.title}</h1>
        </div>
        <div className="mb-12">
          <h2 className="uppercase tracking-widest text-xs text-black mb-2">Structure</h2>
          <p className="text-neutral-500 text-sm">Acts, Chapters and Scenes</p>
        </div>

        <div className="space-y-16">
          {bookData.acts.map((act) => {
            const totalScenes = act.chapters.reduce((sum, ch) => sum + ch.sections.length, 0);
            const totalWords = act.chapters.reduce((sum, ch) => sum + calculateWordCount(ch.sections), 0);

            return (
              <div key={act.id}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="uppercase tracking-widest text-xs text-black">
                      {act.title}
                    </h3>
                    <div className="text-xs text-neutral-400 uppercase tracking-widest">
                      {act.chapters.length} Chapters · {totalScenes} Scenes · {totalWords.toLocaleString()} Words
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  {act.chapters.map((chapter, index) => {
                    // Convert chapter format to match DraggableChapter expectations
                    const chapterForDisplay = {
                      id: chapter.id,
                      title: chapter.title,
                      act: act.id,
                      number: index + 1,
                      wordCount: calculateWordCount(chapter.sections),
                      scenes: chapter.sections.map(section => ({
                        id: section.id,
                        title: section.title,
                        description: section.summary,
                        tags: section.tags || []
                      }))
                    };

                    return (
                      <DraggableChapter
                        key={chapter.id}
                        chapter={chapterForDisplay}
                        index={index}
                        moveChapter={moveChapter}
                        isExpanded={expandedChapters.has(chapter.id)}
                        onToggleExpand={() => toggleChapter(chapter.id)}
                      />
                    );
                  })}
                  <button className="flex items-center gap-2 py-4 text-neutral-400 hover:text-black transition-opacity text-xs uppercase tracking-widest">
                    <Plus className="w-3 h-3" />
                    <span>Add Chapter</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button className="mt-12 flex items-center gap-2 text-neutral-400 hover:text-black transition-opacity text-xs uppercase tracking-widest">
          <Plus className="w-3 h-3" />
          <span>Add Act</span>
        </button>
      </div>
    </div>
    </div>
  );
}
