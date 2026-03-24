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
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-xs text-slate-500 mt-0.5">Real-time emergency monitoring for Simhastha 2028</p>
            </div>

            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <CardTitle>Recent Alerts</CardTitle>
                        <Link to="/incidents">
                            <Button variant="ghost" size="sm" className="h-7 text-[11px] text-slate-500 hover:text-slate-300">
                                View All <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/[0.04]">
                            {recentAlerts.length === 0 ? (
                                <div className="p-8 text-center text-slate-600 text-sm">
                                    No alerts yet. System is monitoring...
                                </div>
                            ) : (
                                recentAlerts.map((alert, index) => {
                                    const emergencyType = EMERGENCY_TYPES.find(t => t.id === alert.emergency_type);
                                    return (
                                        <div
                                            key={alert.id}
                                            className={`p-3 hover:bg-white/[0.02] transition-colors animate-fadeIn stagger-${index + 1}`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: `${emergencyType?.color}12` }}
                                                    >
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full"
                                                            style={{ backgroundColor: emergencyType?.color }}
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <span className="text-[13px] font-medium text-slate-200 truncate">
                                                                {emergencyType?.label || 'Emergency'}
                                                            </span>
                                                            <Badge variant={alert.priority}>{alert.priority}</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                                            <span className="truncate">{alert.location_name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <Badge variant={alert.status}>{alert.status.replace('_', ' ')}</Badge>
                                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600 justify-end font-mono">
                                                        <Clock className="w-2.5 h-2.5" />
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

                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <CardTitle>Crowd Density</CardTitle>
                        <Link to="/map">
                            <Button variant="ghost" size="sm" className="h-7 text-[11px] text-slate-500 hover:text-slate-300">
                                Map <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-2">
                        {CROWD_DENSITY_ZONES.map((zone) => (
                            <div key={zone.id} className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-400 truncate mr-2">{zone.name}</span>
                                    <span className={`font-mono font-medium flex-shrink-0 tabular-nums ${zone.risk === 'critical' ? 'text-red-400' :
                                            zone.risk === 'high' ? 'text-orange-400' :
                                                zone.risk === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
                                        }`}>
                                        {zone.density}%
                                    </span>
                                </div>
                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700 ease-out"
                                        style={{
                                            width: `${zone.density}%`,
                                            background: zone.risk === 'critical' ? 'linear-gradient(90deg, #ef4444, #f87171)' :
                                                zone.risk === 'high' ? 'linear-gradient(90deg, #f97316, #fb923c)' :
                                                    zone.risk === 'medium' ? 'linear-gradient(90deg, #eab308, #facc15)' :
                                                        'linear-gradient(90deg, #10b981, #34d399)'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-xl bg-[hsl(225,20%,10%)]/50 border border-white/[0.04] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-statusPulse" />
                            <span className="text-slate-500">System Active</span>
                        </div>
                        <span className="text-slate-700 hidden sm:inline">|</span>
                        <span className="text-slate-600 hidden sm:inline font-mono">
                            {activeAlerts.length} alerts monitored
                        </span>
                    </div>
                    <span className="text-slate-700 font-mono uppercase tracking-wider text-[10px]">
                        Demo • Auto-simulation
                    </span>
                </div>
            </div>
        </div>
    );
}
