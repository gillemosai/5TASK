import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Undo2, X, Download, StickyNote, ArrowRight, RefreshCw, Database, AlertCircle, Upload, ShieldCheck } from 'lucide-react';
import { Task, Mood, QuoteType, SubTask } from './types';
import { QUOTES, AVATAR_IMAGES, LOGO_URL } from './constants';
import { EinsteinAvatar } from './components/EinsteinAvatar';
import { TaskItem } from './components/TaskItem';
import { KanbanBoard } from './components/KanbanBoard';

// --- Database Engine (IndexedDB) ---
let dbInstance: IDBDatabase | null = null;
const DB_NAME = '5task_quantum_v71_db'; 
const STORE_NAME = 'tasks_store';

const getDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 9);
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
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put(tasks, 'current_tasks');
};

const loadTasksFromDB = async (): Promise<Task[]> => {
  const db = await getDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get('current_tasks');
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]);
  });
};

// Main App Component
const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.HAPPY);
  const [quote, setQuote] = useState(QUOTES.welcome[0]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from DB
  useEffect(() => {
    loadTasksFromDB().then(savedTasks => {
      setTasks(savedTasks);
      setIsLoaded(true);
      window.dispatchEvent(new Event('app-ready'));
      const welcomeQuotes = QUOTES.welcome;
      setQuote(welcomeQuotes[Math.floor(Math.random() * welcomeQuotes.length)]);
    });
  }, []);

  // Save to DB
  useEffect(() => {
    if (isLoaded) {
      saveTasksToDB(tasks);
    }
  }, [tasks, isLoaded]);

  const updateEinstein = (type: QuoteType, customMood?: Mood) => {
    const quotes = QUOTES[type];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    if (customMood) {
      setMood(customMood);
    } else {
      switch(type) {
        case 'add': setMood(Mood.EXCITED); break;
        case 'complete': setMood(Mood.HAPPY); break;
        case 'delete': setMood(Mood.THINKING); break;
        case 'full': setMood(Mood.SHOCKED); break;
        case 'welcome': setMood(Mood.HAPPY); break;
        default: setMood(Mood.THINKING);
      }
    }
    
    if (type !== 'idle' && type !== 'welcome') {
      setTimeout(() => setMood(Mood.THINKING), 3000);
    }
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (tasks.length >= 5) {
      updateEinstein('full');
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputText.trim(),
      completed: false,
      createdAt: Date.now(),
      subTasks: []
    };

    setTasks([...tasks, newTask]);
    setInputText('');
    updateEinstein('add');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newState = !t.completed;
        if (newState) updateEinstein('complete');
        return { ...t, completed: newState };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
      setTasks(prev => prev.filter(t => t.id !== id));
      updateEinstein('delete');
      if (activeTaskId === id) setActiveTaskId(null);
    }
  };

  const undoDelete = () => {
    if (lastDeletedTask && tasks.length < 5) {
      setTasks(prev => [...prev, lastDeletedTask]);
      setLastDeletedTask(null);
      setMood(Mood.HAPPY);
      setQuote("Energia recuperada! A tarefa voltou para o sistema.");
    }
  };

  const editTask = (id: string, newText: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const updateSubtasks = (taskId: string, subTasks: SubTask[]) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, subTasks } : t));
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);

  // Drag & Drop Handling
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, position: number) => {
    dragItem.current = position;
  };
  const handleDragEnter = (e: React.DragEvent, position: number) => {
    dragOverItem.current = position;
  };
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newList = [...tasks];
      const item = newList[dragItem.current];
      newList.splice(dragItem.current, 1);
      newList.splice(dragOverItem.current, 0, item);
      dragItem.current = null;
      dragOverItem.current = null;
      setTasks(newList);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-neon-blue selection:text-slate-900 overflow-x-hidden">
      <header className="p-6 flex flex-col items-center">
        <img src={LOGO_URL} alt="5TASK" className="h-12 mb-4 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 shadow-inner">
           <Database size={12} className="text-neon-blue" />
           <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Quantum Storage Active</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
          <EinsteinAvatar mood={mood} quote={quote} />
          <div className="w-full mt-4 space-y-4 hidden lg:block">
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Sincronização</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Tarefas Ativas</span>
                <span className="font-mono font-bold text-neon-blue">{tasks.filter(t => !t.completed).length}/5</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-neon-blue h-full transition-all duration-500" 
                  style={{ width: `${(tasks.filter(t => !t.completed).length / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            {lastDeletedTask && (
              <button onClick={undoDelete} className="w-full flex items-center justify-center gap-2 p-3 bg-orange-500/10 border border-orange-500/50 text-orange-500 rounded-xl hover:bg-orange-500/20 transition-all text-sm font-bold">
                <Undo2 size={16} /> Desfazer Exclusão
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          {activeTask ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm min-h-[500px]">
              <KanbanBoard task={activeTask} onClose={() => setActiveTaskId(null)} onUpdateSubtasks={(subs) => updateSubtasks(activeTask.id, subs)} />
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={addTask} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-center bg-slate-900 border-2 border-slate-800 rounded-2xl p-2 group-focus-within:border-neon-blue">
                  <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="O que você vai realizar hoje?" className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-600 px-4 py-3 font-medium outline-none" maxLength={100} />
                  <button type="submit" className="bg-neon-blue hover:bg-cyan-400 text-slate-900 p-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50" disabled={!inputText.trim() || tasks.length >= 5}>
                    <Plus size={24} strokeWidth={3} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-600 mt-2 ml-4 font-mono uppercase tracking-widest">{tasks.length}/5 Variáveis Máximas</p>
              </form>

              <div className="space-y-1">
                {tasks.map((task, idx) => (
                  <TaskItem key={task.id} task={task} index={idx} onComplete={toggleTask} onDelete={deleteTask} onEdit={editTask} onOpenKanban={setActiveTaskId} onDragStart={handleDragStart} onDragEnter={handleDragEnter} onDragEnd={handleDragEnd} isActive={activeTaskId === task.id} />
                ))}
                {tasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-800 rounded-3xl opacity-40">
                    <StickyNote size={48} className="text-slate-700 mb-4" />
                    <p className="text-slate-500 font-mono text-sm">O vácuo é bom para a física, não para o seu dia.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-none">
         <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 px-6 py-2 rounded-full shadow-2xl flex items-center gap-4 pointer-events-auto">
            <div className="flex items-center gap-1.5">
               <ShieldCheck size={14} className="text-green-500" />
               <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">Offline First</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-800"></div>
            <div className="text-[10px] text-slate-500 font-mono">v71.0.0-STABLE</div>
         </div>
      </footer>
    </div>
  );
};

export default App;