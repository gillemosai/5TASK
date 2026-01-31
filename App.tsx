import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Undo2, X, Download, StickyNote, ArrowRight, RefreshCw, Database } from 'lucide-react';
import { Task, Mood, QuoteType, SubTask } from './types';
import { QUOTES } from './constants';
import { EinsteinAvatar } from './components/EinsteinAvatar';
import { TaskItem } from './components/TaskItem';
import { KanbanBoard } from './components/KanbanBoard';

// --- Database Engine (IndexedDB + Persistent Storage API) ---
const DB_NAME = '5task_db';
const STORE_NAME = 'tasks_store';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveTasksToDB = async (tasks: Task[]) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(tasks, 'current_tasks');
    return new Promise((resolve) => { tx.oncomplete = resolve; });
  } catch (e) {
    console.error("Falha crítica ao gravar no banco:", e);
  }
};

const loadTasksFromDB = async (): Promise<Task[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get('current_tasks');
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch (e) {
    return [];
  }
};

const MAX_TASKS = 5;
const LOGO_URL = 'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/5task-logo.png';
const SUCCESS_SOUND_URL = 'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3';
const APP_VERSION = "v57";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPersistent, setIsPersistent] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.THINKING);
  const [quote, setQuote] = useState<string>(QUOTES.welcome[0]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeKanbanTaskId, setActiveKanbanTaskId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dragItem = useRef<number | null>(null);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  // Carregamento inicial
  useEffect(() => {
    const setupApp = async () => {
      const savedTasks = await loadTasksFromDB();
      setTasks(savedTasks);
      setIsLoading(false);
      if (navigator.storage && navigator.storage.persist) {
        const persistent = await navigator.storage.persist();
        setIsPersistent(persistent);
      }
    };
    setupApp();
  }, []);

  // Auto-Save
  useEffect(() => {
    if (!isLoading) saveTasksToDB(tasks);
  }, [tasks, isLoading]);

  // Management of Mood based on state (idle or full)
  useEffect(() => {
    if (isLoading) return;
    
    // Only apply generic moods if we are not in the middle of a specific action feedback
    const timer = setTimeout(() => {
      if (tasks.length === 0) {
        setMood(Mood.THINKING);
        setQuote(QUOTES.welcome[Math.floor(Math.random() * QUOTES.welcome.length)]);
      } else if (tasks.length >= MAX_TASKS) {
        setMood(Mood.SHOCKED);
        setQuote(QUOTES.full[Math.floor(Math.random() * QUOTES.full.length)]);
      } else if (mood !== Mood.HAPPY && mood !== Mood.EXCITED) {
        setMood(Mood.THINKING);
      }
    }, 3000); // 3 seconds of action feedback before reverting to state mood

    return () => clearTimeout(timer);
  }, [tasks.length, isLoading]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || tasks.length >= MAX_TASKS) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
      subTasks: []
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
    setMood(Mood.HAPPY);
    setQuote(QUOTES.add[Math.floor(Math.random() * QUOTES.add.length)]);
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      const task = newTasks.find(t => t.id === id);
      if (task?.completed) {
        setMood(Mood.HAPPY);
        setQuote(QUOTES.complete[Math.floor(Math.random() * QUOTES.complete.length)]);
        new Audio(SUCCESS_SOUND_URL).play().catch(() => {});
      }
      return newTasks;
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
      setShowUndo(true);
      setTasks(prev => prev.filter(t => t.id !== id));
      if (activeKanbanTaskId === id) setActiveKanbanTaskId(null);
      setMood(Mood.EXCITED);
      setQuote(QUOTES.delete[Math.floor(Math.random() * QUOTES.delete.length)]);
    }
  };

  const activeTaskForKanban = tasks.find(t => t.id === activeKanbanTaskId);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center py-4 md:py-8 px-4 selection:bg-neon-purple/30">
      <div className={`w-full transition-all duration-500 flex flex-col md:flex-row gap-6 ${isSidebarOpen ? 'max-w-[1400px]' : 'max-w-lg'}`}>
        
        <main className={`flex flex-col w-full shrink-0 ${isSidebarOpen ? 'md:w-80 lg:w-96' : 'mx-auto'} ${activeKanbanTaskId && !isSidebarOpen ? 'hidden' : 'block'} pb-20`}>
            <header className="flex items-center justify-between mb-6 bg-slate-900/60 p-4 rounded-3xl border border-slate-800 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <img src={LOGO_URL} alt="5task" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
                    <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">5task</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-2xl border transition-all ${isSidebarOpen ? 'bg-neon-purple border-neon-blue' : 'bg-slate-800 border-slate-700'}`}>
                    <StickyNote size={20} className={isSidebarOpen ? 'text-white' : 'text-slate-400'} />
                </button>
            </header>

            <EinsteinAvatar mood={mood} quote={quote} />

            <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Fluxo de Eventos</span>
                <span className={`text-xs font-mono px-3 py-1 rounded-full border ${tasks.length >= MAX_TASKS ? 'border-red-500/50 text-red-400' : 'border-neon-blue/30 text-neon-blue'}`}>
                    {tasks.length} / {MAX_TASKS}
                </span>
            </div>

            <form onSubmit={addTask} className="relative mb-6">
                <input
                    ref={inputRef}
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    disabled={tasks.length >= MAX_TASKS}
                    placeholder={tasks.length >= MAX_TASKS ? "Limite de Massa Atendido" : "Próxima observação..."}
                    className="w-full bg-slate-900/90 text-white pl-5 pr-14 py-4 rounded-2xl border-2 border-slate-800 focus:border-neon-blue/50 focus:ring-4 focus:ring-neon-blue/5 outline-none transition-all placeholder:text-slate-600 shadow-2xl"
                />
                <button type="submit" disabled={tasks.length >= MAX_TASKS || !newTaskText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-neon-purple text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-30 transition-all">
                    <Plus size={20} />
                </button>
            </form>

            <div className="space-y-3 mb-8">
                {tasks.map((task, index) => (
                    <div key={task.id} 
                         className="transition-all"
                         onClick={() => isSidebarOpen && setActiveKanbanTaskId(task.id)}>
                        <TaskItem
                            index={index}
                            task={task}
                            isActive={activeKanbanTaskId === task.id}
                            onComplete={toggleComplete}
                            onDelete={deleteTask}
                            onEdit={(id, text) => setTasks(prev => prev.map(t => t.id === id ? {...t, text} : t))}
                            onOpenKanban={(id) => setActiveKanbanTaskId(id)}
                            onDragStart={(e, pos) => { dragItem.current = pos; }}
                            onDragEnter={(e, pos) => {
                                if (dragItem.current !== null && dragItem.current !== pos) {
                                    const _tasks = [...tasks];
                                    const dragged = _tasks[dragItem.current];
                                    _tasks.splice(dragItem.current, 1);
                                    _tasks.splice(pos, 0, dragged);
                                    dragItem.current = pos;
                                    setTasks(_tasks);
                                }
                            }}
                            onDragEnd={() => { dragItem.current = null; }}
                        />
                    </div>
                ))}
                {tasks.length === 0 && (
                    <div className="py-12 text-center text-slate-700 border-2 border-dashed border-slate-800/50 rounded-3xl">
                        <p className="text-sm font-mono">Einstein está em repouso.</p>
                    </div>
                )}
            </div>

            <footer className="mt-auto py-6 text-center space-y-2">
                <p className="text-[9px] text-slate-600 font-mono tracking-widest uppercase flex items-center justify-center gap-2">
                    Engine {APP_VERSION} <RefreshCw size={8} className="animate-spin-slow" /> Persistence: Active
                </p>
                <div className={`text-[8px] font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all
                  ${isPersistent ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                  <Database size={8} /> {isPersistent ? 'MEMÓRIA PERMANENTE' : 'MEMÓRIA TEMPORÁRIA'}
                </div>
            </footer>
        </main>

        {(activeKanbanTaskId || isSidebarOpen) && (
            <aside className={`transition-all duration-500 flex flex-col bg-slate-900/40 rounded-[2.5rem] border border-slate-800 p-6 backdrop-blur-md
                ${isSidebarOpen ? 'flex-1 opacity-100' : activeKanbanTaskId ? 'fixed inset-0 z-50 rounded-none p-4' : 'w-0 opacity-0 overflow-hidden'}`}>
                {activeTaskForKanban ? (
                    <KanbanBoard 
                        task={activeTaskForKanban} 
                        onClose={() => setActiveKanbanTaskId(null)}
                        onUpdateSubtasks={(subs) => setTasks(prev => prev.map(t => t.id === activeKanbanTaskId ? {...t, subTasks: subs} : t))}
                        isSidebar={isSidebarOpen}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <StickyNote size={48} className="mb-4 opacity-10" />
                        <p className="text-xs uppercase tracking-widest font-mono">Selecione uma missão à esquerda</p>
                    </div>
                )}
            </aside>
        )}

        {showUndo && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-6 animate-[slideUp_0.3s_ease]">
                <span className="text-sm">Matéria recuperada.</span>
                <button onClick={() => {
                   if (lastDeletedTask && tasks.length < MAX_TASKS) {
                      setTasks(prev => [lastDeletedTask, ...prev]);
                      setShowUndo(false);
                      setLastDeletedTask(null);
                   }
                }} className="text-neon-blue font-black text-xs flex items-center gap-2 hover:underline">
                    <Undo2 size={14} /> DESFAZER
                </button>
                <button onClick={() => setShowUndo(false)}><X size={14} className="text-slate-500" /></button>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;