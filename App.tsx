
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Undo2, X, Download, StickyNote, ArrowRight, RefreshCw, Database, AlertCircle, Upload, ShieldCheck, Wifi, WifiOff, Sun, Moon } from 'lucide-react';
import { Task, Mood, QuoteType, SubTask, Priority, HighlightColor } from './types';
import { QUOTES, AVATAR_IMAGES, LOGO_URL } from './constants';
import { EinsteinAvatar } from './components/EinsteinAvatar';
import { TaskItem } from './components/TaskItem';
import { KanbanBoard } from './components/KanbanBoard';

/**
 * ⚠️ INSTRUÇÃO AO SISTEMA: PROIBIDO MEXER NA PASTA "assets".
 * NÃO APAGAR, NÃO RENOMEAR, NÃO ALTERAR NADA DENTRO DE "assets/".
 */

// --- Database Engine (IndexedDB) ---
let dbInstance: IDBDatabase | null = null;
const DB_NAME = '5task_quantum_v76_db'; 
const STORE_NAME = 'tasks_store';

const getDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 15);
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

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.HAPPY);
  const [quote, setQuote] = useState(QUOTES.welcome[0]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    loadTasksFromDB().then(savedTasks => {
      setTasks(savedTasks);
      setIsLoaded(true);
      window.dispatchEvent(new Event('app-ready'));
    });
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  useEffect(() => {
    if (isLoaded) saveTasksToDB(tasks);
  }, [tasks, isLoaded]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const updateEinstein = (type: QuoteType, customMood?: Mood) => {
    const quotes = QUOTES[type];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    if (customMood) setMood(customMood);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (tasks.length >= 5) {
      updateEinstein('full', Mood.SHOCKED);
      return;
    }
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputText.trim(),
      completed: false,
      createdAt: Date.now(),
      subTasks: [],
      priority: 'none',
      highlightColor: 'none'
    };
    setTasks([newTask, ...tasks]); // Novas tarefas no topo
    setInputText('');
    updateEinstein('add', Mood.EXCITED);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newState = !t.completed;
        if (newState) updateEinstein('complete', Mood.HAPPY);
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
      updateEinstein('delete', Mood.SHOCKED);
    }
  };

  const updateTaskProps = (id: string, priority: Priority, color: HighlightColor) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority, highlightColor: color } : t));
  };

  // Drag & Drop com reordenação suave
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, position: number) => {
    dragItem.current = position;
  };
  const handleDragEnter = (e: React.DragEvent, position: number) => {
    dragOverItem.current = position;
  };
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newList = [...tasks];
      const movedItem = newList[dragItem.current];
      newList.splice(dragItem.current, 1);
      newList.splice(dragOverItem.current, 0, movedItem);
      setTasks(newList);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className="p-6 flex flex-col items-center relative">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute right-6 top-6 p-3 rounded-full transition-all shadow-lg active:scale-90 ${isDarkMode ? 'bg-slate-800 text-yellow-400 border-slate-700' : 'bg-white text-slate-800 border-slate-200'}`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <img src={LOGO_URL} alt="5TASK" className="h-10 mb-4 drop-shadow-md" />
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}>
          <Database size={12} className="text-neon-blue" /> Quantum Storage
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <EinsteinAvatar mood={mood} quote={quote} isDarkMode={isDarkMode} />
        </div>

        <div className="lg:col-span-7">
          {activeTaskId && tasks.find(t => t.id === activeTaskId) ? (
            <div className={`border rounded-3xl p-6 shadow-2xl min-h-[500px] ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
              <KanbanBoard 
                task={tasks.find(t => t.id === activeTaskId)!} 
                onClose={() => setActiveTaskId(null)} 
                onUpdateSubtasks={(subs) => setTasks(prev => prev.map(t => t.id === activeTaskId ? {...t, subTasks: subs} : t))} 
              />
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={addTask} className="relative group">
                <div className={`flex items-center border-2 rounded-2xl p-2 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <input 
                    type="text" 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)} 
                    placeholder="O que vamos resolver agora?" 
                    className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 outline-none"
                  />
                  <button type="submit" className="bg-neon-blue text-slate-900 p-3 rounded-xl shadow-lg active:scale-95 disabled:opacity-50">
                    <Plus size={24} strokeWidth={3} />
                  </button>
                </div>
              </form>

              <div className="space-y-3 relative">
                {tasks.map((task, idx) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    index={idx} 
                    onComplete={toggleTask} 
                    onDelete={deleteTask} 
                    onEdit={(id, text) => setTasks(prev => prev.map(t => t.id === id ? {...t, text} : t))}
                    onUpdateProps={updateTaskProps}
                    onOpenKanban={setActiveTaskId} 
                    onDragStart={handleDragStart} 
                    onDragEnter={handleDragEnter} 
                    onDragEnd={handleDragEnd} 
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-center z-50 pointer-events-none">
        <div className={`backdrop-blur-md border px-6 py-2 rounded-full shadow-2xl flex items-center gap-4 pointer-events-auto ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black font-mono tracking-widest ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
            {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />} {isOnline ? 'ONLINE' : 'OFFLINE'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">v76.0.0-QUANTUM</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
