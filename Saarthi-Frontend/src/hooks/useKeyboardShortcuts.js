import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const routes = [
    '/',
    '/map',
    '/incidents',
    '/volunteers',
    '/analytics',
    '/leaderboard',
];

export function useKeyboardShortcuts({ onSearchOpen }) {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) return;

        function handleKeyDown(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                onSearchOpen?.();
                return;
            }

            const num = parseInt(e.key);
            if (num >= 1 && num <= routes.length && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                navigate(routes[num - 1]);
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAuthenticated, navigate, onSearchOpen]);
}
