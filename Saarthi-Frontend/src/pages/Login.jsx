import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ChevronDown } from 'lucide-react';
import logoWithText from '../assets/logo and text.png';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { MOCK_USERS } from '../lib/mockData';

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCredentials, setShowCredentials] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        const result = login(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError('Invalid credentials. Please try again.');
        }
        setIsLoading(false);
    };

    const handleQuickLogin = (user) => {
        setUsername(user.id);
        setPassword(user.password);
    };

    return (
        <div className="min-h-screen bg-[hsl(230,25%,7%)] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)
                    `
                }} />
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }} />
            </div>

            <div className="w-full max-w-md relative animate-fadeIn">
                <div className="text-center mb-8 flex justify-center">
                    <div className="inline-flex items-center justify-center bg-white/90 rounded-2xl p-1 shadow-2xl shadow-blue-500/20">
                        <img src={logoWithText} alt="Saarthi - Simhastha 2028 Emergency Command Center" className="h-48 object-contain" />
                    </div>
                </div>

                <div className="bg-[hsl(225,20%,10%)]/80 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40 p-8">
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent -mt-8 mb-8 -mx-8 rounded-t-2xl" />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center pointer-events-none">
                                    <User className="w-4 h-4 text-slate-600" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center pointer-events-none">
                                    <Lock className="w-4 h-4 text-slate-600" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/[0.08] border border-red-500/20 rounded-lg text-red-400 text-xs">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-3 text-sm font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-white/[0.06]">
                        <button
                            onClick={() => setShowCredentials(!showCredentials)}
                            className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-400 transition-colors uppercase tracking-wider font-medium"
                        >
                            <span>Demo Credentials</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCredentials ? 'rotate-180' : ''}`} />
                        </button>

                        {showCredentials && (
                            <div className="mt-3 space-y-1.5 animate-fadeIn">
                                {MOCK_USERS.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleQuickLogin(user)}
                                        className="w-full p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-left transition-all group border border-transparent hover:border-white/[0.06]"
                                    >
                                        <p className="text-xs font-medium text-slate-300 group-hover:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-[10px] text-slate-600 mt-0.5">{user.role}</p>
                                        <p className="text-[10px] text-slate-700 mt-1 font-mono">
                                            {user.id} / {user.password}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-700 mt-6 uppercase tracking-widest">
                    MeshGuard Emergency Response • Demo
                </p>
            </div>
        </div>
    );
}
