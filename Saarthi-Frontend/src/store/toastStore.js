import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Date.now();
    const newToast = { id, ...toast };
    set((state) => ({
      toasts: [...state.toasts, newToast].slice(-5), // Keep max 5 toasts
    }));
    
    // Auto-remove after duration
    setTimeout(() => {
      get().removeToast(id);
    }, toast.duration || 5000);
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },
  
  clearAll: () => {
    set({ toasts: [] });
  },
}));
