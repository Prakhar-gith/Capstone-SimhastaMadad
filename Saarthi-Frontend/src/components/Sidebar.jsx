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
    { path: '/incidents', icon: ClipboardList, label: 'Incident Logs' },
    { path: '/volunteers', icon: Users, label: 'Volunteers' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function Sidebar({ isOpen, onClose }) {
    const alerts = useAlertsStore((state) => state.alerts);
    const activeAlerts = alerts.filter(a => a.status !== 'resolved').length;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed lg:static inset-y-0 left-0 z-50 w-56 flex-shrink-0 bg-slate-900 border-r border-slate-700 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Mobile Close Button */}
                <div className="lg:hidden flex justify-end p-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Alert Summary Card */}
                <div className="p-3 lg:pt-4">
                    <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-lg p-3 border border-red-500/20">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-red-500/20 rounded-lg flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl font-bold text-white leading-tight">{activeAlerts}</p>
                                <p className="text-xs text-slate-400 truncate">Active Alerts</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-3 overflow-y-auto">
                    <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Menu
                    </p>
                    <ul className="space-y-0.5">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-blue-600/20 text-blue-400'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                        )
                                    }
                                >
                                    <item.icon className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Bottom Section */}
                <div className="p-3 border-t border-slate-700 flex-shrink-0">
                    <div className="text-xs text-slate-500">
                        <p className="font-medium text-slate-400">Simhastha 2028</p>
                        <p className="truncate">Ujjain, MP • v1.0.0</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
