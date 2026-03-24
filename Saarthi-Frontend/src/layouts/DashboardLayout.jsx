import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { ToastContainer } from '../components/ui/Toast';
import { SearchModal } from '../components/SearchModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAlertsStore } from '../store/alertsStore';

export function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const initialize = useAlertsStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useKeyboardShortcuts({ onSearchOpen: () => setSearchOpen(true) });

    return (
        <div className="h-screen bg-[hsl(230,25%,7%)] flex overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} onSearchClick={() => setSearchOpen(true)} />

                <main className="flex-1 p-4 lg:p-6 overflow-x-hidden overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            <ToastContainer />
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
    );
}
