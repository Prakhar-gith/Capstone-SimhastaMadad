import {
    AlertTriangle,
    Users,
    Clock,
    Activity,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { useAlertsStore } from '../store/alertsStore';
import { Card } from './ui/Card';

export function StatsCards() {
    const { alerts, volunteers, meshHealth } = useAlertsStore();

    const activeAlerts = alerts.filter(a => a.status !== 'resolved').length;
    const criticalAlerts = alerts.filter(a => a.priority === 'critical' && a.status !== 'resolved').length;
    const onlineVolunteers = volunteers.filter(v => v.status !== 'offline').length;

    // Calculate average response time (mock)
    const avgResponseTime = '2m 14s';

    const stats = [
        {
            title: 'Active Alerts',
            value: activeAlerts,
            subValue: `${criticalAlerts} critical`,
            icon: AlertTriangle,
            color: 'red',
            trend: criticalAlerts > 2 ? 'up' : 'down',
        },
        {
            title: 'Volunteers Online',
            value: onlineVolunteers,
            subValue: `of ${volunteers.length} total`,
            icon: Users,
            color: 'blue',
            trend: 'up',
        },
        {
            title: 'Avg Response Time',
            value: avgResponseTime,
            subValue: 'Last 24 hours',
            icon: Clock,
            color: 'amber',
            trend: 'down',
        },
        {
            title: 'Mesh Health',
            value: `${meshHealth}%`,
            subValue: 'Connectivity',
            icon: Activity,
            color: 'emerald',
            trend: 'up',
        },
    ];

    const colorClasses = {
        red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
        blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
        amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
        emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card
                    key={stat.title}
                    className={`bg-gradient-to-br ${colorClasses[stat.color]} border`}
                >
                    <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-slate-400 mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs text-slate-500 mt-1">{stat.subValue}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <div className="p-2.5 rounded-xl bg-slate-800/50">
                                    <stat.icon className={`w-5 h-5 ${colorClasses[stat.color].split(' ').pop()}`} />
                                </div>
                                {stat.trend === 'up' ? (
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-400" />
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
