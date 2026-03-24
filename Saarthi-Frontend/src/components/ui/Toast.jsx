import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { cn } from '../../lib/utils';

const toastIcons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const toastStyles = {
    success: 'border-l-emerald-500 bg-emerald-950/80',
    error: 'border-l-red-500 bg-red-950/80',
    warning: 'border-l-amber-500 bg-amber-950/80',
    info: 'border-l-blue-500 bg-blue-950/80',
};

const toastIconColors = {
    success: 'text-emerald-400',
    error: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-blue-400',
};

export function Toast({ toast }) {
    const { removeToast } = useToastStore();
    const Icon = toastIcons[toast.type] || Info;

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border border-white/[0.06] border-l-[3px] backdrop-blur-xl shadow-2xl shadow-black/40 animate-slideInRight',
                toastStyles[toast.type] || toastStyles.info
            )}
        >
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', toastIconColors[toast.type] || toastIconColors.info)} />
            <div className="flex-1 min-w-0">
                {toast.title && <p className="font-semibold text-sm text-slate-100">{toast.title}</p>}
                <p className="text-sm text-slate-300">{toast.message}</p>
            </div>
            <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-slate-200"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

export function ToastContainer() {
    const { toasts } = useToastStore();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>
    );
}
