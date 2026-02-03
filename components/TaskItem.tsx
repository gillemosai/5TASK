import React, { useState } from 'react';
import { Trash2, Check, AlertTriangle, Edit2, X, Save, GripVertical, KanbanSquare } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  index: number;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onOpenKanban: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, position: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, position: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  isActive?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  index, 
  onComplete, 
  onDelete, 
  onEdit,
  onOpenKanban,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isActive
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const isStale = !task.completed && (Date.now() - task.createdAt > 86400000);
  const subtaskCount = task.subTasks?.length || 0;
  const doneSubtasks = task.subTasks?.filter(st => st.column === 'done').length || 0;

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(task.id, editedText);
      setIsEditing(false);
    }
  };

  return (
    <div 
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`relative group mb-3 rounded-2xl border-2 transition-all duration-300 cursor-default
        ${task.completed 
          ? 'bg-slate-900/40 border-slate-800 opacity-60' 
          : isActive 
            ? 'bg-slate-800 border-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.15)] z-10 scale-[1.02]' 
            : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'
        }`}
    >
      <div className="flex items-center p-4 gap-3">
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing text-slate-700 hover:text-slate-500 p-1 shrink-0 transition-colors">
          <GripVertical size={18} />
        </div>

        {/* Status Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0
            ${task.completed 
              ? 'bg-neon-blue border-neon-blue text-slate-900 animate-check-pop shadow-[0_0_10px_rgba(0,243,255,0.4)]' 
              : isStale 
                ? 'border-orange-500 hover:bg-orange-500/10' 
                : 'border-slate-700 hover:border-neon-blue hover:bg-neon-blue/10'
            }`}
        >
          {task.completed && <Check size={16} strokeWidth={4} />}
          {isStale && !task.completed && <AlertTriangle size={14} className="text-orange-500" />}
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0" onClick={() => !isEditing && onOpenKanban(task.id)}>
          {isEditing ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <input 
                autoFocus
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="w-full bg-slate-800 text-white border-none focus:ring-0 text-sm font-medium py-1 px-2 rounded-lg outline-none"
              />
              <button onClick={handleSave} className="text-green-400 hover:bg-green-400/10 p-1.5 rounded-lg transition-colors"><Save size={16}/></button>
              <button onClick={() => setIsEditing(false)} className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors"><X size={16}/></button>
            </div>
          ) : (
            <div className="flex flex-col cursor-pointer">
              <span className={`text-sm md:text-base font-bold truncate transition-all ${task.completed ? 'line-through text-slate-600' : 'text-slate-100'}`}>
                {task.text}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {subtaskCount > 0 && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/50 border border-slate-700">
                    <div className={`w-1.5 h-1.5 rounded-full ${doneSubtasks === subtaskCount ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-neon-purple animate-pulse shadow-[0_0_5px_rgba(188,19,254,0.5)]'}`}></div>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{doneSubtasks}/{subtaskCount}</span>
                  </div>
                )}
                {isStale && !task.completed && <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-orange-500/20">Atrasada</span>}
              </div>
            </div>
          )}
        </div>

        {/* Actions - Always Visible for UX clarity, Highlighting on Active/Hover */}
        <div className="flex items-center gap-0.5 md:gap-1 transition-all">
           <button 
             onClick={(e) => { e.stopPropagation(); onOpenKanban(task.id); }}
             className={`p-2 rounded-xl transition-all ${isActive ? 'text-neon-blue bg-neon-blue/10' : 'text-slate-600 hover:text-neon-blue hover:bg-neon-blue/5'}`}
             title="Abrir Planejamento"
           >
             <KanbanSquare size={18} />
           </button>
           {!task.completed && !isEditing && (
             <button 
               onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
               className={`p-2 rounded-xl transition-all ${isActive ? 'text-slate-300 bg-slate-300/10' : 'text-slate-600 hover:text-slate-300 hover:bg-slate-300/5'}`}
               title="Renomear"
             >
               <Edit2 size={18} />
             </button>
           )}
           <button 
             onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
             className={`p-2 rounded-xl transition-all ${isActive ? 'text-red-500 bg-red-500/10' : 'text-slate-600 hover:text-red-500 hover:bg-red-500/5'}`}
             title="Excluir"
           >
             <Trash2 size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};