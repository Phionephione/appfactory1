import React from 'react';
import { WandIcon, InfoIcon } from './icons';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  onGenerate: () => void;
}

export const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, apiKey, setApiKey, onGenerate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Describe Your Dream Website</h2>
        <p className="text-gray-400 mt-2">
          Tell our AI what you want to build. Be as descriptive as possible!
        </p>
      </div>

      <div className="bg-gray-700/50 p-4 rounded-lg flex items-start gap-3 text-sm text-gray-400">
        <InfoIcon className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
            To generate code, you'll need a Gemini API Key. Your key is used to call the Google AI API directly from your browser and is not stored.
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline ml-1">Get your key from Google AI Studio.</a>
        </div>
      </div>

      <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-1">
            Gemini API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google Gemini API Key"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
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
        disabled={!prompt.trim() || !apiKey.trim()}
      >
        <WandIcon className="w-5 h-5" />
        Generate Website
      </button>
    </div>
  );
};