
export type KanbanColumn = 'todo' | 'doing' | 'done';

export type Priority = 'urgent' | 'attention' | 'critical' | 'none';
export type HighlightColor = 'blue' | 'purple' | 'pink' | 'none';

export interface SubTask {
  id: string;
  text: string;
  column: KanbanColumn;
  createdAt: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subTasks?: SubTask[];
  priority?: Priority;
  highlightColor?: HighlightColor;
}

export enum Mood {
  HAPPY = 'HAPPY',
  THINKING = 'THINKING',
  EXCITED = 'EXCITED',
  SHOCKED = 'SHOCKED',
}

export type QuoteType = 'welcome' | 'add' | 'complete' | 'delete' | 'full' | 'idle';
