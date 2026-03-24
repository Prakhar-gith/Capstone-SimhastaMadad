import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, Clock, AlertTriangle, FileText, FileSpreadsheet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAlertsStore } from '../store/alertsStore';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { SkeletonStatsCard, SkeletonChart } from '../components/ui/Skeleton';
import { ANALYTICS_DATA, EMERGENCY_TYPES, CROWD_DENSITY_ZONES } from '../lib/mockData';
import { exportAnalyticsToPDF, exportToCSV } from '../lib/exportUtils';

const chartTooltipStyle = {
    backgroundColor: 'hsl(225, 20%, 10%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
};

const chartItemStyle = { color: '#e2e8f0', fontSize: '12px' };

function AnimatedValue({ value, suffix = '' }) {
    const animated = useAnimatedCounter(typeof value === 'number' ? value : parseInt(value) || 0);
    return <>{animated}{suffix}</>;
}

export function Analytics() {
    const { alerts, isLoading } = useAlertsStore();

    const totalAlerts = alerts.length;
    const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;
    const resolutionRate = totalAlerts ? Math.round((resolvedAlerts / totalAlerts) * 100) : 0;

    const quickStats = [
        { title: 'Total Alerts', value: totalAlerts, icon: AlertTriangle, gradient: 'from-blue-500/10 to-blue-600/5', ring: 'ring-blue-500/15', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
        { title: 'Resolution', value: resolutionRate, suffix: '%', icon: TrendingUp, gradient: 'from-emerald-500/10 to-emerald-600/5', ring: 'ring-emerald-500/15', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
        { title: 'Avg Response', value: '2m 14s', isText: true, icon: Clock, gradient: 'from-amber-500/10 to-amber-600/5', ring: 'ring-amber-500/15', iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
        { title: 'Volunteers', value: 340, icon: Users, gradient: 'from-purple-500/10 to-purple-600/5', ring: 'ring-purple-500/15', iconBg: 'bg-purple-500/15', iconColor: 'text-purple-400' },
    ];

    const handleExportPDF = () => {
        exportAnalyticsToPDF(ANALYTICS_DATA, quickStats.map(s => ({
            title: s.title,
            value: s.isText ? s.value : `${s.value}${s.suffix || ''}`,
        })));
    };

    const handleExportCSV = () => {
        const data = ANALYTICS_DATA.alertsByType.map(t => ({
            name: t.name,
            value: t.value,
        }));
        exportToCSV(data, 'analytics_alerts_by_type', [
            { label: 'Type', accessor: 'name' },
            { label: 'Count', accessor: 'value' },
        ]);
    };

    return (
        <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Analytics & Insights</h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Data-driven overview of emergency response</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportCSV} title="Export CSV">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">CSV</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportPDF} title="Export PDF">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">PDF</span>
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonStatsCard key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    {quickStats.map((stat, index) => (
                        <div key={stat.title} className={`rounded-xl bg-gradient-to-br ${stat.gradient} ring-1 ${stat.ring} p-3 sm:p-4 animate-fadeIn stagger-${index + 1}`}>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`p-2 sm:p-2.5 ${stat.iconBg} rounded-xl`}>
                                    <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold text-white tabular-nums tracking-tight">
                                        {stat.isText ? stat.value : <AnimatedValue value={stat.value} suffix={stat.suffix || ''} />}
                                    </p>
                                    <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider">{stat.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <SkeletonChart /> : (
                            <div className="h-[240px] sm:h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={ANALYTICS_DATA.alertsByType}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={3}
                                            dataKey="value"
                                            strokeWidth={0}
                                        >
                                            {ANALYTICS_DATA.alertsByType.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartItemStyle} />
                                        <Legend
                                            wrapperStyle={{ paddingTop: '12px' }}
                                            formatter={(value) => <span style={{ color: '#64748b', fontSize: '10px' }}>{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alerts Trend (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <SkeletonChart /> : (
                            <div className="h-[240px] sm:h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ANALYTICS_DATA.alertsTrend}>
                                        <defs>
                                            <linearGradient id="alertsGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="hour" stroke="#334155" tick={{ fill: '#475569', fontSize: 9 }} interval={4} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#334155" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartItemStyle} />
                                        <Area type="monotone" dataKey="alerts" stroke="#ef4444" fill="url(#alertsGradient)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Response Time (7d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <SkeletonChart /> : (
                            <div className="h-[240px] sm:h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={ANALYTICS_DATA.responseTimesTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="date" stroke="#334155" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#334155" tick={{ fill: '#475569', fontSize: 9 }} unit="m" tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartItemStyle} formatter={(value) => [`${value} min`, 'Avg Response']} />
                                        <Line type="monotone" dataKey="avgTime" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: '#3b82f6', stroke: '#1e3a5f', strokeWidth: 2 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>High-Risk Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <SkeletonChart /> : (
                            <div className="h-[240px] sm:h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={CROWD_DENSITY_ZONES} layout="vertical" margin={{ left: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis type="number" stroke="#334155" tick={{ fill: '#475569', fontSize: 9 }} domain={[0, 100]} tickLine={false} axisLine={false} />
                                        <YAxis type="category" dataKey="name" stroke="#334155" tick={{ fill: '#64748b', fontSize: 9 }} width={90} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartItemStyle} formatter={(value) => [`${value}%`, 'Density']} />
                                        <Bar dataKey="density" fill="#f59e0b" radius={[0, 4, 4, 0]}>
                                            {CROWD_DENSITY_ZONES.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        entry.risk === 'critical' ? '#ef4444' :
                                                            entry.risk === 'high' ? '#f97316' :
                                                                entry.risk === 'medium' ? '#eab308' : '#22c55e'
                                                    }
                                                    opacity={0.8}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
