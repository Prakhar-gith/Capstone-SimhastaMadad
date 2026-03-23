// Ujjain landmarks and locations
export const UJJAIN_CENTER = { lat: 23.1793, lng: 75.7849 };

export const UJJAIN_LOCATIONS = [
  { name: 'Mahakaleshwar Temple', lat: 23.1827, lng: 75.7682 },
  { name: 'Ram Ghat', lat: 23.1756, lng: 75.7689 },
  { name: 'Kshipra River Bank', lat: 23.1812, lng: 75.7701 },
  { name: 'Harsiddhi Temple', lat: 23.1822, lng: 75.7698 },
  { name: 'Mangalnath Temple', lat: 23.1893, lng: 75.7512 },
  { name: 'Sandipani Ashram', lat: 23.1956, lng: 75.7823 },
  { name: 'Gopal Mandir', lat: 23.1762, lng: 75.7649 },
  { name: 'Kal Bhairav Temple', lat: 23.1889, lng: 75.7834 },
  { name: 'Triveni Ghat', lat: 23.1743, lng: 75.7712 },
  { name: 'Siddhavat', lat: 23.1798, lng: 75.7756 },
];

export const EMERGENCY_TYPES = [
  { id: 'medical', label: 'Medical Emergency', icon: 'Heart', color: '#ef4444' },
  { id: 'stampede', label: 'Stampede Risk', icon: 'Users', color: '#f97316' },
  { id: 'lost', label: 'Lost Person', icon: 'UserSearch', color: '#eab308' },
  { id: 'fire', label: 'Fire', icon: 'Flame', color: '#dc2626' },
  { id: 'theft', label: 'Theft/Crime', icon: 'ShieldAlert', color: '#8b5cf6' },
  { id: 'other', label: 'Other Emergency', icon: 'AlertTriangle', color: '#6b7280' },
];

export const STATUS_OPTIONS = [
  { id: 'unassigned', label: 'Unassigned', color: '#6b7280' },
  { id: 'volunteer_reached', label: 'Volunteer Reached', color: '#3b82f6' },
  { id: 'help_dispatched', label: 'Help Dispatched', color: '#f59e0b' },
  { id: 'resolved', label: 'Resolved', color: '#10b981' },
];

export const PRIORITY_OPTIONS = [
  { id: 'low', label: 'Low', color: '#22c55e' },
  { id: 'medium', label: 'Medium', color: '#eab308' },
  { id: 'high', label: 'High', color: '#f97316' },
  { id: 'critical', label: 'Critical', color: '#ef4444' },
];

// Mock users for demo
export const MOCK_USERS = [
  { id: 'admin1', name: 'Rajesh Kumar', role: 'Admin Authority', password: 'admin123' },
  { id: 'operator1', name: 'Priya Sharma', role: 'Emergency Operator', password: 'operator123' },
  { id: 'supervisor1', name: 'Amit Patel', role: 'Field Supervisor', password: 'supervisor123' },
];

// Generate random variation for coordinates
function randomOffset(base, range = 0.01) {
  return base + (Math.random() - 0.5) * range * 2;
}

