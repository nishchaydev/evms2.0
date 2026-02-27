import { getEmployeeByToken } from '@/lib/actions';
import { verifyJWT } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { LinkButton, MuiNextLink } from '@/components/ClientLinks';
import FlipCard from '@/components/FlipCard';
import VerifyHeader from '@/components/VerifyHeader';

// MUI Imports
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Avatar,
    Chip,
    Button,
    Divider,
    Alert,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Breadcrumbs
} from '@mui/material';

// Icons
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import BadgeIcon from '@mui/icons-material/Badge';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import FlagIcon from '@mui/icons-material/Flag';
import PrintIcon from '@mui/icons-material/Print';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface PageProps {
    params: Promise<{ token: string }>;
}

export default async function VerifyPage(props: PageProps) {
    const params = await props.params;
    const { token } = params;
    const employee = await getEmployeeByToken(token);

    // Role Check & Audit Logging
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    let viewerRole = 'PUBLIC';
    let viewerId: string | null = null;

    if (tokenCookie) {
        const payload = await verifyJWT(tokenCookie.value);
        if (payload && payload.role) {
            viewerRole = payload.role as string;
            viewerId = payload.userId as string;
        }
    }

    const isOfficer = ['OFFICER', 'ADMIN', 'SUPER_ADMIN'].includes(viewerRole);

    // Audit the Scan
    if (isOfficer && viewerId) {
        try {
            const { logScan } = await import('@/lib/log-actions');
            if (employee) {
                await logScan(viewerId, employee.id, 'SUCCESS', 'Scanned via QR verify page');
            } else {
                await logScan(viewerId, null as any, 'FAILED', `Invalid/Suspended Token: ${token}`);
            }
        } catch (e) {
            console.error("Scan logging failed", e);
        }
    }

    if (!employee) {
        return (
            <Container maxWidth="sm" sx={{ mt: 10 }}>
                <Alert severity="error">Invalid or Suspended QR Token.</Alert>
                <LinkButton href="/" sx={{ mt: 2 }} variant="outlined">Return Home</LinkButton>
            </Container>
        );
    }



    // ...

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>

            {/* Top Navigation Bar */}
            <VerifyHeader />

            {/* Main Content */}
            <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>

                {/* Back Link */}
                <Box sx={{ width: '100%', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <LinkButton href="/" startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />} variant="text" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' }, textTransform: 'none', fontWeight: 500 }}>
                        Back to Search
                    </LinkButton>
                </Box>

                {/* Employee Profile Card (Responsive Flip) */}
                <FlipCard employee={employee} />

                {/* Footer */}
                <Box component="footer" sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        © 2024 Nagar Nigam (IMC). All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <MuiNextLink href="#" variant="caption" color="text.secondary" underline="hover">Privacy Policy</MuiNextLink>
                        <MuiNextLink href="#" variant="caption" color="text.secondary" underline="hover">Terms of Use</MuiNextLink>
                    </Box>
                </Box>

            </Container>
        </Box>
    );
}


