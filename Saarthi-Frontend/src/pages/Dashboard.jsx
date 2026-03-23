import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { StatsCards } from '../components/StatsCards';
import { useAlertsStore } from '../store/alertsStore';
import { useToastStore } from '../store/toastStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatRelativeTime } from '../lib/utils';
import { EMERGENCY_TYPES, CROWD_DENSITY_ZONES } from '../lib/mockData';

export function Dashboard() {
    const { alerts, simulateNewAlert, isSimulating } = useAlertsStore();
    const { addToast } = useToastStore();

    // Simulate new alerts every 10 seconds
    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(() => {
            const newAlert = simulateNewAlert();
            if (newAlert) {
                const type = EMERGENCY_TYPES.find(t => t.id === newAlert.emergency_type);
                addToast({
                    type: newAlert.priority === 'critical' ? 'error' : 'warning',
                    title: 'New Emergency Alert',
                    message: `${type?.label || 'Emergency'} near ${newAlert.location_name}`,
                    duration: 6000,
                });
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isSimulating, simulateNewAlert, addToast]);

    const recentAlerts = alerts.slice(0, 5);
    const activeAlerts = alerts.filter(a => a.status !== 'resolved');

    return (
        <div className="space-y-4">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-sm text-slate-400">Real-time emergency monitoring for Simhastha 2028</p>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Alerts */}
                <Card className="lg:col-span-2 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <CardTitle className="text-base">Recent Alerts</CardTitle>
                        <Link to="/incidents">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                                View All <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-700/50">
                            {recentAlerts.length === 0 ? (
                                <div className="p-6 text-center text-slate-500 text-sm">
                                    No alerts yet. System is monitoring...
                                </div>
                            ) : (
                                recentAlerts.map((alert) => {
                                    const emergencyType = EMERGENCY_TYPES.find(t => t.id === alert.emergency_type);
                                    return (
                                        <div
                                            key={alert.id}
                                            className="p-3 hover:bg-slate-700/30 transition-colors"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: `${emergencyType?.color}20` }}
                                                    >
                                                        <span
                                                            className="text-sm"
                                                            style={{ color: emergencyType?.color }}
                                                        >
                                                            ⚠
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="text-sm font-medium text-slate-200 truncate">
                                                                {emergencyType?.label || 'Emergency'}
                                                            </span>
                                                            <Badge variant={alert.priority} className="flex-shrink-0 text-xs">{alert.priority}</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                                            <span className="truncate">{alert.location_name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <Badge variant={alert.status} className="text-xs">{alert.status.replace('_', ' ')}</Badge>
                                                    <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 justify-end">
                                                        <Clock className="w-3 h-3" />
                                                        {formatRelativeTime(alert.timestamp)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Crowd Density */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <CardTitle className="text-base">Crowd Density</CardTitle>
                        <Link to="/map">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                                Map <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-2.5 p-4 pt-0">
                        {CROWD_DENSITY_ZONES.map((zone) => (
                            <div key={zone.id} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-300 truncate mr-2">{zone.name}</span>
                                    <span className={`font-medium flex-shrink-0 ${zone.risk === 'critical' ? 'text-red-400' :
                                            zone.risk === 'high' ? 'text-orange-400' :
                                                zone.risk === 'medium' ? 'text-yellow-400' : 'text-green-400'
                                        }`}>
                                        {zone.density}%
                                    </span>
                                </div>
                                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${zone.risk === 'critical' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                                                zone.risk === 'high' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                                                    zone.risk === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                                        'bg-gradient-to-r from-green-500 to-green-400'
                                            }`}
                                        style={{ width: `${zone.density}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* System Status */}
            <Card className="overflow-hidden">
                <CardContent className="py-3 px-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-slate-400">System Active</span>
                            </div>
                            <span className="text-slate-600 hidden sm:inline">|</span>
                            <span className="text-slate-400 hidden sm:inline">
                                {activeAlerts.length} active alerts monitored
                            </span>
                        </div>
                        <span className="text-slate-500">
                            Demo • New alert every 10s
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
