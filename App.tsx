import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { Loader } from './components/Loader';
import { CodePreview } from './components/CodePreview';
import { GithubPublisher } from './components/GithubPublisher';
import { SuccessDisplay } from './components/SuccessDisplay';
import { generateWebsiteCode } from './services/geminiService';
import { createRepoAndPushFiles } from './services/githubService';
import { AppState, GeneratedFile } from './types';
import { GithubIcon } from './components/icons';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [suggestedRepoName, setSuggestedRepoName] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for your website.');
      setAppState(AppState.ERROR);
      return;
    }
    setError(null);
    setAppState(AppState.GENERATING);
    try {
      const { files, suggestedRepoName } = await generateWebsiteCode(prompt);
      setGeneratedFiles(files);
      setSuggestedRepoName(suggestedRepoName);
      setAppState(AppState.GENERATED);
    } catch (e) {
      console.error(e);
      setError('Failed to generate website. Please check the console for details.');
      setAppState(AppState.ERROR);
    }
  }, [prompt]);

  const handlePublish = useCallback(async (token: string, repoName: string) => {
    if (!token.trim() || !repoName.trim()) {
      setError('GitHub token and repository name are required.');
      setAppState(AppState.ERROR);
      return;
    }
    setError(null);
    setPublishError(null);
    setAppState(AppState.PUBLISHING);
    try {
      const url = await createRepoAndPushFiles(token, repoName, generatedFiles);
      setRepoUrl(url);
      setAppState(AppState.PUBLISHED);
    } catch (e) {
      console.error(e);
      const errorMessage = (e as Error).message;
      if (errorMessage.includes('name already exists')) {
        setPublishError('This repository name already exists on your account. Please choose another one.');
        setAppState(AppState.GENERATED);
      } else {
        setError(`Failed to publish to GitHub. Make sure your token has 'repo' scope. Error: ${errorMessage}`);
        setAppState(AppState.ERROR);
      }
    }
  }, [generatedFiles]);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setPrompt('');
    setGeneratedFiles([]);
    setSuggestedRepoName('');
    setRepoUrl('');
    setError(null);
    setPublishError(null);
  };
  
  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return <PromptForm prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} />;
      case AppState.GENERATING:
        return <Loader text="Weaving your code with AI magic... this may take a moment." />;
      case AppState.GENERATED:
        return (
          <>
            <CodePreview files={generatedFiles} />
            <GithubPublisher onPublish={handlePublish} initialRepoName={suggestedRepoName} error={publishError} />
          </>
        );
      case AppState.PUBLISHING:
        return <Loader text="Publishing to GitHub... creating repository and committing files." />;
      case AppState.PUBLISHED:
        return <SuccessDisplay repoUrl={repoUrl} onReset={handleReset} />;
      case AppState.ERROR:
        return (
          <div className="text-center p-8 bg-red-900/20 rounded-lg border border-red-500">
            <h2 className="text-2xl font-bold text-red-400 mb-4">An Error Occurred</h2>
            <p className="text-red-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
            >
              Start Over
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        {renderContent()}
      </main>
      <footer className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500">
          <p className="text-sm">Built by a world-class senior frontend engineer.</p>
          <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 text-sm hover:text-indigo-400 transition-colors">
            <GithubIcon className="w-4 h-4" />
            Powered by Gemini API
          </a>
        </div>
      </footer>
    </div>
  );
}