import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(230,25%,7%)] disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97]',
    {
        variants: {
            variant: {
                default: 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 focus-visible:ring-blue-500',
                destructive: 'bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 focus-visible:ring-red-500',
                outline: 'border border-slate-600/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500 hover:text-slate-100 focus-visible:ring-slate-500',
                ghost: 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 focus-visible:ring-slate-500',
                success: 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 focus-visible:ring-emerald-500',
                warning: 'bg-amber-600 text-white hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/25 focus-visible:ring-amber-500',
            },
            size: {
                default: 'h-10 px-4 py-2 text-sm',
                sm: 'h-8 px-3 py-1 text-xs',
                lg: 'h-12 px-6 py-3 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export function Button({ className, variant, size, children, ...props }) {
    return (
        <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
            {children}
        </button>
    );
}
