import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
                destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
                outline: 'border border-slate-600 text-slate-200 hover:bg-slate-700 focus:ring-slate-500',
                ghost: 'text-slate-300 hover:bg-slate-700 hover:text-slate-100 focus:ring-slate-500',
                success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
                warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500',
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
