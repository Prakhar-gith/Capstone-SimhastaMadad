import {
    AlertTriangle,
    Users,
    Clock,
    Activity,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { useAlertsStore } from '../store/alertsStore';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { SkeletonStatsCard } from './ui/Skeleton';

function AnimatedStat({ value, suffix = '' }) {
    const num = typeof value === 'number' ? value : parseInt(value) || 0;
    const animated = useAnimatedCounter(num);
    return <>{animated}{suffix}</>;
}

export function StatsCards() {
    const { alerts, volunteers, meshHealth, isLoading } = useAlertsStore();

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonStatsCard key={i} />
                ))}
            </div>
        );
    }

    const activeAlerts = alerts.filter(a => a.status !== 'resolved').length;
    const criticalAlerts = alerts.filter(a => a.priority === 'critical' && a.status !== 'resolved').length;
    const onlineVolunteers = volunteers.filter(v => v.status !== 'offline').length;

    const stats = [
        {
            title: 'Active Alerts',
            value: activeAlerts,
            subValue: `${criticalAlerts} critical`,
            icon: AlertTriangle,
            gradient: 'from-red-500/15 to-red-600/5',
            ring: 'ring-red-500/20',
            iconBg: 'bg-red-500/15',
            iconColor: 'text-red-400',
            trend: criticalAlerts > 2 ? 'up' : 'down',
        },
        {
            title: 'Volunteers Online',
            value: onlineVolunteers,
            subValue: `of ${volunteers.length} total`,
            icon: Users,
            gradient: 'from-blue-500/15 to-blue-600/5',
            ring: 'ring-blue-500/20',
            iconBg: 'bg-blue-500/15',
            iconColor: 'text-blue-400',
            trend: 'up',
        },
        {
            title: 'Avg Response',
            value: '2m 14s',
            subValue: 'Last 24 hours',
            icon: Clock,
            gradient: 'from-amber-500/15 to-amber-600/5',
            ring: 'ring-amber-500/20',
            iconBg: 'bg-amber-500/15',
            iconColor: 'text-amber-400',
            trend: 'down',
            isText: true,
        },
        {
            title: 'Mesh Health',
            value: meshHealth,
            suffix: '%',
            subValue: 'Connectivity',
            icon: Activity,
            gradient: 'from-emerald-500/15 to-emerald-600/5',
            ring: 'ring-emerald-500/20',
            iconBg: 'bg-emerald-500/15',
            iconColor: 'text-emerald-400',
            trend: 'up',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, index) => (
                <div
                    key={stat.title}
                    className={`relative rounded-xl bg-gradient-to-br ${stat.gradient} ring-1 ${stat.ring} p-4 animate-fadeIn stagger-${index + 1}`}
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
                                {stat.isText ? stat.value : <AnimatedStat value={stat.value} suffix={stat.suffix || ''} />}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1">{stat.subValue}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                            </div>
                            {stat.trend === 'up' ? (
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
