import { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    MapPin,
    Clock,
    Radio,
    User,
    Phone,
    CheckCircle,
    AlertTriangle,
    Send
} from 'lucide-react';
import { useAlertsStore } from '../store/alertsStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { formatRelativeTime, formatDateTime, maskDeviceId } from '../lib/utils';
import { EMERGENCY_TYPES, PRIORITY_OPTIONS, STATUS_OPTIONS } from '../lib/mockData';

export function IncidentLogs() {
    const { alerts, filters, setFilter, getFilteredAlerts, updateAlertStatus } = useAlertsStore();
    const [expandedId, setExpandedId] = useState(null);
    const [selectedAlert, setSelectedAlert] = useState(null);

    const filteredAlerts = getFilteredAlerts();

    const handleStatusChange = (alertId, newStatus) => {
        updateAlertStatus(alertId, newStatus);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Incident Logs</h1>
                    <p className="text-xs text-slate-500 mt-0.5">All emergency alerts and their status</p>
                </div>
                <div className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
                    {filteredAlerts.length} of {alerts.length} alerts
                </div>
            </div>

            <Card className="overflow-hidden">
                <CardContent className="py-3 px-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Filters</span>

                        {[
                            { value: filters.emergencyType, onChange: (v) => setFilter('emergencyType', v), options: [{ value: 'all', label: 'All Types' }, ...EMERGENCY_TYPES.map(t => ({ value: t.id, label: t.label }))] },
                            { value: filters.status, onChange: (v) => setFilter('status', v), options: [{ value: 'all', label: 'All Status' }, ...STATUS_OPTIONS.map(s => ({ value: s.id, label: s.label }))] },
                            { value: filters.priority, onChange: (v) => setFilter('priority', v), options: [{ value: 'all', label: 'All Priority' }, ...PRIORITY_OPTIONS.map(p => ({ value: p.id, label: p.label }))] },
                        ].map((filter, i) => (
                            <select
                                key={i}
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                className="px-2.5 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[11px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 cursor-pointer"
                            >
                                {filter.options.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-[hsl(225,20%,12%)]">{opt.label}</option>
                                ))}
                            </select>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                {['Alert ID', 'Type', 'Location', 'Time', 'Hops', 'Priority', 'Status', 'Actions'].map(header => (
                                    <th key={header} className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredAlerts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-slate-600 text-sm">
                                        No alerts match the current filters
                                    </td>
                                </tr>
                            ) : (
                                filteredAlerts.map((alert, index) => {
                                    const emergencyType = EMERGENCY_TYPES.find(t => t.id === alert.emergency_type);
                                    const isExpanded = expandedId === alert.id;

                                    return (
                                        <>
                                            <tr
                                                key={alert.id}
                                                className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${index % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                                                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                                            >
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-3 h-3 text-slate-600 flex-shrink-0" />
                                                        ) : (
                                                            <ChevronDown className="w-3 h-3 text-slate-600 flex-shrink-0" />
                                                        )}
                                                        <span className="font-mono text-[11px] text-slate-400">{alert.alert_id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: emergencyType?.color }}
                                                        />
                                                        <span className="text-[11px] text-slate-300">{emergencyType?.label || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                                        <MapPin className="w-3 h-3 text-slate-600 flex-shrink-0" />
                                                        <span className="max-w-[140px] truncate">{alert.location_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <span className="text-[11px] text-slate-400 font-mono">{formatRelativeTime(alert.timestamp)}</span>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                                        <Radio className="w-3 h-3 flex-shrink-0" />
                                                        <span className="font-mono">{alert.hop_count}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <Badge variant={alert.priority}>{alert.priority}</Badge>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <Badge variant={alert.status}>{alert.status.replace('_', ' ')}</Badge>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-[10px] px-2 text-slate-500 hover:text-blue-400"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedAlert(alert);
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr key={`${alert.id}-expanded`}>
                                                    <td colSpan={8} className="bg-white/[0.02] px-6 py-3 border-l-2 border-blue-500/30">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
                                                            <div>
                                                                <h4 className="font-medium text-slate-600 uppercase tracking-wider text-[10px] mb-1">Coordinates</h4>
                                                                <p className="text-slate-300 font-mono">
                                                                    {alert.latitude}, {alert.longitude}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-slate-600 uppercase tracking-wider text-[10px] mb-1">Device ID</h4>
                                                                <p className="text-slate-300 font-mono">
                                                                    {maskDeviceId(alert.sender)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-slate-600 uppercase tracking-wider text-[10px] mb-1">Received At</h4>
                                                                <p className="text-slate-300 font-mono">
                                                                    {formatDateTime(alert.received_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={!!selectedAlert}
                onClose={() => setSelectedAlert(null)}
                title={`Alert Details — ${selectedAlert?.alert_id}`}
            >
                {selectedAlert && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${EMERGENCY_TYPES.find(t => t.id === selectedAlert.emergency_type)?.color}15` }}
                            >
                                <AlertTriangle
                                    className="w-5 h-5"
                                    style={{ color: EMERGENCY_TYPES.find(t => t.id === selectedAlert.emergency_type)?.color }}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-white">
                                    {EMERGENCY_TYPES.find(t => t.id === selectedAlert.emergency_type)?.label}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">{selectedAlert.location_name}</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <Badge variant={selectedAlert.priority}>{selectedAlert.priority}</Badge>
                                    <Badge variant={selectedAlert.status}>{selectedAlert.status.replace('_', ' ')}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { icon: MapPin, label: 'Coordinates', value: `${selectedAlert.latitude}, ${selectedAlert.longitude}`, mono: true },
                                { icon: Clock, label: 'Timestamp', value: formatDateTime(selectedAlert.timestamp) },
                                { icon: Radio, label: 'Hop Count', value: `${selectedAlert.hop_count} devices`, mono: true },
                                { icon: Phone, label: 'Device ID', value: maskDeviceId(selectedAlert.sender), mono: true },
                            ].map((item, i) => (
                                <div key={i} className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.04]">
                                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                                        <item.icon className="w-3 h-3" />
                                        <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    <p className={`text-xs text-slate-200 ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {selectedAlert.user_info && (
                            <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.04]">
                                <h4 className="flex items-center gap-1.5 text-slate-500 mb-2.5">
                                    <User className="w-3 h-3" />
                                    <span className="text-[10px] uppercase tracking-wider">Person Details</span>
                                </h4>
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                    {[
                                        { label: 'Name', value: selectedAlert.user_info.name },
                                        { label: 'Age', value: selectedAlert.user_info.age },
                                        { label: 'Medical', value: selectedAlert.user_info.medical_history },
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <span className="text-[10px] text-slate-600 uppercase tracking-wider">{field.label}</span>
                                            <p className="text-slate-200 mt-0.5">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleStatusChange(selectedAlert.id, 'volunteer_reached')}
                                disabled={selectedAlert.status !== 'unassigned'}
                            >
                                <Send className="w-3.5 h-3.5" />
                                Assign Responder
                            </Button>
                            <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleStatusChange(selectedAlert.id, 'help_dispatched')}
                                disabled={selectedAlert.status === 'resolved'}
                            >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Escalate
                            </Button>
                            <Button
                                variant="success"
                                size="sm"
                                onClick={() => {
                                    handleStatusChange(selectedAlert.id, 'resolved');
                                    setSelectedAlert(null);
                                }}
                            >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Mark Resolved
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
