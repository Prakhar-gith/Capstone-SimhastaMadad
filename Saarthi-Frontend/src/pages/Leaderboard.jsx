import { Trophy, Medal, Star, TrendingUp, Clock, CheckCircle, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAlertsStore } from '../store/alertsStore';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { cn } from '../lib/utils';

function AnimatedValue({ value }) {
    const animated = useAnimatedCounter(value);
    return <>{animated}</>;
}

const BADGE_TIERS = [
    { min: 80, label: 'Gold Shield', icon: '🥇', color: 'text-amber-400', bg: 'from-amber-500/15 to-amber-600/5', ring: 'ring-amber-500/20' },
    { min: 50, label: 'Silver Shield', icon: '🥈', color: 'text-slate-300', bg: 'from-slate-400/15 to-slate-500/5', ring: 'ring-slate-400/20' },
    { min: 25, label: 'Bronze Shield', icon: '🥉', color: 'text-orange-400', bg: 'from-orange-500/15 to-orange-600/5', ring: 'ring-orange-500/20' },
    { min: 0, label: 'Rookie', icon: '⭐', color: 'text-blue-400', bg: 'from-blue-500/15 to-blue-600/5', ring: 'ring-blue-500/20' },
];

function getBadgeTier(score) {
    return BADGE_TIERS.find(t => score >= t.min) || BADGE_TIERS[BADGE_TIERS.length - 1];
}

export function Leaderboard() {
    const { volunteers } = useAlertsStore();

    const rankedVolunteers = [...volunteers]
        .map(v => {
            const baseScore = v.responsesHandled * 5;
            const statusBonus = v.status === 'online' ? 10 : v.status === 'responding' ? 15 : 0;
            const score = baseScore + statusBonus + Math.floor(Math.random() * 10);
            const avgResponseTime = (Math.random() * 3 + 1).toFixed(1);
            return { ...v, score, avgResponseTime };
        })
        .sort((a, b) => b.score - a.score);

    const topThree = rankedVolunteers.slice(0, 3);
    const rest = rankedVolunteers.slice(3);

    const podiumOrder = topThree.length === 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;
    const podiumHeights = ['h-28', 'h-36', 'h-24'];
    const podiumColors = [
        'from-slate-400/20 to-slate-500/5 ring-slate-400/30',
        'from-amber-400/20 to-amber-500/5 ring-amber-400/30',
        'from-orange-400/20 to-orange-500/5 ring-orange-400/30',
    ];
    const podiumRanks = ['2nd', '1st', '3rd'];
    const podiumTextColors = ['text-slate-300', 'text-amber-400', 'text-orange-400'];

    const totalResponses = rankedVolunteers.reduce((sum, v) => sum + v.responsesHandled, 0);
    const avgScore = rankedVolunteers.length > 0
        ? Math.round(rankedVolunteers.reduce((sum, v) => sum + v.score, 0) / rankedVolunteers.length)
        : 0;

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Volunteer Leaderboard</h1>
                <p className="text-xs text-slate-500 mt-0.5">Recognizing outstanding emergency response volunteers</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Responses', value: totalResponses, icon: CheckCircle, gradient: 'from-emerald-500/10 to-emerald-600/5', ring: 'ring-emerald-500/15', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
                    { label: 'Top Score', value: rankedVolunteers[0]?.score || 0, icon: Trophy, gradient: 'from-amber-500/10 to-amber-600/5', ring: 'ring-amber-500/15', iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
                    { label: 'Avg Score', value: avgScore, icon: TrendingUp, gradient: 'from-blue-500/10 to-blue-600/5', ring: 'ring-blue-500/15', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
                ].map((stat, i) => (
                    <div key={stat.label} className={`rounded-xl bg-gradient-to-br ${stat.gradient} ring-1 ${stat.ring} p-4 animate-fadeIn stagger-${i + 1}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 ${stat.iconBg} rounded-lg`}>
                                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-white tabular-nums"><AnimatedValue value={stat.value} /></p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {topThree.length >= 3 && (
                <Card className="overflow-hidden">
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            Top Performers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-center gap-4 pt-4 pb-2">
                            {podiumOrder.map((v, i) => {
                                const tier = getBadgeTier(v.score);
                                return (
                                    <div key={v.id} className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-2 relative">
                                            <span className="text-sm font-bold text-slate-300">{v.name.charAt(0)}</span>
                                            {i === 1 && (
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                                                    <Star className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-slate-200 text-center truncate max-w-[80px] mb-1">{v.name.split(' ')[0]}</p>
                                        <span className="text-lg font-bold tabular-nums text-white mb-2"><AnimatedValue value={v.score} /></span>
                                        <div className={cn(
                                            'w-20 rounded-t-xl bg-gradient-to-b ring-1 flex items-end justify-center pb-2',
                                            podiumColors[i],
                                            podiumHeights[i]
                                        )}>
                                            <span className={cn('text-xl font-bold', podiumTextColors[i])}>{podiumRanks[i]}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="overflow-hidden">
                <CardHeader className="py-3 px-4">
                    <CardTitle>Full Rankings</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                {['Rank', 'Volunteer', 'Responses', 'Avg Time', 'Score', 'Badge'].map(h => (
                                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {rankedVolunteers.map((v, index) => {
                                const tier = getBadgeTier(v.score);
                                return (
                                    <tr key={v.id} className={cn(
                                        'hover:bg-white/[0.02] transition-colors',
                                        index % 2 === 1 && 'bg-white/[0.01]'
                                    )}>
                                        <td className="px-3 py-2.5 whitespace-nowrap">
                                            <span className={cn(
                                                'font-mono text-xs font-bold tabular-nums',
                                                index === 0 ? 'text-amber-400' :
                                                    index === 1 ? 'text-slate-300' :
                                                        index === 2 ? 'text-orange-400' : 'text-slate-600'
                                            )}>
                                                #{index + 1}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center border border-white/[0.06] flex-shrink-0">
                                                    <span className="text-[10px] font-bold text-slate-400">{v.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-slate-200">{v.name}</p>
                                                    <p className="text-[10px] text-slate-600 font-mono">{v.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5 whitespace-nowrap">
                                            <span className="text-xs text-slate-300 font-mono tabular-nums">{v.responsesHandled}</span>
                                        </td>
                                        <td className="px-3 py-2.5 whitespace-nowrap">
                                            <span className="text-xs text-slate-400 font-mono tabular-nums">{v.avgResponseTime}m</span>
                                        </td>
                                        <td className="px-3 py-2.5 whitespace-nowrap">
                                            <span className="text-xs font-bold text-white tabular-nums">{v.score}</span>
                                        </td>
                                        <td className="px-3 py-2.5 whitespace-nowrap">
                                            <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium', tier.color)}>
                                                <span>{tier.icon}</span>
                                                {tier.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
