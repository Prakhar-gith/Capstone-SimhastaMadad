import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Shield, ChevronDown } from 'lucide-react';
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

        // Simulate network delay
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
                }} />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/25">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Saarthi</h1>
                    <p className="text-slate-400">Simhastha Madad Command Center</p>
                    <p className="text-sm text-slate-500 mt-1">Ujjain 2028</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                                    <User className="w-5 h-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-14 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full py-3"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-slate-700">
                        <button
                            onClick={() => setShowCredentials(!showCredentials)}
                            className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-slate-300 transition-colors"
                        >
                            <span>Demo Credentials</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCredentials ? 'rotate-180' : ''}`} />
                        </button>

                        {showCredentials && (
                            <div className="mt-4 space-y-2">
                                {MOCK_USERS.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => handleQuickLogin(user)}
                                        className="w-full p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-left transition-colors group"
                                    >
                                        <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500">{user.role}</p>
                                        <p className="text-xs text-slate-600 mt-1 font-mono">
                                            {user.id} / {user.password}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-600 mt-6">
                    MeshGuard Emergency Response System • Demo Version
                </p>
            </div>
        </div>
    );
}
