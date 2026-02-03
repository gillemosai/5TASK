import React, { useState } from 'react';
import { ArrowLeft, Plus, ChevronRight, ChevronLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { Task, SubTask, KanbanColumn } from '../types';

interface KanbanBoardProps {
  task: Task;
  onClose: () => void;
  onUpdateSubtasks: (subTasks: SubTask[]) => void;
  isRotated?: boolean; // Deprecated but kept for compatibility
  isSidebar?: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ task, onClose, onUpdateSubtasks, isSidebar = false }) => {
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

    const newSubTask: SubTask = {
      id: crypto.randomUUID(),
      text: newItemText.trim(),
      column: 'todo',
      createdAt: Date.now(),
    };

    onUpdateSubtasks([...subTasks, newSubTask]);
    setNewItemText('');
  };

  const moveSubTask = (id: string, direction: 'next' | 'prev') => {
    const item = subTasks.find(st => st.id === id);
    if (!item) return;

    const flow: KanbanColumn[] = ['todo', 'doing', 'done'];
    const currentIndex = flow.indexOf(item.column);
    
    let newIndex = currentIndex;
    if (direction === 'next') newIndex = Math.min(currentIndex + 1, flow.length - 1);
    if (direction === 'prev') newIndex = Math.max(currentIndex - 1, 0);

    if (newIndex !== currentIndex) {
      const updatedSubTasks = subTasks.map(st => 
        st.id === id ? { ...st, column: flow[newIndex] } : st
      );
      onUpdateSubtasks(updatedSubTasks);
    }
  };

  const deleteSubTask = (id: string) => {
    if (window.confirm("Remover esta etapa?")) {
      const updatedSubTasks = subTasks.filter(st => st.id !== id);
      onUpdateSubtasks(updatedSubTasks);
    }
  };

  // Grid responsiveness logic:
  // - On mobile (default): 1 column
  // - On tablets (md): 2 columns
  // - On desktop (lg): 3 columns
  const gridClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="w-full h-full flex flex-col animate-[fadeIn_0.3s_ease-out]">
      {/* Kanban Header */}
      <div className="flex items-center gap-4 mb-6">
        {!isSidebar && (
            <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
            <ArrowLeft size={24} />
            </button>
        )}
        <div className="min-w-0">
           <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 truncate">
             {task.text}
           </h2>
           <p className="text-[10px] md:text-xs text-slate-500 font-mono">Quadro de Planejamento Ágil</p>
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={addSubTask} className="mb-8 relative">
        <input 
          type="text" 
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Adicionar nova etapa..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] placeholder-slate-600 transition-all text-sm md:text-base"
        />
        <button 
          type="submit"
          disabled={!newItemText.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg disabled:opacity-50 disabled:bg-slate-700 transition-all"
        >
          <Plus size={18} />
        </button>
      </form>

      {/* Kanban Columns */}
      <div className={`flex-1 grid ${gridClass} gap-4 overflow-y-auto pb-10 pr-2 scrollbar-thin`}>
        
        {/* Column: TO DO */}
        <div className="flex flex-col bg-slate-900/50 border border-slate-800 rounded-xl p-3 h-fit min-h-[120px]">
          <h3 className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span className="truncate mr-2">A Fazer</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] flex-shrink-0">{columns.todo.length}</span>
          </h3>
          <div className="flex-1 space-y-2">
            {columns.todo.map(item => (
              <div key={item.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-sm flex justify-between items-start gap-2 group hover:border-slate-500 transition-colors">
                <span className="text-sm text-slate-300 break-words leading-tight">{item.text}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => deleteSubTask(item.id)} className="text-slate-600 hover:text-red-400 p-1"><Trash2 size={14}/></button>
                  <button onClick={() => moveSubTask(item.id, 'next')} className="text-slate-400 hover:text-purple-400 p-1"><ChevronRight size={16}/></button>
                </div>
              </div>
            ))}
            {columns.todo.length === 0 && <div className="text-center text-[10px] text-slate-700 py-4 italic">Vazio</div>}
          </div>
        </div>

        {/* Column: DOING */}
        <div className="flex flex-col bg-slate-900/50 border border-orange-900/30 rounded-xl p-3 h-fit min-h-[120px]">
          <h3 className="text-[10px] md:text-xs font-bold text-orange-400 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span className="truncate mr-2">Andamento</span>
            <span className="bg-orange-900/50 px-2 py-0.5 rounded text-[10px] text-orange-200 flex-shrink-0">{columns.doing.length}</span>
          </h3>
          <div className="flex-1 space-y-2">
            {columns.doing.map(item => (
              <div key={item.id} className="bg-orange-950/20 p-3 rounded-lg border border-orange-900/50 shadow-sm flex justify-between items-start gap-2 hover:border-orange-500/50 transition-colors">
                 <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveSubTask(item.id, 'prev')} className="text-slate-500 hover:text-slate-300 p-1"><ChevronLeft size={16}/></button>
                </div>
                <span className="text-sm text-orange-100 break-words flex-1 text-center font-medium leading-tight">{item.text}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveSubTask(item.id, 'next')} className="text-orange-400 hover:text-green-400 p-1"><ChevronRight size={16}/></button>
                </div>
              </div>
            ))}
             {columns.doing.length === 0 && <div className="text-center text-[10px] text-slate-700 py-4 italic">Nada</div>}
          </div>
        </div>

        {/* Column: DONE */}
        <div className="flex flex-col bg-slate-900/50 border border-green-900/30 rounded-xl p-3 h-fit min-h-[120px]">
          <h3 className="text-[10px] md:text-xs font-bold text-green-500 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span className="truncate mr-2">Feito</span>
            <span className="bg-green-900/50 px-2 py-0.5 rounded text-[10px] text-green-200 flex-shrink-0">{columns.done.length}</span>
          </h3>
          <div className="flex-1 space-y-2">
            {columns.done.map(item => (
              <div key={item.id} className="bg-green-950/20 p-3 rounded-lg border border-green-900/50 shadow-sm flex justify-between items-start gap-2 opacity-75 hover:opacity-100 transition-opacity">
                 <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveSubTask(item.id, 'prev')} className="text-slate-500 hover:text-orange-400 p-1"><ChevronLeft size={16}/></button>
                </div>
                <div className="flex-1 flex items-start gap-2">
                   <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                   <span className="text-sm text-green-100/70 break-words line-through decoration-green-500/50 leading-tight">{item.text}</span>
                </div>
                <button onClick={() => deleteSubTask(item.id)} className="text-slate-700 hover:text-red-400 shrink-0 p-1"><Trash2 size={14}/></button>
              </div>
            ))}
             {columns.done.length === 0 && <div className="text-center text-[10px] text-slate-700 py-4 italic">Ainda não</div>}
          </div>
        </div>

      </div>
    </div>
  );
};