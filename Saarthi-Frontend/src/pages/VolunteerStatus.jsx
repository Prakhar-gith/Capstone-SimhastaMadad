import { Radio, MapPin, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { useAlertsStore } from '../store/alertsStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

export function VolunteerStatus() {
    const { volunteers, updateVolunteerStatus } = useAlertsStore();

    const onlineCount = volunteers.filter(v => v.status === 'online').length;
    const respondingCount = volunteers.filter(v => v.status === 'responding').length;
    const offlineCount = volunteers.filter(v => v.status === 'offline').length;

    const statusColors = {
        online: 'bg-emerald-500',
        responding: 'bg-amber-500',
        offline: 'bg-slate-600',
    };

    const statusBadges = {
        online: 'success',
        responding: 'warning',
        offline: 'default',
    };

    const summaryCards = [
        { label: 'Online', count: onlineCount, icon: CheckCircle, color: 'emerald', gradient: 'from-emerald-500/10 to-emerald-600/5', ring: 'ring-emerald-500/15' },
        { label: 'Responding', count: respondingCount, icon: Radio, color: 'amber', gradient: 'from-amber-500/10 to-amber-600/5', ring: 'ring-amber-500/15' },
        { label: 'Offline', count: offlineCount, icon: AlertCircle, color: 'slate', gradient: 'from-slate-500/10 to-slate-600/5', ring: 'ring-slate-500/15' },
    ];

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Volunteer Status</h1>
                <p className="text-xs text-slate-500 mt-0.5">Monitor volunteer locations and availability</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {summaryCards.map((card, index) => (
                    <div key={card.label} className={`rounded-xl bg-gradient-to-br ${card.gradient} ring-1 ${card.ring} p-3 animate-fadeIn stagger-${index + 1}`}>
                        <div className="flex items-center gap-2.5">
                            <div className={`p-2 bg-${card.color}-500/15 rounded-lg flex-shrink-0`}>
                                <card.icon className={`w-4 h-4 text-${card.color}-400`} />
                            </div>
                            <div className="min-w-0">
                                <p className={`text-xl font-bold text-${card.color}-400 tabular-nums`}>{card.count}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{card.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader className="py-3 px-4">
                    <CardTitle>All Volunteers ({volunteers.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 divide-white/[0.04]">
                        {volunteers.map((volunteer) => (
                            <div
                                key={volunteer.id}
                                className={cn(
                                    'p-3.5 border-b md:border-b-0 md:border-r border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors',
                                    volunteer.status === 'offline' && 'opacity-50'
                                )}
                            >
                                <div className="flex items-start justify-between gap-2 mb-2.5">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
                                                <User className="w-3.5 h-3.5 text-slate-500" />
                                            </div>
                                            <span
                                                className={cn(
                                                    'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[hsl(225,20%,10%)]',
                                                    statusColors[volunteer.status]
                                                )}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-slate-200 truncate">{volunteer.name}</p>
                                            <p className="text-[10px] text-slate-600 font-mono">{volunteer.id}</p>
                                        </div>
                                    </div>
                                    <Badge variant={statusBadges[volunteer.status]} className="flex-shrink-0">
                                        {volunteer.status}
                                    </Badge>
                                </div>

                                <div className="space-y-1 text-[11px] mb-2.5">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <MapPin className="w-3 h-3 flex-shrink-0 text-slate-600" />
                                        <span className="truncate">{volunteer.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                        <Clock className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{volunteer.lastActive}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.04]">
                                    <span className="text-[10px] text-slate-600 font-mono">
                                        {volunteer.responsesHandled} responses
                                    </span>
                                    {volunteer.status !== 'offline' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-[10px] px-2 text-slate-500 hover:text-blue-400"
                                            onClick={() => updateVolunteerStatus(volunteer.id, volunteer.status === 'responding' ? 'online' : 'responding')}
                                        >
                                            {volunteer.status === 'responding' ? 'Available' : 'Assign'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
