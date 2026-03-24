import { useState, useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff, Clock, LogOut, Menu, Search, Volume2, VolumeX } from 'lucide-react';
import logoIcon from '../assets/logo-saarthi.png';
import { useAuthStore } from '../store/authStore';
import { useAlertsStore } from '../store/alertsStore';
import { useAudioStore } from '../hooks/useAudioAlert';
import { Button } from './ui/Button';
import { formatTime } from '../lib/utils';

export function Header({ onMenuClick, onSearchClick }) {
    const { user, logout } = useAuthStore();
    const { lastSync, networkStatus, meshHealth, forceRefresh } = useAlertsStore();
    const { isMuted, toggleMute } = useAudioStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        forceRefresh();
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    return (
        <header className="h-14 flex-shrink-0 bg-[hsl(225,20%,10%)]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-3 lg:px-5">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors flex-shrink-0 text-slate-400"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center flex-shrink-0 p-0.5">
                        <img src={logoIcon} alt="Saarthi" className="w-full h-full object-contain" />
                    </div>
                    <div className="hidden sm:block min-w-0">
                        <h1 className="text-sm font-bold text-white leading-tight tracking-wide">SAARTHI</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Command Center</p>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                <button
                    onClick={onSearchClick}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors group"
                >
                    <Search className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
                    <span className="text-xs text-slate-600 group-hover:text-slate-400">Search...</span>
                    <kbd className="text-[9px] font-mono text-slate-700 px-1 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded">⌘K</kbd>
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono text-xs text-slate-300 tabular-nums">
                        {formatTime(currentTime)} IST
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {networkStatus === 'online' ? (
                        <>
                            <div className="relative">
                                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-statusPulse" />
                            </div>
                            <span className="text-[11px] font-medium text-emerald-400">MESH</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-[11px] font-medium text-red-400">OFFLINE</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                                width: `${meshHealth}%`,
                                background: meshHealth > 80
                                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                                    : meshHealth > 50
                                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                        : 'linear-gradient(90deg, #ef4444, #f87171)'
                            }}
                        />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">{meshHealth}%</span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${isMuted ? 'text-red-400 hover:text-red-300' : 'text-slate-500 hover:text-slate-300'}`}
                    onClick={toggleMute}
                    title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
                >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </Button>

                <span className="hidden lg:block text-[10px] text-slate-600 font-mono whitespace-nowrap">
                    SYNC {formatTime(lastSync)}
                </span>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    title="Force sync"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>

                <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/[0.06] min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                        <span className="text-[10px] font-bold text-blue-400">
                            {user?.name?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <div className="text-right min-w-0 hidden md:block">
                        <p className="text-xs font-medium text-slate-200 truncate max-w-[100px]">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user?.role}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-500 hover:text-red-400" onClick={logout} title="Logout">
                        <LogOut className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
