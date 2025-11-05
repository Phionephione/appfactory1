import React, { useState, useEffect } from 'react';
import { GithubIcon, UploadCloudIcon, InfoIcon } from './icons';

interface GithubPublisherProps {
  onPublish: (token: string, repoName: string) => void;
  initialRepoName: string;
  error?: string | null;
}

export const GithubPublisher: React.FC<GithubPublisherProps> = ({ onPublish, initialRepoName, error }) => {
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState(initialRepoName);

  useEffect(() => {
    setRepoName(initialRepoName);
  }, [initialRepoName]);

  const handlePublishClick = () => {
    onPublish(token, repoName);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <GithubIcon className="w-7 h-7" />
            Publish to GitHub
        </h2>
        <p className="text-gray-400 mt-2">Create a new repository with your generated website.</p>
      </div>
      
      <div className="bg-gray-700/50 p-4 rounded-lg flex items-start gap-3 text-sm text-gray-400">
        <InfoIcon className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
            You need a GitHub Personal Access Token (classic) with the <code className="bg-gray-900 px-1 py-0.5 rounded text-indigo-300">repo</code> scope. Your token is used to call the GitHub API directly from your browser and is not stored.
            <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline ml-1">Create a new token here.</a>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="repoName" className="block text-sm font-medium text-gray-400 mb-1">
            Repository Name
          </label>
          <input
            id="repoName"
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value.replace(/\s+/g, '-'))}
            placeholder="my-awesome-ai-website"
            className={`w-full p-2 bg-gray-900 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'
            }`}
            aria-invalid={!!error}
            aria-describedby={error ? "repoName-error" : undefined}
          />
          {error && (
            <p id="repoName-error" className="text-red-400 text-sm mt-2">
              {error}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-400 mb-1">
            GitHub Personal Access Token
          </label>
          <input
            id="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_..."
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <button
        onClick={handlePublishClick}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold text-white transition-colors disabled:bg-indigo-900 disabled:cursor-not-allowed"
        disabled={!token.trim() || !repoName.trim()}
      >
        <UploadCloudIcon className="w-5 h-5" />
        Create Repository & Push
      </button>
    </div>
  );
};