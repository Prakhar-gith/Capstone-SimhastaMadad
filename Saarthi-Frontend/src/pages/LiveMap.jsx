import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { Filter, Layers, ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import { useAlertsStore } from '../store/alertsStore';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatRelativeTime } from '../lib/utils';
import { UJJAIN_CENTER, EMERGENCY_TYPES, CROWD_DENSITY_ZONES } from '../lib/mockData';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pulsing marker for alerts
function createPulsingIcon(color) {
    return divIcon({
        className: 'custom-marker',
        html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute;
          width: 24px;
          height: 24px;
          background: ${color};
          border-radius: 50%;
          opacity: 0.4;
          animation: pulse 2s ease-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 6px;
          left: 6px;
          width: 12px;
          height: 12px;
          background: ${color};
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
}

// Volunteer marker
function createVolunteerIcon() {
    return divIcon({
        className: 'volunteer-marker',
        html: `
      <div style="
        width: 12px;
        height: 12px;
        background: #3b82f6;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
}

// Map controls component
function MapControls() {
    const map = useMap();

    return (
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <Button
                variant="outline"
                size="icon"
                className="bg-slate-800/90 border-slate-600"
                onClick={() => map.zoomIn()}
            >
                <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="bg-slate-800/90 border-slate-600"
                onClick={() => map.zoomOut()}
            >
                <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="bg-slate-800/90 border-slate-600"
                onClick={() => map.setView([UJJAIN_CENTER.lat, UJJAIN_CENTER.lng], 14)}
            >
                <Crosshair className="w-4 h-4" />
            </Button>
        </div>
    );
}

export function LiveMap() {
    const { alerts, volunteers } = useAlertsStore();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        showAlerts: true,
        showVolunteers: true,
        showHeatmap: true,
        alertTypes: 'all',
    });

    const activeAlerts = alerts.filter(a => a.status !== 'resolved');
    const onlineVolunteers = volunteers.filter(v => v.status !== 'offline');

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Live Map</h1>
                    <p className="text-slate-400 mt-1">Real-time view of Simhastha grounds</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant={showFilters ? 'default' : 'outline'}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                    <Button variant="outline">
                        <Layers className="w-4 h-4" />
                        Layers
                    </Button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <Card>
                    <CardContent className="py-4">
                        <div className="flex flex-wrap items-center gap-6">
                            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.showAlerts}
                                    onChange={(e) => setFilters({ ...filters, showAlerts: e.target.checked })}
                                    className="rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                                    Alerts ({activeAlerts.length})
                                </span>
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.showVolunteers}
                                    onChange={(e) => setFilters({ ...filters, showVolunteers: e.target.checked })}
                                    className="rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                    Volunteers ({onlineVolunteers.length})
                                </span>
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.showHeatmap}
                                    onChange={(e) => setFilters({ ...filters, showHeatmap: e.target.checked })}
                                    className="rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-blue-500"
                                />
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                                    Crowd Density
                                </span>
                            </label>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Map Container */}
            <div className="relative h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-700">
                <MapContainer
                    center={[UJJAIN_CENTER.lat, UJJAIN_CENTER.lng]}
                    zoom={14}
                    className="h-full w-full"
                    style={{ background: '#1e293b' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />

                    <MapControls />

                    {/* Crowd Density Heatmap Circles */}
                    {filters.showHeatmap && CROWD_DENSITY_ZONES.map((zone) => (
                        <Circle
                            key={zone.id}
                            center={[zone.lat, zone.lng]}
                            radius={zone.density * 3}
                            pathOptions={{
                                color: zone.risk === 'critical' ? '#ef4444' :
                                    zone.risk === 'high' ? '#f97316' :
                                        zone.risk === 'medium' ? '#eab308' : '#22c55e',
                                fillColor: zone.risk === 'critical' ? '#ef4444' :
                                    zone.risk === 'high' ? '#f97316' :
                                        zone.risk === 'medium' ? '#eab308' : '#22c55e',
                                fillOpacity: 0.2,
                                weight: 1,
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="text-slate-800 p-1">
                                    <p className="font-semibold">{zone.name}</p>
                                    <p className="text-sm">Density: {zone.density}%</p>
                                    <p className="text-sm capitalize">Risk: {zone.risk}</p>
                                </div>
                            </Popup>
                        </Circle>
                    ))}

                    {/* Alert Markers */}
                    {filters.showAlerts && activeAlerts.map((alert) => {
                        const emergencyType = EMERGENCY_TYPES.find(t => t.id === alert.emergency_type);
                        return (
                            <Marker
                                key={alert.id}
                                position={[parseFloat(alert.latitude), parseFloat(alert.longitude)]}
                                icon={createPulsingIcon(emergencyType?.color || '#ef4444')}
                            >
                                <Popup className="custom-popup">
                                    <div className="text-slate-800 min-w-[200px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: emergencyType?.color }}
                                            />
                                            <span className="font-semibold">{emergencyType?.label}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{alert.location_name}</p>
                                        <div className="flex gap-2 mb-2">
                                            <Badge variant={alert.priority}>{alert.priority}</Badge>
                                            <Badge variant={alert.status}>{alert.status.replace('_', ' ')}</Badge>
                                        </div>
                                        <p className="text-xs text-slate-500">{formatRelativeTime(alert.timestamp)}</p>
                                        <button className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            Dispatch Team
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Volunteer Markers */}
                    {filters.showVolunteers && onlineVolunteers.map((volunteer) => (
                        <Marker
                            key={volunteer.id}
                            position={[volunteer.lat, volunteer.lng]}
                            icon={createVolunteerIcon()}
                        >
                            <Popup className="custom-popup">
                                <div className="text-slate-800">
                                    <p className="font-semibold">{volunteer.name}</p>
                                    <p className="text-sm text-slate-600">{volunteer.location}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Status: <span className="capitalize">{volunteer.status}</span>
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 z-[1000] p-3 bg-slate-800/90 border border-slate-700 rounded-lg">
                    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Legend</p>
                    <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-slate-300">Active Alert</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span className="text-slate-300">Volunteer</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-yellow-500/50 rounded-full" />
                            <span className="text-slate-300">Crowd Zone</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
