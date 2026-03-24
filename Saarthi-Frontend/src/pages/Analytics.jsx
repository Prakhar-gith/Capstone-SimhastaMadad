import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useAlertsStore } from '../store/alertsStore';
import { ANALYTICS_DATA, EMERGENCY_TYPES, CROWD_DENSITY_ZONES } from '../lib/mockData';

const chartTooltipStyle = {
    backgroundColor: 'hsl(225, 20%, 10%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
};

const chartItemStyle = { color: '#e2e8f0', fontSize: '12px' };

export function Analytics() {
    const { alerts } = useAlertsStore();

    const totalAlerts = alerts.length;
    const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;
    const resolutionRate = totalAlerts ? Math.round((resolvedAlerts / totalAlerts) * 100) : 0;

    const quickStats = [
        { title: 'Total Alerts', value: totalAlerts, icon: AlertTriangle, gradient: 'from-blue-500/10 to-blue-600/5', ring: 'ring-blue-500/15', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
        { title: 'Resolution', value: `${resolutionRate}%`, icon: TrendingUp, gradient: 'from-emerald-500/10 to-emerald-600/5', ring: 'ring-emerald-500/15', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
        { title: 'Avg Response', value: '2m 14s', icon: Clock, gradient: 'from-amber-500/10 to-amber-600/5', ring: 'ring-amber-500/15', iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
        { title: 'Volunteers', value: '340', icon: Users, gradient: 'from-purple-500/10 to-purple-600/5', ring: 'ring-purple-500/15', iconBg: 'bg-purple-500/15', iconColor: 'text-purple-400' },
    ];

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Analytics & Insights</h1>
                <p className="text-xs text-slate-500 mt-0.5">Data-driven overview of emergency response</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {quickStats.map((stat, index) => (
                    <div key={stat.title} className={`rounded-xl bg-gradient-to-br ${stat.gradient} ring-1 ${stat.ring} p-4 animate-fadeIn stagger-${index + 1}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 ${stat.iconBg} rounded-xl`}>
                                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white tabular-nums tracking-tight">{stat.value}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ANALYTICS_DATA.alertsByType}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {ANALYTICS_DATA.alertsByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={chartTooltipStyle}
                                        itemStyle={chartItemStyle}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '16px' }}
                                        formatter={(value) => <span style={{ color: '#64748b', fontSize: '11px' }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Alerts Trend (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ANALYTICS_DATA.alertsTrend}>
                                    <defs>
                                        <linearGradient id="alertsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis
                                        dataKey="hour"
                                        stroke="#334155"
                                        tick={{ fill: '#475569', fontSize: 10 }}
                                        interval={3}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#334155"
                                        tick={{ fill: '#475569', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={chartTooltipStyle}
                                        itemStyle={chartItemStyle}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="alerts"
                                        stroke="#ef4444"
                                        fill="url(#alertsGradient)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Response Time (7d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ANALYTICS_DATA.responseTimesTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#334155"
                                        tick={{ fill: '#475569', fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#334155"
                                        tick={{ fill: '#475569', fontSize: 10 }}
                                        unit="m"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={chartTooltipStyle}
                                        itemStyle={chartItemStyle}
                                        formatter={(value) => [`${value} min`, 'Avg Response']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="avgTime"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                                        activeDot={{ r: 5, fill: '#3b82f6', stroke: '#1e3a5f', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>High-Risk Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={CROWD_DENSITY_ZONES}
                                    layout="vertical"
                                    margin={{ left: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis
                                        type="number"
                                        stroke="#334155"
                                        tick={{ fill: '#475569', fontSize: 10 }}
                                        domain={[0, 100]}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#334155"
                                        tick={{ fill: '#64748b', fontSize: 10 }}
                                        width={110}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={chartTooltipStyle}
                                        itemStyle={chartItemStyle}
                                        formatter={(value) => [`${value}%`, 'Density']}
                                    />
                                    <Bar
                                        dataKey="density"
                                        fill="#f59e0b"
                                        radius={[0, 4, 4, 0]}
                                    >
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
