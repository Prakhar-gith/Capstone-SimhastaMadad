import { cn } from '../../lib/utils';
import { SearchX, AlertCircle, Users, BarChart3, MapPin } from 'lucide-react';
import { Button } from './Button';

const defaultIcons = {
    alerts: AlertCircle,
    volunteers: Users,
    analytics: BarChart3,
    map: MapPin,
    search: SearchX,
};

export function EmptyState({
    icon: IconProp,
    iconType = 'alerts',
    title = 'No data found',
    description = 'There is nothing to display right now.',
    actionLabel,
    onAction,
    className,
}) {
    const Icon = IconProp || defaultIcons[iconType] || AlertCircle;

    return (
        <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
            <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-slate-600" />
                </div>
                <div className="absolute -inset-3 rounded-3xl bg-slate-500/5 -z-10" />
            </div>
            <h3 className="text-sm font-semibold text-slate-400 mb-1">{title}</h3>
            <p className="text-xs text-slate-600 text-center max-w-xs">{description}</p>
            {actionLabel && onAction && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAction}
                    className="mt-4"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
