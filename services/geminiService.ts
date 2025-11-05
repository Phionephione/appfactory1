
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedFile } from '../types';

const fileSchema = {
  type: Type.OBJECT,
  properties: {
    path: {
      type: Type.STRING,
      description: 'The full path of the file, e.g., "src/components/Button.tsx".',
    },
    content: {
      type: Type.STRING,
      description: 'The complete content of the file.',
    },
  },
  required: ['path', 'content'],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    files: {
      type: Type.ARRAY,
      items: fileSchema,
      description: 'An array of file objects representing the complete web application.',
    },
    suggestedRepoName: {
      type: Type.STRING,
      description: "A short, descriptive, URL-friendly (kebab-case) repository name based on the prompt, e.g., 'cool-portfolio-site'.",
    },
  },
  required: ['files', 'suggestedRepoName'],
};

const createSystemInstruction = () => `
You are a world-class senior software engineer. Your task is to generate a complete, functional, and production-ready web application based on the user's prompt.

Follow these rules strictly:
1.  **Tech Stack Decision**:
    *   **Prioritize User's Choice**: First and foremost, you MUST use the programming languages, frameworks, and libraries specified by the user in their prompt. For example, if the user asks for "Python and Flask", generate a Python/Flask application. If they ask for "plain HTML, CSS, and JavaScript", you must generate that.
    *   **Default Stack**: If the user does **NOT** specify a tech stack, you should default to a modern, production-ready stack: **React 18+, TypeScript, and Tailwind CSS, built with Vite.**

2.  **Project Structure**: Generate a complete and logical project structure for the chosen tech stack. It MUST include:
    *   All necessary configuration and dependency files (e.g., \`package.json\`, \`vite.config.ts\`, \`requirements.txt\`, etc.).
    *   A \`.gitignore\` file appropriate for the project type (e.g., Node, Python).
    *   A clear entry point (e.g., \`index.html\`, \`main.py\`).
    *   Source code organized into logical directories (e.g., \`src/\`, \`components/\`, \`templates/\`).
    *   A \`README.md\` file that includes a brief project description, setup instructions (\`git clone\`, dependency installation), and how to run the application locally. The instructions must be specific to the generated tech stack.

3.  **Output Format**: Your entire response MUST be a single, valid JSON object that strictly adheres to the provided response schema. The JSON object should contain two keys: "files" (an array of file objects) and "suggestedRepoName" (a string for a URL-friendly repository name based on the prompt).

4.  **Code Quality**: The code must be clean, well-commented where necessary, and follow best practices for the chosen technologies. It should be a fully working, deployable application. No placeholder code or comments like "// TODO".

5.  **Self-Contained**: The generated project must be self-contained and run correctly after a user follows the setup instructions in the generated \`README.md\`.
`;


export const generateWebsiteCode = async (prompt: string): Promise<{ files: GeneratedFile[], suggestedRepoName: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const result = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
        systemInstruction: createSystemInstruction(),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
    }
  });

  const jsonString = result.text.trim();
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.files && Array.isArray(parsed.files) && typeof parsed.suggestedRepoName === 'string' && parsed.suggestedRepoName) {
      // Ensure README.md is present
      if (!parsed.files.some((f: GeneratedFile) => f.path.toLowerCase() === 'readme.md')) {
        throw new Error("Generated code is missing a README.md file.");
      }
      return { files: parsed.files, suggestedRepoName: parsed.suggestedRepoName };
    }
    throw new Error("Invalid JSON structure received from API. Missing 'files' or 'suggestedRepoName'.");
  } catch(e) {
    console.error("Failed to parse Gemini response:", e);
    console.error("Raw response:", jsonString);
    throw new Error("Could not parse the generated code. The API might have returned an invalid format.");
  }
};