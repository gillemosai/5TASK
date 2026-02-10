
import React, { useState } from 'react';
import { ArrowLeft, Plus, ChevronRight, ChevronLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { Task, SubTask, KanbanColumn } from '../types';

interface KanbanBoardProps {
  task: Task;
  onClose: () => void;
  onUpdateSubtasks: (subTasks: SubTask[]) => void;
  isDarkMode?: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ task, onClose, onUpdateSubtasks, isDarkMode = true }) => {
  const [newItemText, setNewItemText] = useState('');
  const subTasks = task.subTasks || [];

  const columns: Record<KanbanColumn, SubTask[]> = {
    todo: subTasks.filter(st => st.column === 'todo'),
    doing: subTasks.filter(st => st.column === 'doing'),
    done: subTasks.filter(st => st.column === 'done'),
  };

  const addSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newSubTask: SubTask = { id: crypto.randomUUID(), text: newItemText.trim(), column: 'todo', createdAt: Date.now() };
    onUpdateSubtasks([...subTasks, newSubTask]);
    setNewItemText('');
  };

  const moveSubTask = (id: string, direction: 'next' | 'prev') => {
    const item = subTasks.find(st => st.id === id);
    if (!item) return;
    const flow: KanbanColumn[] = ['todo', 'doing', 'done'];
    const currentIndex = flow.indexOf(item.column);
    let newIndex = direction === 'next' ? Math.min(currentIndex + 1, 2) : Math.max(currentIndex - 1, 0);
    if (newIndex !== currentIndex) {
      onUpdateSubtasks(subTasks.map(st => st.id === id ? { ...st, column: flow[newIndex] } : st));
    }
  };

  const deleteSubTask = (id: string) => {
    onUpdateSubtasks(subTasks.filter(st => st.id !== id));
  };

  return (
    <div className="w-full h-full flex flex-col animate-fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
          <ArrowLeft size={24} />
        </button>
        <div className="min-w-0">
          <h2 className={`text-xl font-black truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{task.text}</h2>
          <p className="text-[10px] text-slate-500 font-mono">Quadro de Planejamento</p>
        </div>
      </div>

      <form onSubmit={addSubTask} className="mb-8 relative">
        <input 
          type="text" 
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Adicionar etapa..."
          className={`w-full rounded-xl px-4 py-3 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-purple-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-purple-400'}`}
        />
        <button type="submit" disabled={!newItemText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white p-2 rounded-lg disabled:opacity-50">
          <Plus size={18} />
        </button>
      </form>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto pb-10">
        {(['todo', 'doing', 'done'] as KanbanColumn[]).map(col => (
          <div key={col} className={`flex flex-col border rounded-xl p-3 min-h-[150px] ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex justify-between">
              {col === 'todo' ? 'A Fazer' : col === 'doing' ? 'Fazendo' : 'Feito'}
              <span className="bg-slate-800 px-2 rounded text-white">{columns[col].length}</span>
            </h3>
            <div className="space-y-2">
              {columns[col].map(item => (
                <div key={item.id} className={`p-3 rounded-lg border flex justify-between items-start gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className={`text-sm leading-tight ${col === 'done' ? 'line-through opacity-50' : ''}`}>{item.text}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => deleteSubTask(item.id)} className="text-red-400 p-1"><Trash2 size={14}/></button>
                    <button onClick={() => moveSubTask(item.id, 'next')} className="text-purple-400 p-1"><ChevronRight size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
