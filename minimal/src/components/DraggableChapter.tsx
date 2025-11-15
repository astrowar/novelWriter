import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, MoreVertical, ChevronDown, ChevronRight } from 'lucide-react';

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

interface DraggableChapterProps {
  chapter: Chapter;
  index: number;
  moveChapter: (dragIndex: number, hoverIndex: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function DraggableChapter({
  chapter,
  index,
  moveChapter,
  isExpanded,
  onToggleExpand,
}: DraggableChapterProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'CHAPTER',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveChapter(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'CHAPTER',
    item: () => {
      return { id: chapter.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={preview} style={{ opacity }} data-handler-id={handlerId}>
      <div ref={ref} className="flex items-center gap-4 py-4 hover:bg-neutral-50 transition-colors group cursor-move">
        <GripVertical className="w-4 h-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex-1 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-1 text-neutral-400 text-xs uppercase tracking-widest">
            {chapter.number}
          </div>
          <div className="col-span-5 text-black text-sm">
            {chapter.title}
          </div>
          <div className="col-span-2 text-neutral-500 text-xs uppercase tracking-widest">
            {chapter.scenes.length} Scenes
          </div>
          <div className="col-span-3 text-neutral-500 text-xs uppercase tracking-widest">
            {chapter.wordCount.toLocaleString()} Words
          </div>
          <div className="col-span-1 flex justify-end gap-2">
            <button className="p-1 hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              className="p-1 hover:opacity-70 transition-opacity"
              onClick={onToggleExpand}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Scenes */}
      {isExpanded && (
        <div className="ml-16 mb-4 space-y-1">
          {chapter.scenes.map((scene) => (
            <div
              key={scene.id}
              className="flex items-center gap-4 py-3 hover:bg-neutral-50 transition-colors group"
            >
              <GripVertical className="w-3 h-3 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-neutral-400 text-xs">
                  {scene.number}
                </div>
                <div className="col-span-5 text-neutral-700 text-sm">
                  {scene.title}
                </div>
                <div className="col-span-5 flex flex-wrap gap-1.5">
                  {scene.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="col-span-1 text-neutral-400 text-xs text-right">
                  {scene.wordCount}
                </div>
              </div>
              <button className="p-1 hover:opacity-70 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-3 h-3 text-neutral-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
