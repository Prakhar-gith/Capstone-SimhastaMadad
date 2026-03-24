import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200',
    {
        variants: {
            variant: {
                default: 'bg-slate-700/60 text-slate-300 ring-1 ring-slate-600/50',
                critical: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.15)]',
                high: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
                medium: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
                low: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
                success: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
                warning: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
                info: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
                unassigned: 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30',
                volunteer_reached: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
                help_dispatched: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
                resolved: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const dotColors = {
    critical: 'bg-red-400',
    high: 'bg-orange-400',
    medium: 'bg-yellow-400',
    low: 'bg-emerald-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    info: 'bg-blue-400',
    unassigned: 'bg-slate-400',
    volunteer_reached: 'bg-blue-400',
    help_dispatched: 'bg-amber-400',
    resolved: 'bg-emerald-400',
    default: 'bg-slate-400',
};

export function Badge({ className, variant, children, ...props }) {
    return (
        <span className={cn(badgeVariants({ variant, className }))} {...props}>
            <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant] || dotColors.default)} />
            {children}
        </span>
    );
}
