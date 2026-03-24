import { useState, useEffect, useRef } from 'react';
import { Search, X, AlertCircle, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAlertsStore } from '../store/alertsStore';
import { EMERGENCY_TYPES, UJJAIN_LOCATIONS } from '../lib/mockData';
import { cn } from '../lib/utils';

export function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { alerts, volunteers } = useAlertsStore();

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const q = query.toLowerCase().trim();

    const results = q.length < 1 ? [] : [
        ...alerts
            .filter(a => {
                const type = EMERGENCY_TYPES.find(t => t.id === a.emergency_type);
                return (
                    a.alert_id.toLowerCase().includes(q) ||
                    a.location_name.toLowerCase().includes(q) ||
                    type?.label.toLowerCase().includes(q) ||
                    a.user_info?.name?.toLowerCase().includes(q)
                );
            })
            .slice(0, 4)
            .map(a => ({
                id: `alert-${a.id}`,
                type: 'alert',
                title: `${EMERGENCY_TYPES.find(t => t.id === a.emergency_type)?.label} — ${a.alert_id}`,
                subtitle: a.location_name,
                action: () => { navigate('/incidents'); onClose(); },
            })),
        ...volunteers
            .filter(v => v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q) || v.location.toLowerCase().includes(q))
            .slice(0, 4)
            .map(v => ({
                id: `vol-${v.id}`,
                type: 'volunteer',
                title: v.name,
                subtitle: `${v.id} • ${v.location}`,
                action: () => { navigate('/volunteers'); onClose(); },
            })),
        ...UJJAIN_LOCATIONS
            .filter(l => l.name.toLowerCase().includes(q))
            .slice(0, 3)
            .map(l => ({
                id: `loc-${l.name}`,
                type: 'location',
                title: l.name,
                subtitle: `${l.lat.toFixed(4)}, ${l.lng.toFixed(4)}`,
                action: () => { navigate('/map'); onClose(); },
            })),
    ];

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            results[selectedIndex].action();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const typeIcons = {
        alert: AlertCircle,
        volunteer: Users,
        location: MapPin,
    };

    const typeLabels = {
        alert: 'Alert',
        volunteer: 'Volunteer',
        location: 'Location',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-lg mx-4 bg-[hsl(225,20%,10%)] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-scaleIn">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                    <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDown}
                        placeholder="Search alerts, volunteers, locations..."
                        className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
                    />
                    <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded text-[10px] text-slate-600 font-mono">
                        ESC
                    </kbd>
                </div>

                {q.length > 0 && (
                    <div className="max-h-[300px] overflow-y-auto py-1">
                        {results.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-sm text-slate-500">No results for "{query}"</p>
                                <p className="text-xs text-slate-700 mt-1">Try searching by name, location, or ID</p>
                            </div>
                        ) : (
                            results.map((result, index) => {
                                const Icon = typeIcons[result.type];
                                return (
                                    <button
                                        key={result.id}
                                        onClick={result.action}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={cn(
                                            'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                                            index === selectedIndex ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'
                                        )}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-3.5 h-3.5 text-slate-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-slate-200 truncate">{result.title}</p>
                                            <p className="text-[10px] text-slate-600 truncate">{result.subtitle}</p>
                                        </div>
                                        <span className="text-[9px] text-slate-700 uppercase tracking-wider flex-shrink-0">
                                            {typeLabels[result.type]}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                )}

                {q.length === 0 && (
                    <div className="py-6 text-center">
                        <p className="text-xs text-slate-600">Type to search across alerts, volunteers & locations</p>
                        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-slate-700">
                            <span><kbd className="px-1 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded font-mono mx-0.5">↑↓</kbd> Navigate</span>
                            <span><kbd className="px-1 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded font-mono mx-0.5">↵</kbd> Select</span>
                            <span><kbd className="px-1 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded font-mono mx-0.5">Esc</kbd> Close</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
