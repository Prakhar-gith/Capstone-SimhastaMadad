import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                'rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-lg',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn('px-5 py-4 border-b border-slate-700/50', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={cn('text-lg font-semibold text-slate-100', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn('p-5', className)} {...props}>
            {children}
        </div>
    );
}
