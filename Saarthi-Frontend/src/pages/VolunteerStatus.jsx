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
        offline: 'bg-slate-500',
    };

    const statusBadges = {
        online: 'success',
        responding: 'warning',
        offline: 'default',
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-white">Volunteer Status</h1>
                <p className="text-sm text-slate-400">Monitor volunteer locations and availability</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/20 rounded-lg flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl font-bold text-emerald-400">{onlineCount}</p>
                                <p className="text-xs text-slate-400 truncate">Online</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0">
                                <Radio className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl font-bold text-amber-400">{respondingCount}</p>
                                <p className="text-xs text-slate-400 truncate">Responding</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-slate-500/10 to-slate-600/5 border-slate-500/20">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-slate-500/20 rounded-lg flex-shrink-0">
                                <AlertCircle className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl font-bold text-slate-400">{offlineCount}</p>
                                <p className="text-xs text-slate-400 truncate">Offline</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Volunteer Grid */}
            <Card>
                <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base">All Volunteers ({volunteers.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-y md:divide-y-0 divide-slate-700/50">
                        {volunteers.map((volunteer) => (
                            <div
                                key={volunteer.id}
                                className={cn(
                                    'p-3 border-b md:border-b-0 md:border-r border-slate-700/50 last:border-b-0 hover:bg-slate-700/30 transition-colors',
                                    volunteer.status === 'offline' && 'opacity-60'
                                )}
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                                <User className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <span
                                                className={cn(
                                                    'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-800',
                                                    statusColors[volunteer.status]
                                                )}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-200 truncate">{volunteer.name}</p>
                                            <p className="text-xs text-slate-500 font-mono">{volunteer.id}</p>
                                        </div>
                                    </div>
                                    <Badge variant={statusBadges[volunteer.status]} className="flex-shrink-0 text-xs">
                                        {volunteer.status}
                                    </Badge>
                                </div>

                                <div className="space-y-1 text-xs mb-2">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{volunteer.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Clock className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{volunteer.lastActive}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                                    <span className="text-xs text-slate-500">
                                        {volunteer.responsesHandled} responses
                                    </span>
                                    {volunteer.status !== 'offline' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-xs px-2"
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
