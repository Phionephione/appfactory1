
import React from 'react';
import { WandIcon } from './icons';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, onGenerate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Describe Your Dream Website</h2>
        <p className="text-gray-400 mt-2">
          Tell our AI what you want to build. Be as descriptive as possible!
        </p>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A modern portfolio website for a photographer named 'Alex Doe'. It should have a dark theme, a gallery page with a masonry grid, an about page, and a contact form..."
        className="w-full h-48 p-4 bg-gray-800 border border-gray-700 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
      />
      <button
        onClick={onGenerate}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold text-white transition-colors disabled:bg-indigo-900 disabled:cursor-not-allowed"
        disabled={!prompt.trim()}
      >
        <WandIcon className="w-5 h-5" />
        Generate Website
      </button>
    </div>
  );
};
