import { useState } from 'react';
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

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
          opacity: 0.3;
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
          border: 2px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 12px ${color}40;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
}

function createVolunteerIcon() {
    return divIcon({
        className: 'volunteer-marker',
        html: `
      <div style="
        width: 10px;
        height: 10px;
        background: #3b82f6;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.9);
        box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 8px rgba(59,130,246,0.3);
      "></div>
    `,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    });
}

function MapControls() {
    const map = useMap();

    return (
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5">
            {[
                { icon: ZoomIn, action: () => map.zoomIn(), title: 'Zoom in' },
                { icon: ZoomOut, action: () => map.zoomOut(), title: 'Zoom out' },
                { icon: Crosshair, action: () => map.setView([UJJAIN_CENTER.lat, UJJAIN_CENTER.lng], 14), title: 'Re-center' },
            ].map((ctrl, i) => (
                <button
                    key={i}
                    onClick={ctrl.action}
                    title={ctrl.title}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-[hsl(225,20%,10%)]/90 border border-white/[0.08] text-slate-400 hover:text-white hover:bg-[hsl(225,20%,14%)]/90 transition-all backdrop-blur-sm shadow-lg"
                >
                    <ctrl.icon className="w-4 h-4" />
                </button>
            ))}
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
        <div className="space-y-4 h-[calc(100vh-8rem)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Live Map</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time view of Simhastha grounds</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={showFilters ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="w-3.5 h-3.5" />
                        Filters
                    </Button>
                    <Button variant="outline" size="sm">
                        <Layers className="w-3.5 h-3.5" />
                        Layers
                    </Button>
                </div>
            </div>

            {showFilters && (
                <Card className="animate-fadeIn">
                    <CardContent className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-5">
                            {[
                                { label: 'Alerts', count: activeAlerts.length, color: 'bg-red-500', key: 'showAlerts' },
                                { label: 'Volunteers', count: onlineVolunteers.length, color: 'bg-blue-500', key: 'showVolunteers' },
                                { label: 'Crowd Density', color: 'bg-yellow-500', key: 'showHeatmap' },
                            ].map((f) => (
                                <label key={f.key} className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={filters[f.key]}
                                        onChange={(e) => setFilters({ ...filters, [f.key]: e.target.checked })}
                                        className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500/40 focus:ring-offset-0 w-3.5 h-3.5"
                                    />
                                    <span className="flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 ${f.color} rounded-full`} />
                                        {f.label}{f.count !== undefined ? ` (${f.count})` : ''}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="relative h-full min-h-[500px] rounded-xl overflow-hidden border border-white/[0.06] shadow-xl">
                <MapContainer
                    center={[UJJAIN_CENTER.lat, UJJAIN_CENTER.lng]}
                    zoom={14}
                    className="h-full w-full"
                    style={{ background: '#0a0e1a' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    <MapControls />

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
                                fillOpacity: 0.15,
                                weight: 1,
                                opacity: 0.4,
                            }}
                        >
                            <Popup>
                                <div className="text-slate-200 p-1">
                                    <p className="font-semibold text-sm">{zone.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">Density: <span className="font-mono">{zone.density}%</span></p>
                                    <p className="text-xs text-slate-400 capitalize">Risk: {zone.risk}</p>
                                </div>
                            </Popup>
                        </Circle>
                    ))}

                    {filters.showAlerts && activeAlerts.map((alert) => {
                        const emergencyType = EMERGENCY_TYPES.find(t => t.id === alert.emergency_type);
                        return (
                            <Marker
                                key={alert.id}
                                position={[parseFloat(alert.latitude), parseFloat(alert.longitude)]}
                                icon={createPulsingIcon(emergencyType?.color || '#ef4444')}
                            >
                                <Popup>
                                    <div className="text-slate-200 min-w-[200px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: emergencyType?.color }}
                                            />
                                            <span className="font-semibold text-sm">{emergencyType?.label}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-2">{alert.location_name}</p>
                                        <div className="flex gap-2 mb-2">
                                            <Badge variant={alert.priority}>{alert.priority}</Badge>
                                            <Badge variant={alert.status}>{alert.status.replace('_', ' ')}</Badge>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-mono">{formatRelativeTime(alert.timestamp)}</p>
                                        <button className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-500 transition-colors">
                                            Dispatch Team
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {filters.showVolunteers && onlineVolunteers.map((volunteer) => (
                        <Marker
                            key={volunteer.id}
                            position={[volunteer.lat, volunteer.lng]}
                            icon={createVolunteerIcon()}
                        >
                            <Popup>
                                <div className="text-slate-200">
                                    <p className="font-semibold text-sm">{volunteer.name}</p>
                                    <p className="text-xs text-slate-400">{volunteer.location}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 capitalize">
                                        Status: {volunteer.status}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                <div className="absolute bottom-4 left-4 z-[1000] p-3 bg-[hsl(225,20%,10%)]/90 backdrop-blur-sm border border-white/[0.08] rounded-xl shadow-xl">
                    <p className="text-[9px] font-semibold text-slate-600 mb-2.5 uppercase tracking-[0.15em]">Legend</p>
                    <div className="space-y-2 text-[11px]">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                            <span className="text-slate-400">Active Alert</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                            <span className="text-slate-400">Volunteer</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-yellow-500/50 rounded-full" />
                            <span className="text-slate-400">Crowd Zone</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
