import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    ClipboardList,
    Users,
    BarChart3,
    X,
    AlertCircle
} from 'lucide-react';
import { useAlertsStore } from '../store/alertsStore';
import { cn } from '../lib/utils';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Overview' },
    { path: '/map', icon: Map, label: 'Live Map' },
    { path: '/incidents', icon: ClipboardList, label: 'Incidents' },
    { path: '/volunteers', icon: Users, label: 'Volunteers' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function Sidebar({ isOpen, onClose }) {
    const alerts = useAlertsStore((state) => state.alerts);
    const activeAlerts = alerts.filter(a => a.status !== 'resolved').length;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    'fixed lg:static inset-y-0 left-0 z-50 w-56 flex-shrink-0 bg-[hsl(228,22%,8%)] border-r border-white/[0.06] flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="lg:hidden flex justify-end p-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors text-slate-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-3 lg:pt-4">
                    <div className="rounded-xl p-3 bg-gradient-to-br from-red-500/[0.08] to-orange-500/[0.04] border border-red-500/[0.12]">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-red-500/15 rounded-lg flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold text-white leading-tight tabular-nums">{activeAlerts}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Active Alerts</p>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-2 py-3 overflow-y-auto">
                    <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-[0.15em]">
                        Navigation
                    </p>
                    <ul className="space-y-0.5">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/'}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        cn(
                                            'relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-blue-500/[0.1] text-blue-400'
                                                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full" />
                                            )}
                                            <item.icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate">{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
                    <div className="text-[10px] text-slate-600">
                        <p className="font-semibold text-slate-500 uppercase tracking-wider">Simhastha 2028</p>
                        <p className="truncate mt-0.5">Ujjain, MP • v1.0.0</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
