import { GeneratedFile } from '../types';

const GITHUB_API_URL = 'https://api.github.com';

interface GithubUser {
  login: string;
}

interface CreateRepoResponse {
  html_url: string;
  name: string;
  owner: {
    login: string;
  };
  default_branch: string;
}

interface RefResponse {
  object: {
    sha: string;
  };
}

interface CreateBlobResponse {
  sha: string;
}

interface GitTreeItem {
  path: string;
  mode: '100644';
  type: 'blob';
  sha: string;
}

interface CreateTreeResponse {
    sha: string;
}

interface CreateCommitResponse {
    sha: string;
}

const githubApiRequest = async <T,>(endpoint: string, token: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.message || 'Unknown error';
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            // Extract more specific error messages if available
            const specificError = errorData.errors[0].message;
            errorMessage = `${errorMessage} (Details: ${specificError})`;
        }
        throw new Error(`GitHub API Error (${response.status}): ${errorMessage}`);
    }
    
    if(response.status === 204) { // No Content
        return {} as T;
    }

    return response.json() as Promise<T>;
};

export const createRepoAndPushFiles = async (
  token: string,
  repoName: string,
  files: GeneratedFile[]
): Promise<string> => {
  // 1. Get authenticated user
  const user = await githubApiRequest<GithubUser>('/user', token);
  const owner = user.login;

  // 2. Create the repository with auto-init to avoid empty repo issues.
  const repoData = await githubApiRequest<CreateRepoResponse>('/user/repos', token, {
    method: 'POST',
    body: JSON.stringify({
      name: repoName,
      description: 'AI-generated website by AI Web Weaver',
      private: false,
      auto_init: true,
    }),
  });

  // 3. Get the SHA of the initial commit created by auto_init
  const baseRef = await githubApiRequest<RefResponse>(
    `/repos/${owner}/${repoName}/git/ref/heads/${repoData.default_branch}`,
    token
  );
  const parentCommitSha = baseRef.object.sha;

  // 4. Create a blob for each file using Base64 encoding
  const blobs = await Promise.all(
    files.map(async (file) => {
      const blobData = await githubApiRequest<CreateBlobResponse>(
        `/repos/${owner}/${repoName}/git/blobs`,
        token,
        {
          method: 'POST',
          body: JSON.stringify({
            content: btoa(unescape(encodeURIComponent(file.content))), // Handle UTF-8 correctly
            encoding: 'base64',
          }),
        }
      );
      return {
        ...file,
        sha: blobData.sha,
      };
    })
  );

  // 5. Create a tree with all blobs
  const tree: GitTreeItem[] = blobs.map((blob) => ({
    path: blob.path,
    mode: '100644',
    type: 'blob',
    sha: blob.sha,
  }));
  
  const treeData = await githubApiRequest<CreateTreeResponse>(`/repos/${owner}/${repoName}/git/trees`, token, {
      method: 'POST',
      body: JSON.stringify({ tree }),
  });

  // 6. Create a new commit with the initial commit as its parent
  const commitData = await githubApiRequest<CreateCommitResponse>(`/repos/${owner}/${repoName}/git/commits`, token, {
      method: 'POST',
      body: JSON.stringify({
          message: 'Initial commit by AI Web Weaver',
          tree: treeData.sha,
          parents: [parentCommitSha],
      }),
  });

  // 7. Update (fast-forward) the main branch to point to the new commit.
  await githubApiRequest(`/repos/${owner}/${repoName}/git/refs/heads/${repoData.default_branch}`, token, {
    method: 'PATCH',
    body: JSON.stringify({
      sha: commitData.sha,
    }),
  });

  return repoData.html_url;
};