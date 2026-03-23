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
    success: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100',
    error: 'bg-red-900/90 border-red-500/50 text-red-100',
    warning: 'bg-amber-900/90 border-amber-500/50 text-amber-100',
    info: 'bg-blue-900/90 border-blue-500/50 text-blue-100',
};

export function Toast({ toast }) {
    const { removeToast } = useToastStore();
    const Icon = toastIcons[toast.type] || Info;

    return (
        <div
            className={cn(
                'flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-xl animate-slide-in',
                toastStyles[toast.type] || toastStyles.info
            )}
            style={{
                animation: 'slideIn 0.3s ease-out',
            }}
        >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
                <p className="text-sm opacity-90">{toast.message}</p>
            </div>
            <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
            >
                <X className="w-4 h-4" />
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
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}
