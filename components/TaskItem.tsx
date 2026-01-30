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
        } ${isActive ? 'animate-bounce-active' : ''}`}
    >
      <div className="flex items-center p-4 gap-3">
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing text-slate-700 hover:text-slate-400 p-1 shrink-0">
          <GripVertical size={18} />
        </div>

        {/* Status Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0
            ${task.completed 
              ? 'bg-neon-blue border-neon-blue text-slate-900 animate-check-pop' 
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
                className="w-full bg-slate-800 text-white border-none focus:ring-0 text-sm font-medium py-1 px-2 rounded"
              />
              <button onClick={handleSave} className="text-green-400 p-1"><Save size={16}/></button>
              <button onClick={() => setIsEditing(false)} className="text-red-400 p-1"><X size={16}/></button>
            </div>
          ) : (
            <div className="flex flex-col cursor-pointer">
              <span className={`text-sm md:text-base font-bold truncate transition-all ${task.completed ? 'line-through text-slate-600' : 'text-slate-100'}`}>
                {task.text}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {subtaskCount > 0 && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                    <div className={`w-1.5 h-1.5 rounded-full ${doneSubtasks === subtaskCount ? 'bg-green-500' : 'bg-neon-purple animate-pulse'}`}></div>
                    <span className="text-[10px] text-slate-400 font-mono">{doneSubtasks}/{subtaskCount}</span>
                  </div>
                )}
                {isStale && !task.completed && <span className="text-[10px] font-mono text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">Stale</span>}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             onClick={(e) => { e.stopPropagation(); onOpenKanban(task.id); }}
             className="p-2 text-slate-500 hover:text-neon-purple transition-colors"
             title="Abrir Kanban"
           >
             <KanbanSquare size={16} />
           </button>
           {!task.completed && !isEditing && (
             <button 
               onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
               className="p-2 text-slate-500 hover:text-white transition-colors"
               title="Editar"
             >
               <Edit2 size={16} />
             </button>
           )}
           <button 
             onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
             className="p-2 text-slate-500 hover:text-red-400 transition-colors"
             title="Excluir"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};