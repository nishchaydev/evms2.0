'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Paper, Typography, Chip } from '@mui/material';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix Leaflet Default Icon in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom Icons for Priority
const criticalIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const highIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface ReportMapProps {
    reports: {
        id: string;
        location?: string | null;
        priority?: string | null;
        description: string;
        category: string;
        createdAt: string | Date;
    }[];
}

export default function ReportMap({ reports }: ReportMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isMounted) return <Paper sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</Paper>;

    // Filter reports with valid location
    const validReports = reports.filter(r => r.location && r.location.includes(',') && !isNaN(parseFloat(r.location.split(',')[0])));

    // Default center (Khargone approx) or first report
    const center: [number, number] = validReports.length > 0
        ? [parseFloat(validReports[0].location!.split(',')[0]), parseFloat(validReports[0].location!.split(',')[1])]
        : [21.82, 75.61]; // Khargone Coordinates

    return (
        <Paper elevation={0} sx={{ height: 500, borderRadius: 3, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

                {validReports.map((report) => {
                    const [lat, lng] = report.location!.split(',').map((s: string) => parseFloat(s.trim()));
                    let icon = defaultIcon;
                    if (report.priority === 'CRITICAL') icon = criticalIcon;
                    if (report.priority === 'HIGH') icon = highIcon;

                    return (
                        <Marker key={report.id} position={[lat, lng]} icon={icon}>
                            <Popup>
                                <Box sx={{ minWidth: 200 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">Report #{report.id.slice(0, 5)}</Typography>
                                        <Chip
                                            label={report.priority || 'MEDIUM'}
                                            size="small"
                                            color={report.priority === 'CRITICAL' ? 'error' : report.priority === 'HIGH' ? 'warning' : 'default'}
                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                        />
                                    </Box>
                                    <Typography variant="body2" sx={{ mb: 1 }}>{report.description.slice(0, 50)}...</Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Category: {report.category}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Reported: {new Date(report.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </Paper>
    );
}
