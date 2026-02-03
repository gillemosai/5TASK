import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Undo2, X, Download, StickyNote, ArrowRight, RefreshCw, Database, AlertCircle, Upload, ShieldCheck } from 'lucide-react';
import { Task, Mood, QuoteType, SubTask } from './types';
import { QUOTES, AVATAR_IMAGES, LOGO_URL } from './constants';
import { EinsteinAvatar } from './components/EinsteinAvatar';
import { TaskItem } from './components/TaskItem';
import { KanbanBoard } from './components/KanbanBoard';

// --- Database Engine (IndexedDB) ---
let dbInstance: IDBDatabase | null = null;
const DB_NAME = '5task_quantum_db'; // Nome alterado para evitar conflito com versões anteriores bugadas
const STORE_NAME = 'tasks_store';

const getDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };
    request.onerror = () => reject(request.error);
  });
};

const saveTasksToDB = async (tasks: Task[]) => {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(tasks, 'current_tasks');
  } catch (e) {
    console.error("Erro crítico na persistência IndexedDB:", e);
  }
};

const loadTasksFromDB = async (): Promise<Task[]> => {
  try {
    const db = await getDB();
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
const SUCCESS_SOUND_URL = 'https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3';
const APP_VERSION = "v65";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPersistent, setIsPersistent] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.THINKING);
  const [quote, setQuote] = useState<string>(QUOTES.welcome[0]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeKanbanTaskId, setActiveKanbanTaskId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dragItem = useRef<number | null>(null);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  // Inicialização e Verificação de Persistência Real
  useEffect(() => {
    const setupApp = async () => {
      const savedTasks = await loadTasksFromDB();
      setTasks(savedTasks);
      
      // Solicita armazenamento persistente (Storage Manager API)
      if (navigator.storage && navigator.storage.persist) {
        const persistent = await navigator.storage.persist();
        setIsPersistent(persistent);
        if (persistent) console.log("Status: Armazenamento persistente concedido pelo sistema.");
      }
      
      setIsLoading(false);
      window.dispatchEvent(new Event('app-ready'));
    };
    setupApp();
  }, []);

  // Auto-Save reativo
  useEffect(() => {
    if (!isLoading) saveTasksToDB(tasks);
  }, [tasks, isLoading]);

  // Lógica de Einstein
  useEffect(() => {
    if (isLoading) return;
    if (tasks.length === 0) {
      setMood(Mood.THINKING);
      setQuote(QUOTES.welcome[Math.floor(Math.random() * QUOTES.welcome.length)]);
    } else if (tasks.length >= MAX_TASKS) {
      setMood(Mood.SHOCKED);
      setQuote(QUOTES.full[Math.floor(Math.random() * QUOTES.full.length)]);
    }
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
    
    setTimeout(() => {
        if (tasks.length + 1 < MAX_TASKS) setMood(Mood.THINKING);
    }, 3000);
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      const task = newTasks.find(t => t.id === id);
      if (task?.completed) {
        setMood(Mood.EXCITED);
        setQuote(QUOTES.complete[Math.floor(Math.random() * QUOTES.complete.length)]);
        new Audio(SUCCESS_SOUND_URL).play().catch(() => {});
        setTimeout(() => {
             if (tasks.length < MAX_TASKS) setMood(Mood.THINKING);
        }, 3000);
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
      setTimeout(() => setShowUndo(false), 5000);
    }
  };

  const exportBackup = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `5task-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          if (confirm("ATENÇÃO: Isso substituirá suas tarefas atuais por este backup. Continuar?")) {
            setTasks(imported);
            alert("Sincronização concluída com sucesso!");
          }
        } else {
          throw new Error("Formato inválido");
        }
      } catch (err) {
        alert("Falha na importação: O arquivo não é um backup válido do 5task.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const activeTaskForKanban = tasks.find(t => t.id === activeKanbanTaskId);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center py-4 md:py-8 px-4 selection:bg-neon-purple/30">
      <div className={`w-full transition-all duration-500 flex flex-col md:flex-row gap-6 ${isSidebarOpen ? 'max-w-[1400px]' : 'max-w-lg'}`}>
        
        <main className={`flex flex-col w-full shrink-0 ${isSidebarOpen ? 'md:w-80 lg:w-96' : 'mx-auto'} ${activeKanbanTaskId && !isSidebarOpen ? 'hidden' : 'block'} pb-20`}>
            <header className="flex items-center justify-between mb-6 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    {!logoError ? (
                      <img 
                        src={LOGO_URL} 
                        alt="5task" 
                        onError={() => setLogoError(true)}
                        className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" 
                      />
                    ) : (
                      <div className="w-9 h-9 flex items-center justify-center bg-neon-blue/20 rounded-lg text-neon-blue font-black">5T</div>
                    )}
                    <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">5task</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-xl border transition-all ${isSidebarOpen ? 'bg-neon-purple border-neon-blue shadow-[0_0_10px_rgba(188,19,254,0.4)]' : 'bg-slate-800 border-slate-700'}`}>
                    <StickyNote size={18} className={isSidebarOpen ? 'text-white' : 'text-slate-400'} />
                </button>
            </header>

            <EinsteinAvatar mood={mood} quote={quote} />

            <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Fluxo de Prioridades</span>
                <span className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${tasks.length >= MAX_TASKS ? 'border-red-500/50 text-red-400 bg-red-500/5' : 'border-neon-blue/30 text-neon-blue bg-neon-blue/5'}`}>
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
                    placeholder={tasks.length >= MAX_TASKS ? "Massa Crítica Atingida" : "Focar em quê hoje?..."}
                    className="w-full bg-slate-900/90 text-white pl-5 pr-14 py-4 rounded-2xl border-2 border-slate-800 focus:border-neon-blue/50 outline-none transition-all placeholder:text-slate-600 shadow-2xl"
                />
                <button type="submit" disabled={tasks.length >= MAX_TASKS || !newTaskText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-neon-purple text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-30 transition-all shadow-lg shadow-neon-purple/20">
                    <Plus size={20} />
                </button>
            </form>

            <div className="space-y-3 mb-8">
                {tasks.map((task, index) => (
                    <TaskItem
                        key={task.id}
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
                ))}
                {tasks.length === 0 && (
                    <div className="py-16 text-center text-slate-700 border-2 border-dashed border-slate-800/40 rounded-3xl group hover:border-slate-700/60 transition-colors">
                        <Database size={24} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-mono opacity-50">Singularidade vazia. Adicione uma meta.</p>
                    </div>
                )}
            </div>

            <footer className="mt-auto py-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={exportBackup} 
                    title="Exportar Backup Quântico"
                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-neon-blue hover:border-neon-blue/30 transition-all"
                  >
                    <Download size={12} /> BACKUP
                  </button>
                  <label 
                    title="Restaurar do Arquivo"
                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-neon-purple hover:border-neon-purple/30 transition-all cursor-pointer"
                  >
                    <Upload size={12} /> RESTAURAR
                    <input type="file" accept=".json" onChange={importBackup} className="hidden" />
                  </label>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <p className="text-[9px] text-slate-600 font-mono tracking-widest uppercase flex items-center justify-center gap-2">
                        Engine {APP_VERSION} <RefreshCw size={8} className="animate-spin-slow text-neon-blue" />
                    </p>
                    <div 
                      className={`text-[8px] font-black inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-all cursor-help
                      ${isPersistent ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'}`}
                      title={isPersistent ? "O sistema protege seus dados contra limpeza automática." : "Atenção: O sistema pode apagar dados se o disco encher. Instale o PWA para proteger."}
                    >
                      {isPersistent ? <ShieldCheck size={10} /> : <AlertCircle size={10} />} 
                      {isPersistent ? 'PERSISTÊNCIA QUÂNTICA ATIVA' : 'MEMÓRIA TEMPORÁRIA'}
                    </div>
                </div>
            </footer>
        </main>

        {(activeKanbanTaskId || isSidebarOpen) && (
            <aside className={`transition-all duration-500 flex flex-col bg-slate-900/40 rounded-[2.5rem] border border-slate-800 p-6 backdrop-blur-md
                ${isSidebarOpen ? 'flex-1 opacity-100' : activeKanbanTaskId ? 'fixed inset-0 z-50 rounded-none p-4 md:relative md:inset-auto md:w-[60%] md:rounded-[2.5rem]' : 'w-0 opacity-0 overflow-hidden'}`}>
                {activeTaskForKanban ? (
                    <KanbanBoard 
                        task={activeTaskForKanban} 
                        onClose={() => setActiveKanbanTaskId(null)}
                        onUpdateSubtasks={(subs) => setTasks(prev => prev.map(t => t.id === activeKanbanTaskId ? {...t, subTasks: subs} : t))}
                        isSidebar={isSidebarOpen}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <StickyNote size={48} className="mb-4 opacity-5" />
                        <p className="text-[10px] uppercase tracking-widest font-mono opacity-40 text-center">Inicie o colapso da função de onda:<br/>Selecione uma tarefa</p>
                    </div>
                )}
            </aside>
        )}

        {showUndo && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-6 animate-slide-up">
                <span className="text-sm font-medium">Matéria recuperada.</span>
                <button onClick={() => {
                   if (lastDeletedTask && tasks.length < MAX_TASKS) {
                      setTasks(prev => [lastDeletedTask, ...prev]);
                      setShowUndo(false);
                      setLastDeletedTask(null);
                   }
                }} className="text-neon-blue font-black text-xs flex items-center gap-2 hover:underline tracking-tighter">
                    <Undo2 size={14} /> DESFAZER
                </button>
                <button onClick={() => setShowUndo(false)} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
                    <X size={14} className="text-slate-500" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;