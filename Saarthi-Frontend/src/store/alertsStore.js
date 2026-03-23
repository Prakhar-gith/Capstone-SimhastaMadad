import { create } from 'zustand';
import { generateInitialAlerts, generateMockAlert, generateMockVolunteers } from '../lib/mockData';

export const useAlertsStore = create((set, get) => ({
  alerts: generateInitialAlerts(5),
  volunteers: generateMockVolunteers(15),
  filters: {
    emergencyType: 'all',
    status: 'all',
    priority: 'all',
  },
  isSimulating: true,
  lastSync: new Date(),
  networkStatus: 'online',
  meshHealth: 98,
  
  // Add a new alert
  addAlert: (alert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 12), // Keep max 12 alerts
      lastSync: new Date(),
    }));
  },
  
  // Update alert status
  updateAlertStatus: (alertId, status) => {
    set((state) => ({
      alerts: state.alerts.map(a => 
        a.id === alertId ? { ...a, status } : a
      ),
    }));
  },
  
  // Set filters
  setFilter: (filterName, value) => {
    set((state) => ({
      filters: { ...state.filters, [filterName]: value },
    }));
  },
  
  // Get filtered alerts
  getFilteredAlerts: () => {
    const { alerts, filters } = get();
    return alerts.filter(alert => {
      if (filters.emergencyType !== 'all' && alert.emergency_type !== filters.emergencyType) return false;
      if (filters.status !== 'all' && alert.status !== filters.status) return false;
      if (filters.priority !== 'all' && alert.priority !== filters.priority) return false;
      return true;
    });
  },
  
  // Start simulation
  startSimulation: () => {
    set({ isSimulating: true });
  },
  
  // Stop simulation
  stopSimulation: () => {
    set({ isSimulating: false });
  },
  
  // Simulate a new incoming alert
  simulateNewAlert: () => {
    const { alerts, isSimulating } = get();
    if (!isSimulating || alerts.length >= 12) return;
    
    const newAlert = generateMockAlert(Date.now());
    set((state) => ({
      alerts: [newAlert, ...state.alerts].slice(0, 12),
      lastSync: new Date(),
    }));
    return newAlert;
  },
  
  // Force refresh
  forceRefresh: () => {
    set({
      lastSync: new Date(),
      networkStatus: 'online',
      meshHealth: Math.floor(Math.random() * 5) + 95,
    });
  },
  
  // Update volunteer status
  updateVolunteerStatus: (volunteerId, status) => {
    set((state) => ({
      volunteers: state.volunteers.map(v => 
        v.id === volunteerId ? { ...v, status } : v
      ),
    }));
  },
}));
