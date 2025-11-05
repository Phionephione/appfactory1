
import React from 'react';
import { CheckCircleIcon, ExternalLinkIcon } from './icons';

interface SuccessDisplayProps {
  repoUrl: string;
  onReset: () => void;
}

export const SuccessDisplay: React.FC<SuccessDisplayProps> = ({ repoUrl, onReset }) => {
  return (
    <div className="text-center p-8 bg-green-900/20 rounded-lg border border-green-500">
      <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
      <p className="text-green-300 mb-6">Your website has been published to GitHub.</p>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 mb-4 bg-gray-700 hover:bg-gray-600 rounded-md font-semibold text-white transition-colors"
      >
        View Repository
        <ExternalLinkIcon className="w-5 h-5" />
      </a>
      <p className="text-sm text-gray-400 mb-6">You can now clone your repository and deploy it to Vercel or Render.</p>
      <button
        onClick={onReset}
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
      >
        Build Another Website
      </button>
    </div>
  );
};
