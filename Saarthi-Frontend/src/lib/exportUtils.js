import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EMERGENCY_TYPES, PRIORITY_OPTIONS, STATUS_OPTIONS } from './mockData';

export function exportToCSV(data, filename, columns) {
    const header = columns.map(c => c.label).join(',');
    const rows = data.map(row =>
        columns.map(c => {
            let val = typeof c.accessor === 'function' ? c.accessor(row) : row[c.accessor];
            if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
                val = `"${val.replace(/"/g, '""')}"`;
            }
            return val ?? '';
        }).join(',')
    );

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
}

export function exportAlertsToPDF(alerts, title = 'Incident Report') {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.setTextColor(20, 30, 60);
    doc.text(title, 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 120);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 27);
    doc.text(`Total Alerts: ${alerts.length}`, 14, 32);

    const tableData = alerts.map(a => {
        const type = EMERGENCY_TYPES.find(t => t.id === a.emergency_type);
        return [
            a.alert_id,
            type?.label || a.emergency_type,
            a.location_name,
            a.priority,
            a.status.replace('_', ' '),
            `${a.hop_count}`,
            new Date(a.timestamp).toLocaleString('en-IN'),
            a.user_info?.name || 'N/A',
        ];
    });

    autoTable(doc, {
        startY: 38,
        head: [['Alert ID', 'Type', 'Location', 'Priority', 'Status', 'Hops', 'Timestamp', 'Person']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [20, 30, 60],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold',
        },
        bodyStyles: {
            fontSize: 7,
            textColor: [40, 40, 50],
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
        styles: {
            cellPadding: 2,
            lineColor: [220, 225, 235],
            lineWidth: 0.3,
        },
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`);
}

export function exportAnalyticsToPDF(analyticsData, stats) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(20, 30, 60);
    doc.text('Analytics Report — Saarthi Command Center', 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 120);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 14, 27);

    doc.setFontSize(12);
    doc.setTextColor(20, 30, 60);
    doc.text('Summary', 14, 40);

    autoTable(doc, {
        startY: 45,
        head: [['Metric', 'Value']],
        body: stats.map(s => [s.title, String(s.value)]),
        theme: 'grid',
        headStyles: { fillColor: [20, 30, 60], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        styles: { cellPadding: 3 },
    });

    const alertsByTypeY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.text('Alerts by Type', 14, alertsByTypeY);

    autoTable(doc, {
        startY: alertsByTypeY + 5,
        head: [['Type', 'Count']],
        body: analyticsData.alertsByType.map(t => [t.name, String(t.value)]),
        theme: 'grid',
        headStyles: { fillColor: [20, 30, 60], fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        styles: { cellPadding: 3 },
    });

    doc.save(`analytics_report_${Date.now()}.pdf`);
}

export const ALERT_CSV_COLUMNS = [
    { label: 'Alert ID', accessor: 'alert_id' },
    { label: 'Type', accessor: (a) => EMERGENCY_TYPES.find(t => t.id === a.emergency_type)?.label || a.emergency_type },
    { label: 'Location', accessor: 'location_name' },
    { label: 'Priority', accessor: 'priority' },
    { label: 'Status', accessor: (a) => a.status.replace('_', ' ') },
    { label: 'Hops', accessor: 'hop_count' },
    { label: 'Timestamp', accessor: (a) => new Date(a.timestamp).toLocaleString('en-IN') },
    { label: 'Person', accessor: (a) => a.user_info?.name || 'N/A' },
    { label: 'Latitude', accessor: 'latitude' },
    { label: 'Longitude', accessor: 'longitude' },
];

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
