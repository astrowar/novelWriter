import { useState } from 'react';
import { FileText, Download } from 'lucide-react';

export function PrintView() {
  const [format, setFormat] = useState('pdf');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTOC, setIncludeTOC] = useState(true);
  const [fontSize, setFontSize] = useState('12');
  const [pageSize, setPageSize] = useState('a4');

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto px-16 py-12">
        <div className="mb-12">
          <h2 className="uppercase tracking-widest text-xs text-black mb-2">Export Settings</h2>
          <p className="text-neutral-500 text-sm">Build and export your final manuscript</p>
        </div>

        <div className="space-y-12">
          {/* Format Selection */}
          <div>
            <label className="block uppercase tracking-widest text-xs text-black mb-4">
              <FileText className="w-3 h-3 inline mr-2" />
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'pdf', label: 'PDF' },
                { value: 'docx', label: 'Word' },
                { value: 'epub', label: 'ePub' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value)}
                  className={`py-4 px-6 transition-colors text-xs uppercase tracking-widest ${
                    format === option.value
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page Settings */}
          <div>
            <label className="block uppercase tracking-widest text-xs text-black mb-4">
              Page Size
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 focus:border-black outline-none transition-colors text-sm text-black"
            >
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">Letter (8.5 × 11 in)</option>
              <option value="a5">A5 (148 × 210 mm)</option>
              <option value="6x9">6 × 9 inches</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block uppercase tracking-widest text-xs text-black mb-4">
              Font Size
            </label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              min="8"
              max="16"
              className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 focus:border-black outline-none transition-colors text-sm text-black"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block uppercase tracking-widest text-xs text-black mb-4">
              Include
            </label>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTOC}
                  onChange={(e) => setIncludeTOC(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-neutral-700">Table of Contents</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-neutral-700">Metadata (Author, Title, Date)</span>
              </label>
            </div>
          </div>

          {/* Statistics */}
          <div className="pt-8 pb-8 border-t border-neutral-200">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-2xl text-black mb-1">23,457</div>
                <div className="text-xs text-neutral-400 uppercase tracking-widest">Words</div>
              </div>
              <div>
                <div className="text-2xl text-black mb-1">6</div>
                <div className="text-xs text-neutral-400 uppercase tracking-widest">Chapters</div>
              </div>
              <div>
                <div className="text-2xl text-black mb-1">94</div>
                <div className="text-xs text-neutral-400 uppercase tracking-widest">Pages</div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div>
            <button className="w-full py-4 bg-black text-white uppercase tracking-widest text-xs hover:opacity-80 transition-opacity flex items-center justify-center gap-3">
              <Download className="w-4 h-4" />
              Export Manuscript
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
