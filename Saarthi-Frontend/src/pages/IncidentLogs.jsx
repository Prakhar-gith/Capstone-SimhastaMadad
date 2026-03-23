import { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    MapPin,
    Clock,
    Radio,
    User,
    Phone,
    FileText,
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
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-xl font-bold text-white">Incident Logs</h1>
                    <p className="text-sm text-slate-400">All emergency alerts and their status</p>
                </div>
                <div className="text-xs text-slate-500">
                    Showing {filteredAlerts.length} of {alerts.length} alerts
                </div>
            </div>

            {/* Filters */}
            <Card className="overflow-hidden">
                <CardContent className="py-3 px-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400">Filter by:</span>

                        {/* Emergency Type Filter */}
                        <select
                            value={filters.emergencyType}
                            onChange={(e) => setFilter('emergencyType', e.target.value)}
                            className="px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Types</option>
                            {EMERGENCY_TYPES.map(type => (
                                <option key={type.id} value={type.id}>{type.label}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filters.status}
                            onChange={(e) => setFilter('status', e.target.value)}
                            className="px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            {STATUS_OPTIONS.map(status => (
                                <option key={status.id} value={status.id}>{status.label}</option>
                            ))}
                        </select>

                        {/* Priority Filter */}
                        <select
                            value={filters.priority}
                            onChange={(e) => setFilter('priority', e.target.value)}
                            className="px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Priority</option>
                            {PRIORITY_OPTIONS.map(priority => (
                                <option key={priority.id} value={priority.id}>{priority.label}</option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Alerts Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-800/50">
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">Alert ID</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">Type</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">Location</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">Time</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">Hops</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">Priority</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">Status</th>
                                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredAlerts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-sm">
                                        No alerts match the current filters
                                    </td>
                                </tr>
                            ) : (
                                filteredAlerts.map((alert) => {
                                    const emergencyType = EMERGENCY_TYPES.find(t => t.id === alert.emergency_type);
                                    const isExpanded = expandedId === alert.id;

                                    return (
                                        <>
                                            <tr
                                                key={alert.id}
                                                className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                                                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                                            >
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                                        ) : (
                                                            <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                                        )}
                                                        <span className="font-mono text-xs text-slate-300">{alert.alert_id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: emergencyType?.color }}
                                                        />
                                                        <span className="text-xs text-slate-200">{emergencyType?.label || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-xs text-slate-300">
                                                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                                                        <span className="max-w-[140px] truncate">{alert.location_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <span className="text-xs text-slate-300">{formatRelativeTime(alert.timestamp)}</span>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        <Radio className="w-3 h-3 flex-shrink-0" />
                                                        {alert.hop_count}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <Badge variant={alert.priority} className="text-xs">{alert.priority}</Badge>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <Badge variant={alert.status} className="text-xs">{alert.status.replace('_', ' ')}</Badge>
                                                </td>
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-xs px-2"
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
                                                    <td colSpan={8} className="bg-slate-800/50 px-6 py-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                            <div>
                                                                <h4 className="font-semibold text-slate-500 uppercase mb-1">Coordinates</h4>
                                                                <p className="text-slate-300 font-mono">
                                                                    {alert.latitude}, {alert.longitude}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-slate-500 uppercase mb-1">Device ID</h4>
                                                                <p className="text-slate-300 font-mono">
                                                                    {maskDeviceId(alert.sender)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-slate-500 uppercase mb-1">Received At</h4>
                                                                <p className="text-slate-300">
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

            {/* Alert Detail Modal */}
            <Modal
                isOpen={!!selectedAlert}
                onClose={() => setSelectedAlert(null)}
                title={`Alert Details - ${selectedAlert?.alert_id}`}
            >
                {selectedAlert && (
                    <div className="space-y-4">
                        {/* Alert Summary */}
                        <div className="flex items-start gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${EMERGENCY_TYPES.find(t => t.id === selectedAlert.emergency_type)?.color}20` }}
                            >
                                <AlertTriangle
                                    className="w-5 h-5"
                                    style={{ color: EMERGENCY_TYPES.find(t => t.id === selectedAlert.emergency_type)?.color }}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-semibold text-white truncate">
                                    {EMERGENCY_TYPES.find(t => t.id === selectedAlert.emergency_type)?.label}
                                </h3>
                                <p className="text-sm text-slate-400 truncate">{selectedAlert.location_name}</p>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    <Badge variant={selectedAlert.priority} className="text-xs">{selectedAlert.priority}</Badge>
                                    <Badge variant={selectedAlert.status} className="text-xs">{selectedAlert.status.replace('_', ' ')}</Badge>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-slate-700/30 rounded-lg">
                                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="text-xs uppercase">Coordinates</span>
                                </div>
                                <p className="font-mono text-xs text-slate-200">
                                    {selectedAlert.latitude}, {selectedAlert.longitude}
                                </p>
                            </div>
                            <div className="p-3 bg-slate-700/30 rounded-lg">
                                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span className="text-xs uppercase">Timestamp</span>
                                </div>
                                <p className="text-xs text-slate-200">{formatDateTime(selectedAlert.timestamp)}</p>
                            </div>
                            <div className="p-3 bg-slate-700/30 rounded-lg">
                                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                    <Radio className="w-3.5 h-3.5" />
                                    <span className="text-xs uppercase">Hop Count</span>
                                </div>
                                <p className="text-xs text-slate-200">{selectedAlert.hop_count} devices</p>
                            </div>
                            <div className="p-3 bg-slate-700/30 rounded-lg">
                                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span className="text-xs uppercase">Device ID</span>
                                </div>
                                <p className="font-mono text-xs text-slate-200">{maskDeviceId(selectedAlert.sender)}</p>
                            </div>
                        </div>

                        {/* User Info */}
                        {selectedAlert.user_info && (
                            <div className="p-3 bg-slate-700/30 rounded-lg">
                                <h4 className="flex items-center gap-1.5 text-slate-400 mb-2">
                                    <User className="w-3.5 h-3.5" />
                                    <span className="text-xs uppercase">Person Details</span>
                                </h4>
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                    <div>
                                        <span className="text-slate-500">Name</span>
                                        <p className="text-slate-200">{selectedAlert.user_info.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Age</span>
                                        <p className="text-slate-200">{selectedAlert.user_info.age}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Medical History</span>
                                        <p className="text-slate-200">{selectedAlert.user_info.medical_history}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-700">
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
