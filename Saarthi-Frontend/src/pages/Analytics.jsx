import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { useAlertsStore } from '../store/alertsStore';
import { ANALYTICS_DATA, EMERGENCY_TYPES, CROWD_DENSITY_ZONES } from '../lib/mockData';

export function Analytics() {
    const { alerts } = useAlertsStore();

    // Calculate stats
    const totalAlerts = alerts.length;
    const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;
    const resolutionRate = totalAlerts ? Math.round((resolvedAlerts / totalAlerts) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Analytics & Insights</h1>
                <p className="text-slate-400 mt-1">Data-driven overview of emergency response</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-500/20 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{totalAlerts}</p>
                                <p className="text-xs text-slate-400">Total Alerts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{resolutionRate}%</p>
                                <p className="text-xs text-slate-400">Resolution Rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-500/20 rounded-xl">
                                <Clock className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">2m 14s</p>
                                <p className="text-xs text-slate-400">Avg Response</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-500/20 rounded-xl">
                                <Users className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">340</p>
                                <p className="text-xs text-slate-400">Active Volunteers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alerts by Type */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ANALYTICS_DATA.alertsByType}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {ANALYTICS_DATA.alertsByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                    />
                                    <Legend
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alerts Trend (24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={ANALYTICS_DATA.alertsTrend}>
                                    <defs>
                                        <linearGradient id="alertsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis
                                        dataKey="hour"
                                        stroke="#64748b"
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        interval={3}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                        itemStyle={{ color: '#e2e8f0' }}
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

                {/* Response Time Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Response Time Trend (7d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ANALYTICS_DATA.responseTimesTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#64748b"
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        unit="m"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                        formatter={(value) => [`${value} min`, 'Avg Response Time']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="avgTime"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', strokeWidth: 0 }}
                                        activeDot={{ r: 6, fill: '#3b82f6' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* High Risk Areas */}
                <Card>
                    <CardHeader>
                        <CardTitle>High-Risk Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={CROWD_DENSITY_ZONES}
                                    layout="vertical"
                                    margin={{ left: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis
                                        type="number"
                                        stroke="#64748b"
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        domain={[0, 100]}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#64748b"
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        width={120}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #334155',
                                            borderRadius: '8px',
                                        }}
                                        itemStyle={{ color: '#e2e8f0' }}
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
