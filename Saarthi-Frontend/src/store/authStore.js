import { create } from 'zustand';
import { MOCK_USERS } from '../lib/mockData';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: (username, password) => {
    const user = MOCK_USERS.find(
      u => (u.id === username || u.name.toLowerCase() === username.toLowerCase()) && u.password === password
    );
    
    if (user) {
      set({ user: { id: user.id, name: user.name, role: user.role }, isAuthenticated: true });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
