import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Undo2, X, Download, Share2 } from 'lucide-react';
import { Task, Mood, QuoteType } from './types';
import { QUOTES } from './constants';
import { EinsteinAvatar } from './components/EinsteinAvatar';
import { TaskItem } from './components/TaskItem';

const MAX_TASKS = 5;

const App: React.FC = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('5task_data');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erro ao carregar tarefas", e);
      return [];
    }
  });
  
  const [newTaskText, setNewTaskText] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.THINKING);
  const [quote, setQuote] = useState<string>(QUOTES.welcome[0]);
  const [logoError, setLogoError] = useState(false);
  
  // Undo State
  const [lastDeletedTask, setLastDeletedTask] = useState<Task | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // --- Effects ---
  
  // PWA Install Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('5task_data', JSON.stringify(tasks));
  }, [tasks]);

  // Update Avatar based on changes
  useEffect(() => {
    if (tasks.length === 0) {
      setMood(Mood.THINKING);
      setRandomQuote('welcome');
      return;
    }
    
    // Check if we just hit max
    if (tasks.length >= MAX_TASKS) {
      setMood(Mood.SHOCKED);
      setRandomQuote('full');
    }
  }, [tasks.length]);

  // Auto-hide undo toast after 4 seconds
  useEffect(() => {
    if (showUndo) {
      const timer = setTimeout(() => {
        setShowUndo(false);
        setLastDeletedTask(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showUndo]);

  // --- Helpers ---

  const setRandomQuote = useCallback((type: QuoteType) => {
    const options = QUOTES[type];
    const random = options[Math.floor(Math.random() * options.length)];
    setQuote(random);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  // --- Actions ---

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    if (tasks.length >= MAX_TASKS) {
      setMood(Mood.SHOCKED);
      setRandomQuote('full');
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
    setMood(Mood.THINKING);
    setRandomQuote('add');
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isNowComplete = !t.completed;
        if (isNowComplete) {
          setMood(Mood.HAPPY);
          setRandomQuote('complete');
        } else {
          setMood(Mood.THINKING);
        }
        return { ...t, completed: isNowComplete };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setLastDeletedTask(taskToDelete);
      setShowUndo(true);
      
      setTasks(prev => prev.filter(t => t.id !== id));
      setMood(Mood.EXCITED);
      setRandomQuote('delete');
    }
  };

  const undoDelete = () => {
    if (lastDeletedTask) {
      if (tasks.length >= MAX_TASKS) {
        alert("Não é possível desfazer: A lista já está cheia!");
        return;
      }
      setTasks(prev => [lastDeletedTask, ...prev]); 
      setShowUndo(false);
      setLastDeletedTask(null);
      setMood(Mood.HAPPY);
      setQuote("Ufa! Recuperei essa informação do buraco negro.");
    }
  };

  const deleteAll = () => {
    if (window.confirm('Einstein pergunta: Tem certeza que deseja apagar todo o conhecimento acumulado?')) {
      setTasks([]);
      setMood(Mood.SHOCKED);
      setRandomQuote('delete');
    }
  };

  const editTask = (id: string, newText: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const remainingSlots = MAX_TASKS - tasks.length;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* PWA Install Button (Only shows if browser prompts) */}
      {showInstallBtn && (
        <button 
          onClick={handleInstallClick}
          className="mb-4 bg-gradient-to-r from-neon-blue to-neon-purple text-slate-900 font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(0,243,255,0.4)] animate-bounce"
        >
          <Download size={18} />
          Instalar App
        </button>
      )}

      {/* Header */}
      <header className="w-full max-w-md text-center mb-2">
        <div className="flex items-center justify-center gap-3 mb-1">
          {logoError ? (
            <div className="w-10 h-10 rounded-lg bg-neon-purple flex items-center justify-center text-white font-bold text-xs border border-neon-blue shadow-[0_0_5px_rgba(0,243,255,0.5)]">
              5T
            </div>
          ) : (
            <img 
              src="./assets/5task%20logo.png" 
              onError={() => setLogoError(true)}
              alt="5task Logo" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]" 
            />
          )}
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            5task
          </h1>
        </div>
        <p className="text-xs text-slate-500 font-mono">
          Copyright © gillemosai | Todos os direitos reservados
        </p>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md flex flex-col flex-grow">
        
        {/* Avatar Section */}
        <EinsteinAvatar mood={mood} quote={quote} />

        {/* Task Counter */}
        <div className="flex justify-between items-end mb-2 px-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suas Missões</span>
          <span className={`text-xs font-mono px-2 py-1 rounded border ${remainingSlots === 0 ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-neon-blue text-neon-blue bg-neon-blue/10'}`}>
            Slots: {remainingSlots} / {MAX_TASKS}
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={addTask} className="relative mb-6">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            disabled={remainingSlots === 0}
            placeholder={remainingSlots === 0 ? "Memória cheia! Conclua algo." : "Nova tarefa..."}
            className={`w-full bg-slate-900/80 text-white pl-4 pr-12 py-4 rounded-2xl border-2 outline-none transition-all shadow-lg
              ${remainingSlots === 0 
                ? 'border-slate-700 opacity-50 cursor-not-allowed placeholder-red-400' 
                : 'border-slate-700 focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,243,255,0.2)] placeholder-slate-500'}`}
          />
          <button
            type="submit"
            disabled={remainingSlots === 0 || !newTaskText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neon-purple text-white rounded-xl hover:bg-neon-pink disabled:opacity-50 disabled:hover:bg-neon-purple transition-all duration-300"
          >
            <Plus size={20} />
          </button>
        </form>

        {/* Task List */}
        <div className="flex-grow space-y-4 pb-20">
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
              <p>Nenhuma tarefa na memória.</p>
              <p className="text-sm mt-2">Adicione algo para começar!</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={toggleComplete}
                onDelete={deleteTask}
                onEdit={editTask}
              />
            ))
          )}
        </div>
      </main>

      {/* Undo Notification Toast */}
      {showUndo && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center z-50 animate-[slideUp_0.3s_ease-out]">
           <div className="bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-4">
             <span className="text-sm">Tarefa excluída.</span>
             <button 
               onClick={undoDelete}
               className="flex items-center gap-1 text-neon-blue font-bold text-sm hover:underline"
             >
               <Undo2 size={16} /> Desfazer
             </button>
             <button onClick={() => setShowUndo(false)} className="text-slate-500 hover:text-white ml-2">
               <X size={14} />
             </button>
           </div>
        </div>
      )}

      {/* Floating Action Button for Delete All (if tasks exist) */}
      {tasks.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
          <button
            onClick={deleteAll}
            className="pointer-events-auto bg-slate-900/90 backdrop-blur border border-red-900/50 text-red-400 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:bg-red-950/80 hover:text-red-200 transition-all active:scale-95"
          >
            <Trash2 size={16} />
            <span className="text-sm font-bold">Limpar Memória</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;