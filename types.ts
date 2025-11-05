
export interface GeneratedFile {
  path: string;
  content: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  GENERATED = 'GENERATED',
  PUBLISHING = 'PUBLISHING',
  PUBLISHED = 'PUBLISHED',
  ERROR = 'ERROR',
}
