'use client';

import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface ReceiptProps {
    reportId: string;
    category: string;
    location: string;
    date: Date;
}

export default function DownloadReceipt({ reportId, category, location, date }: ReceiptProps) {

    const handleDownload = async () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 140] // Receipt size
        });

        // 1. Header (Logo Placeholders)
        doc.setFillColor(248, 250, 252); // Light Gray Background
        doc.rect(0, 0, 80, 140, 'F');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('City Municipal Corp.', 40, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text('Official Report Receipt', 40, 20, { align: 'center' });

        // 2. Report ID
        doc.setLineWidth(0.5);
        doc.line(10, 25, 70, 25); // Divider

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`#${reportId.slice(0, 8).toUpperCase()}`, 40, 35, { align: 'center' });

        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text('Report Reference ID', 40, 39, { align: 'center' });

        // 3. Details
        doc.setFontSize(9);
        doc.setTextColor(50);
        doc.text('Category:', 10, 50);
        doc.setFont('helvetica', 'bold');
        doc.text(category.toUpperCase(), 35, 50);

        doc.setFont('helvetica', 'normal');
        doc.text('Date:', 10, 58);
        doc.setFont('helvetica', 'bold');
        doc.text(new Date(date).toLocaleDateString(), 35, 58);

        doc.setFont('helvetica', 'normal');
        doc.text('Time:', 10, 66);
        doc.setFont('helvetica', 'bold');
        doc.text(new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 35, 66);

        // Location text wrapping
        doc.setFont('helvetica', 'normal');
        doc.text('Location:', 10, 74);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');

        const splitLoc = doc.splitTextToSize(location, 40);
        doc.text(splitLoc, 35, 74);

        // 4. QR Code
        try {
            const qrData = await QRCode.toDataURL(`https://evms-app.com/track/${reportId}`, { margin: 1 });
            doc.addImage(qrData, 'PNG', 20, 90, 40, 40);
        } catch (err) {
            console.error('QR Gen Error', err);
        }

        // 5. Footer
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150);
        doc.text('Track status at evms-app.com/track', 40, 135, { align: 'center' });

        doc.save(`Receipt-${reportId.slice(0, 6)}.pdf`);
    };

    return (
        <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ mt: 2, borderRadius: 2 }}
        >
            Download Official Receipt
        </Button>
    );
}
