import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-slate-700 text-slate-200',
                critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
                high: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
                medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
                low: 'bg-green-500/20 text-green-400 border border-green-500/30',
                success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
                warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
                info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
                unassigned: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
                volunteer_reached: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
                help_dispatched: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
                resolved: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export function Badge({ className, variant, children, ...props }) {
    return (
        <span className={cn(badgeVariants({ variant, className }))} {...props}>
            {children}
        </span>
    );
}
