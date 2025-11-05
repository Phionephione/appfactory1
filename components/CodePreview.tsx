import React, { useState } from 'react';
import { GeneratedFile } from '../types';
import { FileIcon } from './icons';

interface CodePreviewProps {
  files: GeneratedFile[];
}

export const CodePreview: React.FC<CodePreviewProps> = ({ files }) => {
  const [activeFile, setActiveFile] = useState<string>(files[0]?.path ?? '');

  const getActiveFileContent = () => {
    return files.find(f => f.path === activeFile)?.content || '';
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden my-8">
      <div className="bg-gray-700/50 p-2 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Generated Code</h3>
      </div>
      <div className="flex" style={{ height: '40rem' }}>
        <div className="w-1/4 border-r border-gray-700 bg-gray-800/50 p-2 overflow-y-auto">
          <ul className="space-y-1">
            {files.map(file => (
              <li key={file.path}>
                <button
                  onClick={() => setActiveFile(file.path)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-colors ${
                    activeFile === file.path
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <FileIcon className="w-4 h-4" />
                  {file.path}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4 bg-gray-900">
           <pre className="w-full h-full overflow-auto p-4 text-sm">
              <code className="language-javascript">{getActiveFileContent()}</code>
           </pre>
        </div>
      </div>
    </div>
  );
};