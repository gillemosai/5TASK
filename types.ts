export type KanbanColumn = 'todo' | 'doing' | 'done';

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
  createdAt: number; // Timestamp
  subTasks?: SubTask[];
}

export enum Mood {
  HAPPY = 'HAPPY',
  THINKING = 'THINKING',
  EXCITED = 'EXCITED',
  SHOCKED = 'SHOCKED',
}

export type QuoteType = 'welcome' | 'add' | 'complete' | 'delete' | 'full' | 'idle';