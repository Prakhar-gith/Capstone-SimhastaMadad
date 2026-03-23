import { useState, useEffect } from 'react';
import { RefreshCw, Wifi, WifiOff, Clock, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAlertsStore } from '../store/alertsStore';
import { Button } from './ui/Button';
import { formatTime } from '../lib/utils';

export function Header({ onMenuClick }) {
    const { user, logout } = useAuthStore();
    const { lastSync, networkStatus, meshHealth, forceRefresh } = useAlertsStore();
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
        <header className="h-14 flex-shrink-0 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 flex items-center justify-between px-3 lg:px-4">
            {/* Left Section */}
            <div className="flex items-center gap-2 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-1.5 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 min-w-0">
                    {/* Logo/Brand */}
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">S</span>
                    </div>
                    <div className="hidden sm:block min-w-0">
                        <h1 className="text-sm font-bold text-white leading-tight">Saarthi</h1>
                        <p className="text-xs text-slate-400 truncate">Simhastha Madad</p>
                    </div>
                </div>
            </div>

            {/* Center - Time & Status */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                {/* Current Time */}
                <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono text-xs">
                        {formatTime(currentTime)} IST
                    </span>
                </div>

                {/* Network Status */}
                <div className="flex items-center gap-1.5">
                    {networkStatus === 'online' ? (
                        <>
                            <div className="relative">
                                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            </div>
                            <span className="text-xs text-emerald-400">Mesh Online</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-xs text-red-400">Mesh Offline</span>
                        </>
                    )}
                </div>

                {/* Mesh Health */}
                <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-500"
                            style={{ width: `${meshHealth}%` }}
                        />
                    </div>
                    <span className="text-xs text-slate-300">{meshHealth}%</span>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 min-w-0">
                {/* Last Sync */}
                <span className="hidden lg:block text-xs text-slate-500 whitespace-nowrap">
                    Last sync: {formatTime(lastSync)}
                </span>

                {/* Refresh Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline text-xs ml-1">Refresh</span>
                </Button>

                {/* User Info & Logout */}
                <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-700 min-w-0">
                    <div className="text-right min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate max-w-[100px]">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.role}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={logout} title="Logout">
                        <LogOut className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
