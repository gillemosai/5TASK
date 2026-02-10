
import React, { useState } from 'react';
import { Trash2, Check, Edit2, X, Save, GripVertical, KanbanSquare, Flag, Palette } from 'lucide-react';
import { Task, Priority, HighlightColor } from '../types';

interface TaskItemProps {
  task: Task;
  index: number;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onUpdateProps: (id: string, priority: Priority, color: HighlightColor) => void;
  onOpenKanban: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, position: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, position: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  isDarkMode?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  index, 
  onComplete, 
  onDelete, 
  onEdit,
  onUpdateProps,
  onOpenKanban,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDarkMode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [showConfig, setShowConfig] = useState(false);

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(task.id, editedText);
      setIsEditing(false);
    }
  };

  const getPriorityInfo = (p?: Priority) => {
    switch(p) {
      case 'urgent': return { color: 'bg-red-500', label: 'URGENTE' };
      case 'attention': return { color: 'bg-yellow-500', label: 'ATENÇÃO' };
      case 'critical': return { color: 'bg-black', label: 'CRÍTICO' };
      default: return null;
    }
  };

  const getHighlightStyle = (c?: HighlightColor) => {
    switch(c) {
      case 'blue': return 'border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.1)]';
      case 'purple': return 'border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.1)]';
      case 'pink': return 'border-neon-pink shadow-[0_0_15px_rgba(188,19,254,0.1)]';
      default: return isDarkMode ? 'border-slate-800' : 'border-slate-200';
    }
  };

  const priority = getPriorityInfo(task.priority);

  return (
    <div 
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`relative group rounded-2xl border-2 transition-all duration-500 ease-in-out cursor-default overflow-hidden
        ${getHighlightStyle(task.highlightColor)}
        ${task.completed ? 'opacity-50 grayscale' : (isDarkMode ? 'bg-slate-900' : 'bg-white shadow-sm')}
        hover:translate-x-1`}
    >
      {/* Barra de Prioridade Lateral */}
      {priority && <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${priority.color}`} />}

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-neon-blue transition-colors">
            <GripVertical size={20} />
          </div>

          <button 
            onClick={() => onComplete(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
              ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-600 hover:border-neon-blue'}`}
          >
            {task.completed && <Check size={14} className="text-white" />}
          </button>

          {isEditing ? (
            <input 
              autoFocus
              className="flex-1 bg-slate-800 text-white border-none rounded px-2 py-1 outline-none font-medium"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          ) : (
            <div className="flex-1 min-w-0" onClick={() => onOpenKanban(task.id)}>
              <div className="flex items-center gap-2">
                <span className={`font-bold truncate text-sm md:text-base ${task.completed ? 'line-through text-slate-600' : (isDarkMode ? 'text-white' : 'text-slate-900')}`}>
                  {task.text}
                </span>
                {priority && (
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black text-white ${priority.color}`}>
                    {priority.label}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setShowConfig(!showConfig)} className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400">
              <Palette size={16} />
            </button>
            <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400">
              <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(task.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Menu de Configuração Rápida */}
        {showConfig && (
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800 animate-fadeIn">
            <div className="flex gap-2">
              {(['urgent', 'attention', 'critical', 'none'] as Priority[]).map(p => (
                <button 
                  key={p}
                  onClick={() => onUpdateProps(task.id, p, task.highlightColor || 'none')}
                  className={`w-6 h-6 rounded flex items-center justify-center border transition-all
                    ${p === 'urgent' ? 'bg-red-500 border-red-600' : p === 'attention' ? 'bg-yellow-500 border-yellow-600' : p === 'critical' ? 'bg-black border-slate-700' : 'bg-slate-700 border-slate-600'}
                    ${task.priority === p ? 'ring-2 ring-neon-blue scale-110' : 'opacity-60 hover:opacity-100'}`}
                  title={p.toUpperCase()}
                >
                  <Flag size={10} className="text-white" />
                </button>
              ))}
            </div>
            <div className="h-4 w-[1px] bg-slate-800" />
            <div className="flex gap-2">
              {(['blue', 'purple', 'pink', 'none'] as HighlightColor[]).map(c => (
                <button 
                  key={c}
                  onClick={() => onUpdateProps(task.id, task.priority || 'none', c)}
                  className={`w-6 h-6 rounded-full transition-all border-2
                    ${c === 'blue' ? 'bg-neon-blue border-cyan-400' : c === 'purple' ? 'bg-neon-purple border-purple-400' : c === 'pink' ? 'bg-neon-pink border-pink-400' : 'bg-slate-700 border-slate-600'}
                    ${task.highlightColor === c ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
