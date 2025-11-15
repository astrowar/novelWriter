import { useState } from 'react';
import { Key, Sparkles } from 'lucide-react';

export function IAView() {
  const [apiKey, setApiKey] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a creative writing assistant. Help the author develop compelling narratives, maintain consistency in character development, and suggest improvements to prose.'
  );
  const [model, setModel] = useState('gpt-4');

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-3xl mx-auto px-16 py-12">
        <div className="mb-12">
          <h2 className="uppercase tracking-widest text-xs text-black mb-2">IA Settings</h2>
          <p className="text-neutral-500 text-sm">Configure AI assistance for your writing</p>
        </div>

        <div className="space-y-12">
          {/* API Configuration */}
          <div>
            <label className="block uppercase tracking-widest text-xs text-black mb-4">
              <Key className="w-3 h-3 inline mr-2" />
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 focus:border-black outline-none transition-colors text-sm text-black"
            />
            <p className="mt-2 text-xs text-neutral-400">
              Your API key is stored locally and never sent to our servers
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block uppercase tracking-widest text-xs text-black mb-4">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 focus:border-black outline-none transition-colors text-sm text-black"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            </select>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block uppercase tracking-widest text-xs text-black mb-4">
              <Sparkles className="w-3 h-3 inline mr-2" />
              System Prompt
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={6}
              className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 focus:border-black outline-none transition-colors text-sm text-black leading-relaxed resize-none"
            />
            <p className="mt-2 text-xs text-neutral-400">
              Define how the AI should assist you with your writing
            </p>
          </div>

          {/* Presets */}
          <div>
            <label className="block uppercase tracking-widest text-xs text-black mb-4">
              Prompt Presets
            </label>
            <div className="space-y-2">
              {[
                'Continue this scene',
                'Describe this character in detail',
                'Suggest plot developments',
                'Improve this paragraph',
                'Check for consistency',
              ].map((preset) => (
                <button
                  key={preset}
                  className="block w-full text-left py-3 px-4 hover:bg-neutral-50 transition-colors text-sm text-neutral-600 hover:text-black"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-8">
            <button className="px-8 py-3 bg-black text-white uppercase tracking-widest text-xs hover:opacity-80 transition-opacity">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
