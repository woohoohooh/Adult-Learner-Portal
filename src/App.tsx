import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Bell, 
  ChevronLeft, 
  LogOut, 
  Send,
  FileText,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface UserData {
  id: string;
  name: string;
  email: string;
  program: string;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  date: string;
  content: string;
}

interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
}

type View = 'login' | 'dashboard' | 'resources' | 'resource-detail' | 'message' | 'updates' | 'account';

// --- Components ---

const Header = ({ title, onBack, onLogout, showLogout }: { title: string; onBack?: () => void; onLogout?: () => void; showLogout?: boolean }) => (
  <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
    <div className="flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-xl font-semibold tracking-tight truncate max-w-[200px]">{title}</h1>
    </div>
    {showLogout && (
      <button onClick={onLogout} className="text-slate-500 hover:text-red-600 transition-colors">
        <LogOut className="w-6 h-6" />
      </button>
    )}
  </header>
);

export default function App() {
  const [view, setView] = useState<View>('login');
  const [user, setUser] = useState<UserData | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock data states
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    if (view === 'resources') {
      fetch('/api/resources').then(res => res.json()).then(setResources);
    }
    if (view === 'updates') {
      fetch('/api/updates').then(res => res.json()).then(setUpdates);
    }
  }, [view]);

  const handleLogin = async (e?: React.FormEvent, isGuest: boolean = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isGuest })
      });
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        setView('dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setEmail('');
    setPassword('');
  };

  const renderView = () => {
    switch (view) {
      case 'login':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col min-h-screen bg-white px-8 pt-12"
          >
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-semibold mb-2">Welcome Back</h1>
              <p className="text-slate-500 text-base">Sign in to your account</p>
            </div>

            <form onSubmit={(e) => handleLogin(e)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all text-lg"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                  <button 
                    type="button"
                    onClick={() => alert('Contact the school office to reset.')}
                    className="text-xs font-semibold text-accent uppercase tracking-wider"
                  >
                    Forgot?
                  </button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all text-lg"
                  placeholder="••••••••"
                />
              </div>
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-4 text-xl"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => handleLogin(undefined, true)}
                className="text-base font-semibold text-slate-400 hover:text-accent transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </motion.div>
        );

      case 'dashboard':
        return (
          <div className="flex flex-col min-h-screen">
            <Header title="Learner Portal" showLogout onLogout={handleLogout} />
            <main className="p-5 space-y-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow">
                <h2 className="text-xl font-semibold mb-1">Hello, {user?.name}!</h2>
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{user?.program}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button onClick={() => setView('account')} className="btn-secondary px-8 py-6">
                  <User className="w-8 h-8 text-accent shrink-0" />
                  <div className="text-left">
                    <div className="text-xl font-semibold">Account Access</div>
                    <div className="text-base font-medium text-slate-400">View your profile</div>
                  </div>
                </button>

                <button onClick={() => alert('Your internal classes are coming soon!')} className="btn-secondary px-8 py-6 border-blue-100 bg-blue-50/30">
                  <BookOpen className="w-8 h-8 text-accent shrink-0" />
                  <div className="text-left">
                    <div className="text-xl font-semibold">My Classes</div>
                    <div className="text-base font-medium text-slate-400">Learn inside the app</div>
                  </div>
                </button>

                <button onClick={() => setView('resources')} className="btn-secondary px-8 py-6">
                  <FileText className="w-8 h-8 text-accent shrink-0" />
                  <div className="text-left">
                    <div className="text-xl font-semibold">Learner Resources</div>
                    <div className="text-base font-medium text-slate-400">Study guides and materials</div>
                  </div>
                </button>

                <button onClick={() => setView('message')} className="btn-secondary px-8 py-6">
                  <MessageSquare className="w-8 h-8 text-accent shrink-0" />
                  <div className="text-left">
                    <div className="text-xl font-semibold">Message Us</div>
                    <div className="text-base font-medium text-slate-400">Contact the school office</div>
                  </div>
                </button>

                <button onClick={() => setView('updates')} className="btn-secondary px-8 py-6">
                  <Bell className="w-8 h-8 text-accent shrink-0" />
                  <div className="text-left">
                    <div className="text-xl font-semibold">Updates</div>
                    <div className="text-base font-medium text-slate-400">News and announcements</div>
                  </div>
                </button>
              </div>
            </main>
          </div>
        );

      case 'account':
        return (
          <div className="flex flex-col min-h-screen">
            <Header title="My Account" onBack={() => setView('dashboard')} />
            <main className="p-5 space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <User className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-semibold">{user?.name}</h2>
                <p className="text-slate-400 text-base mb-8">{user?.email}</p>
                
                <div className="space-y-4 text-left border-t border-slate-50 pt-8">
                  <div>
                    <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Program</label>
                    <p className="text-lg font-semibold">{user?.program}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Student ID</label>
                    <p className="text-lg font-semibold">#2024-001</p>
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-secondary w-full text-red-500 border-red-50 text-sm py-3">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </main>
          </div>
        );

      case 'resources':
        return (
          <div className="flex flex-col min-h-screen">
            <Header title="Resources" onBack={() => setView('dashboard')} />
            <main className="p-5 space-y-4">
              {resources.map(item => (
                <button 
                  key={item.id} 
                  onClick={() => {
                    setSelectedResource(item);
                    setView('resource-detail');
                  }}
                  className="btn-secondary w-full px-8 py-6"
                >
                  <FileText className="w-8 h-8 text-accent shrink-0" />
                  <div className="text-left">
                    <div className="text-xl font-semibold">{item.title}</div>
                    <div className="text-base font-medium text-slate-400 uppercase tracking-wider">{item.type} • {item.date}</div>
                  </div>
                </button>
              ))}
            </main>
          </div>
        );

      case 'resource-detail':
        return (
          <div className="flex flex-col min-h-screen">
            <Header title={selectedResource?.title || 'Resource'} onBack={() => setView('resources')} />
            <main className="p-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow min-h-[50vh]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-50 text-accent px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">{selectedResource?.type}</span>
                  <span className="text-slate-300 text-[10px] font-semibold">{selectedResource?.date}</span>
                </div>
                <h2 className="text-2xl font-semibold mb-6">{selectedResource?.title}</h2>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                  {selectedResource?.content}
                </div>
              </div>
            </main>
          </div>
        );

      case 'message':
        return (
          <div className="flex flex-col min-h-screen">
            <Header title="Message Us" onBack={() => setView('dashboard')} />
            <main className="p-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow space-y-4">
                <p className="text-sm text-slate-500">Send us a message and we will get back to you soon.</p>
                <div className="space-y-3">
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-accent outline-none transition-all resize-none text-sm"
                    placeholder="How can we help you?"
                  ></textarea>
                  <button 
                    onClick={() => {
                      alert('Sent!');
                      setView('dashboard');
                    }}
                    className="btn-primary w-full py-3 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </div>
              </div>
            </main>
          </div>
        );

      case 'updates':
        return (
          <div className="flex flex-col min-h-screen">
            <Header title="Updates" onBack={() => setView('dashboard')} />
            <main className="p-5 space-y-4">
              {updates.map(update => (
                <div key={update.id} className="bg-white p-5 rounded-2xl border border-slate-100 card-shadow">
                  <div className="flex items-center gap-1.5 text-accent mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">{update.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1.5">{update.title}</h3>
                  <p className="text-slate-600 text-base leading-relaxed">{update.content}</p>
                </div>
              ))}
            </main>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg-soft shadow-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
