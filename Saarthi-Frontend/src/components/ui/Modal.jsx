import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, className }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
                style={{ animation: 'fadeIn 0.2s ease-out' }}
            />

            <div
                className={cn(
                    'relative bg-[hsl(225,20%,10%)] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-scaleIn',
                    className
                )}
            >
                <div className="h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <h2 className="text-base font-semibold text-slate-100 tracking-wide">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                    {children}
                </div>
            </div>
        </div>
    );
}