// Generate a mock alert
export function generateMockAlert(id = Date.now()) {
  const location = UJJAIN_LOCATIONS[Math.floor(Math.random() * UJJAIN_LOCATIONS.length)];
  const emergencyType = EMERGENCY_TYPES[Math.floor(Math.random() * EMERGENCY_TYPES.length)];
  const priority = PRIORITY_OPTIONS[Math.floor(Math.random() * PRIORITY_OPTIONS.length)];
  const status = STATUS_OPTIONS[0]; // New alerts are unassigned

  return {
    id,
    alert_id: `SOS-${Date.now().toString(36).toUpperCase()}`,
    sender: `DEV${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    latitude: randomOffset(location.lat, 0.005).toFixed(6),
    longitude: randomOffset(location.lng, 0.005).toFixed(6),
    location_name: location.name,
    emergency_type: emergencyType.id,
    priority: priority.id,
    status: status.id,
    hop_count: Math.floor(Math.random() * 8) + 1,
    user_info: {
      name: ['Ramesh', 'Sunita', 'Vikram', 'Anjali', 'Deepak', 'Meera'][Math.floor(Math.random() * 6)],
      age: Math.floor(Math.random() * 50) + 18,
      medical_history: ['None', 'Diabetes', 'Heart Condition', 'Asthma', 'None'][Math.floor(Math.random() * 5)],
    },
    received_at: new Date().toISOString(),
  };
}

// Generate initial batch of mock alerts
export function generateInitialAlerts(count = 5) {
  const alerts = [];
  for (let i = 0; i < count; i++) {
    const alert = generateMockAlert(i + 1);
    // Vary timestamps to make it look historical
    const pastMinutes = i * 5 + Math.floor(Math.random() * 10);
    alert.timestamp = new Date(Date.now() - pastMinutes * 60000).toISOString();
    alert.received_at = new Date(Date.now() - (pastMinutes - 1) * 60000).toISOString();
    // Some alerts might be resolved
    if (i > 2 && Math.random() > 0.5) {
      alert.status = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)].id;
    }
    alerts.push(alert);
  }
  return alerts.reverse(); // Newest first
}

// Generate mock volunteers
export function generateMockVolunteers(count = 15) {
  const volunteers = [];
  const statuses = ['online', 'responding', 'offline'];
  const names = ['Arjun Singh', 'Kavita Rao', 'Mohit Verma', 'Sneha Joshi', 'Rahul Gupta', 
                 'Divya Nair', 'Sanjay Mishra', 'Pooja Sharma', 'Anil Kumar', 'Ritu Agarwal',
                 'Vivek Saxena', 'Neha Tiwari', 'Manoj Pandey', 'Swati Deshmukh', 'Kiran Reddy'];
  
  for (let i = 0; i < count; i++) {
    const location = UJJAIN_LOCATIONS[Math.floor(Math.random() * UJJAIN_LOCATIONS.length)];
    volunteers.push({
      id: `VOL${(i + 1).toString().padStart(3, '0')}`,
      name: names[i % names.length],
      status: statuses[Math.floor(Math.random() * (i < 10 ? 2 : 3))], // Most are online/responding
      location: location.name,
      lat: randomOffset(location.lat, 0.003),
      lng: randomOffset(location.lng, 0.003),
      lastActive: i < 10 ? 'Active now' : `${Math.floor(Math.random() * 30)}m ago`,
      responsesHandled: Math.floor(Math.random() * 20),
    });
  }
  return volunteers;
}

// Mock crowd density zones
export const CROWD_DENSITY_ZONES = [
  { id: 1, name: 'Mahakaleshwar Area', density: 95, risk: 'critical', lat: 23.1827, lng: 75.7682 },
  { id: 2, name: 'Ram Ghat', density: 82, risk: 'high', lat: 23.1756, lng: 75.7689 },
  { id: 3, name: 'Kshipra Banks', density: 68, risk: 'medium', lat: 23.1812, lng: 75.7701 },
  { id: 4, name: 'Harsiddhi Temple', density: 55, risk: 'medium', lat: 23.1822, lng: 75.7698 },
  { id: 5, name: 'Mangalnath Area', density: 40, risk: 'low', lat: 23.1893, lng: 75.7512 },
];

// Analytics mock data
export const ANALYTICS_DATA = {
  alertsByType: EMERGENCY_TYPES.map(type => ({
    name: type.label.split(' ')[0],
    value: Math.floor(Math.random() * 50) + 10,
    color: type.color,
  })),
  alertsTrend: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    alerts: Math.floor(Math.random() * 15) + (i >= 6 && i <= 18 ? 20 : 5),
  })),
  responseTimesTrend: Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      avgTime: Math.floor(Math.random() * 3) + 1.5,
    };
  }),
};
