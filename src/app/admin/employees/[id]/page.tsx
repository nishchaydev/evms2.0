'use client';

import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Breadcrumbs,
    Link as MuiLink,
    Avatar,
    Chip,
    Tabs,
    Tab,
    Divider,
    IconButton,
    CircularProgress,
    Alert,
    TextField,
    MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { getEmployeeById, addEducation, addExperience, addRecruitment, deleteExperience, deleteRecruitment } from '@/lib/employee-actions';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ServiceBookPreview from '@/components/ServiceBookPreview';
import DigitalIDModal from '@/components/DigitalIDModal';
import { Employee, Experience, Education, Recruitment } from '@/types/employee';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function AddEducationForm({ employeeId, onSuccess }: { employeeId: string, onSuccess: () => void }) {
    const [isPending, startTransition] = useState(false);

    async function handleSubmit(formData: FormData) {
        startTransition(true);
        const res = await addEducation(employeeId, formData);
        startTransition(false);
        if (res.success) {
            onSuccess();
        } else {
            alert('Failed to add education');
        }
    }

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: 1, borderColor: 'primary.light', bgcolor: 'primary.lighter', borderRadius: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>Add New Qualification</Typography>
            <form action={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField name="level" select fullWidth label="Level" size="small" defaultValue="Graduation" InputProps={{ sx: { bgcolor: 'white' } }}>
                            <MenuItem value="10th">10th / Matric</MenuItem>
                            <MenuItem value="12th">12th / Inter</MenuItem>
                            <MenuItem value="Diploma">Diploma</MenuItem>
                            <MenuItem value="Graduation">Graduation</MenuItem>
                            <MenuItem value="Post Graduation">Post Graduation</MenuItem>
                            <MenuItem value="PhD">PhD</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField name="degree" fullWidth label="Degree/Course" placeholder="e.g. B.Tech" size="small" required InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField name="institution" fullWidth label="Board/University" placeholder="University Name" size="small" required InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                        <TextField name="passingYear" fullWidth label="Year" placeholder="2015" size="small" required InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                        <TextField name="grade" fullWidth label="Grade/%" placeholder="85%" size="small" InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" size="small" disabled={isPending} sx={{ textTransform: 'none' }}>
                            {isPending ? 'Adding...' : 'Add Record'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}


function AddExperienceForm({ employeeId, onSuccess }: { employeeId: string, onSuccess: () => void }) {
    const [isPending, startTransition] = useState(false);

    async function handleSubmit(formData: FormData) {
        startTransition(true);
        const res = await addExperience(employeeId, formData);
        startTransition(false);
        if (res.success) {
            onSuccess();
        } else {
            alert('Failed to add experience');
        }
    }

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: 1, borderColor: 'primary.light', bgcolor: 'primary.lighter', borderRadius: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>Add Previous Experience</Typography>
            <form action={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField name="company" fullWidth label="Department / Company" placeholder="e.g. Health Dept" size="small" required InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="designation" fullWidth label="Designation" placeholder="e.g. Clerk" size="small" required InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField name="startDate" type="date" fullWidth label="From" size="small" InputLabelProps={{ shrink: true }} required InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField name="endDate" type="date" fullWidth label="To" size="small" InputLabelProps={{ shrink: true }} InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField name="description" fullWidth label="Description (Optional)" multiline rows={2} size="small" InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" size="small" disabled={isPending} sx={{ textTransform: 'none' }}>
                            {isPending ? 'Adding...' : 'Add Experience'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}

function AddRecruitmentForm({ employeeId, onSuccess }: { employeeId: string, onSuccess: () => void }) {
    const [isPending, startTransition] = useState(false);

    async function handleSubmit(formData: FormData) {
        startTransition(true);
        const res = await addRecruitment(employeeId, formData);
        startTransition(false);
        if (res.success) {
            onSuccess();
        } else {
            alert('Failed to add recruitment details');
        }
    }

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: 1, borderColor: 'primary.light', bgcolor: 'primary.lighter', borderRadius: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>Add Recruitment Details</Typography>
            <form action={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField name="examName" fullWidth label="Exam Name" placeholder="e.g. MPPSC 2023" size="small" required InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField name="examYear" fullWidth label="Exam Year" placeholder="2023" size="small" required InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <TextField name="rank" fullWidth label="Rank / Score" placeholder="Rank 14" size="small" InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="orderNumber" fullWidth label="Appointment Order No." size="small" InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField name="orderDate" type="date" fullWidth label="Order Date" size="small" InputLabelProps={{ shrink: true }} InputProps={{ sx: { bgcolor: 'white' } }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" size="small" disabled={isPending} sx={{ textTransform: 'none' }}>
                            {isPending ? 'Adding...' : 'Add Detail'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}

export default function EmployeeDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [serviceBookOpen, setServiceBookOpen] = useState(false);
    const [digitalIDOpen, setDigitalIDOpen] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!id) return;
            try {
                const data = await getEmployeeById(id);
                if (data) {
                    setEmployee(data as unknown as Employee);
                } else {
                    setError('Employee not found');
                }
            } catch (err) {
                setError('Failed to load employee details');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) return <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;
    if (error || !employee) return <Box sx={{ p: 4 }}><Alert severity="error">{error || 'Employee not found'}</Alert><Button onClick={() => router.back()} sx={{ mt: 2 }}>Go Back</Button></Box>;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8', p: { xs: 2, md: 4 } }}>

            {/* Breadcrumbs */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <MuiLink component={Link} href="/admin/employees" underline="hover" color="inherit">Employees</MuiLink>
                    <MuiLink underline="hover" color="inherit">{employee.department}</MuiLink>
                    <Typography color="text.primary" fontWeight="500">{employee.firstName} {employee.lastName}</Typography>
                </Breadcrumbs>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} color="inherit">Back to List</Button>
            </Box>

            {/* Header Card */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: 1, borderColor: 'divider', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, bgcolor: 'primary.main' }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: { xs: 'center', md: 'flex-start' } }}>
                    <Avatar
                        src={employee.photoUrl || undefined}
                        sx={{
                            width: 140,
                            height: 140,
                            border: '6px solid white',
                            boxShadow: '8px 8px 0px 0px rgba(6, 78, 59, 0.2)',
                            fontSize: 48,
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            borderRadius: (theme) => theme.shape.borderRadius // Respect theme but bigger
                        }}
                    >
                        {employee.firstName?.[0]}{employee.lastName?.[0]}
                    </Avatar>

                    <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Typography variant="h3" fontWeight="900" sx={{ textTransform: 'uppercase' }}>{employee.firstName} {employee.lastName}</Typography>
                            <Chip
                                label={employee.status}
                                size="small"
                                sx={{
                                    borderRadius: 0,
                                    fontWeight: '900',
                                    bgcolor: 'success.main',
                                    color: 'white',
                                    height: 24,
                                    fontSize: '0.7rem'
                                }}
                            />
                        </Box>

                        <Typography variant="h6" color="primary" gutterBottom>{employee.designation}</Typography>

                        <Box sx={{ display: 'flex', gap: 3, color: 'text.secondary', fontSize: '0.875rem', flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VerifiedIcon fontSize="small" /> {employee.employeeCode}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <span style={{ opacity: 0.4 }}>|</span> <AccountBalanceIcon fontSize="small" /> {employee.department}
                            </Box>
                            {employee.zone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <span style={{ opacity: 0.4 }}>|</span> {employee.zone}
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            component={Link}
                            href={`/admin/employees/${employee.id}/edit`}
                            sx={{ fontWeight: 800, px: 3, boxShadow: '4px 4px 0px 0px #022C22' }}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => setServiceBookOpen(true)}
                            sx={{ fontWeight: 800, border: '3px solid' }}
                        >
                            Service Book
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<QrCodeIcon />}
                            onClick={() => setDigitalIDOpen(true)}
                            sx={{ fontWeight: 800, border: '3px solid' }}
                        >
                            Digital ID
                        </Button>
                    </Box>
                </Box>

                {/* Tabs */}
                <Box sx={{ mt: 4, borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                        <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 600 }} />
                        <Tab label="Employment" sx={{ textTransform: 'none', fontWeight: 600 }} />
                        <Tab label="Experience" sx={{ textTransform: 'none', fontWeight: 600 }} />
                        <Tab label="Education" sx={{ textTransform: 'none', fontWeight: 600 }} />
                        <Tab label="Recruitment" sx={{ textTransform: 'none', fontWeight: 600 }} />
                    </Tabs>
                </Box>
            </Paper>

            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    {/* Basic Info */}
                    <Grid item xs={12} md={5}>
                        <InfoCard title="BASIC INFORMATION" onEdit={() => router.push(`/admin/employees/${employee.id}/edit`)}>
                            <InfoRow label="DATE OF BIRTH" value={`${new Date(employee.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`} subValue={`(${new Date().getFullYear() - new Date(employee.dob).getFullYear()} Yrs)`} />
                            <Grid container>
                                <Grid item xs={6}><InfoRow label="GENDER" value="Male" /></Grid> {/* TODO: Add Gender to Schema if needed, distinct from basic? */}
                                <Grid item xs={6}><InfoRow label="BLOOD GROUP" value={employee.bloodGroup || '-'} /></Grid>
                            </Grid>
                            <InfoRow label="FATHER'S NAME" value={employee.fatherName || '-'} />
                            <InfoRow label="MARITAL STATUS" value={employee.maritalStatus || '-'} />
                        </InfoCard>
                    </Grid>

                    {/* Current Employment */}
                    <Grid item xs={12} md={7}>
                        <InfoCard title="CURRENT EMPLOYMENT">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow label="DEPARTMENT" value={employee.department} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow label="CURRENT DESIGNATION" value={employee.designation} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow label="DATE OF JOINING" value={new Date(employee.joiningDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow label="CONFIRMATION DATE" value={employee.confirmationDate ? new Date(employee.confirmationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow label="PAY GRADE / LEVEL" value={employee.payGrade || '-'} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow label="REPORTING OFFICER" value={employee.reportingOfficer || '-'} isUser />
                                </Grid>
                            </Grid>
                        </InfoCard>
                    </Grid>

                    {/* Contact Details */}
                    <Grid item xs={12} md={5}>
                        <InfoCard title="CONTACT DETAILS" onEdit={() => router.push(`/admin/employees/${employee.id}/edit`)}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}><PhoneIcon color="action" /></Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">MOBILE</Typography>
                                    <Typography variant="body1" fontWeight="500">{employee.contactNumber || '-'}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}><EmailIcon color="action" /></Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">EMAIL (OFFICIAL)</Typography>
                                    <Typography variant="body1" fontWeight="500">{employee.email}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}><HomeIcon color="action" /></Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">PERMANENT ADDRESS</Typography>
                                    <Typography variant="body1" fontWeight="500">{employee.permanentAddress || employee.currentAddress || '-'}</Typography>
                                </Box>
                            </Box>
                        </InfoCard>
                    </Grid>

                    {/* Experience Placeholder */}
                    <Grid item xs={12} md={7}>
                        <InfoCard title="EXPERIENCE & PROMOTIONS">
                            <Box sx={{ position: 'relative', pl: 2, '&::before': { content: '""', position: 'absolute', left: 0, top: 8, bottom: 0, width: 2, bgcolor: 'divider' } }}>
                                <TimelineItem
                                    title={`Joined as ${employee.designation}`} // Fallback
                                    date={`${new Date(employee.joiningDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} - Present`}
                                    desc={`Joined ${employee.department} as ${employee.designation}.`}
                                    isLatest
                                />
                                {/* Placeholder for past experience */}
                            </Box>
                            <Button size="small" sx={{ mt: 2, textTransform: 'none' }}>View Full History</Button>
                        </InfoCard>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                {/* <Alert severity="info" variant="outlined">Detailed employment history module coming soon.</Alert> */}
                {/* Placeholder content - can be removed later */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <InfoCard title="EMPLOYMENT HISTORY">
                            <Box sx={{ position: 'relative', pl: 2, '&::before': { content: '""', position: 'absolute', left: 0, top: 8, bottom: 0, width: 2, bgcolor: 'divider' } }}>
                                <TimelineItem
                                    title={`Joined as ${employee.designation}`} // Fallback
                                    date={`${new Date(employee.joiningDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} - Present`}
                                    desc={`Joined ${employee.department} as ${employee.designation}.`}
                                    isLatest
                                />
                            </Box>
                        </InfoCard>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <Box sx={{ maxWidth: 800 }}>
                    <AddExperienceForm employeeId={employee.id} onSuccess={() => window.location.reload()} />

                    {employee.experiences && employee.experiences.length > 0 ? (
                        <Box sx={{ position: 'relative', pl: 2, '&::before': { content: '""', position: 'absolute', left: 0, top: 8, bottom: 0, width: 2, bgcolor: 'divider' } }}>
                            {employee.experiences.map((exp: Experience) => (
                                <TimelineItem
                                    key={exp.id}
                                    title={exp.designation}
                                    date={`${new Date(exp.startDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'Present'}`}
                                    desc={`${exp.company}. ${exp.description || ''}`}
                                    onDelete={async () => {
                                        if (confirm('Are you sure?')) {
                                            await deleteExperience(exp.id, employee.id);
                                            window.location.reload();
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Alert severity="info" variant="outlined">No previous experience records found.</Alert>
                    )}
                </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
                <Box sx={{ maxWidth: 800 }}>
                    <AddEducationForm employeeId={employee.id} onSuccess={() => window.location.reload()} />

                    {employee.education && employee.education.length > 0 ? (
                        employee.education.map((edu: Education) => (
                            <Paper key={edu.id} elevation={0} sx={{ p: 3, mb: 2, borderRadius: 3, border: 1, borderColor: 'divider', position: 'relative' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" color="primary">{edu.degree}</Typography>
                                        <Typography variant="body1" fontWeight="500">{edu.institution}</Typography>
                                        <Typography variant="body2" color="text.secondary">{edu.level} • {edu.passingYear}</Typography>
                                    </Box>
                                    {edu.grade && <Chip label={edu.grade} size="small" color="success" variant="outlined" />}
                                </Box>
                            </Paper>
                        ))
                    ) : (
                        <Alert severity="info" variant="outlined">No education records found. Please add one.</Alert>
                    )}
                </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
                <Box sx={{ maxWidth: 800 }}>
                    <AddRecruitmentForm employeeId={employee.id} onSuccess={() => window.location.reload()} />

                    {employee.recruitments && employee.recruitments.length > 0 ? (
                        employee.recruitments.map((rec: Recruitment) => (
                            <Paper key={rec.id} elevation={0} sx={{ p: 3, mb: 2, borderRadius: 3, border: 1, borderColor: 'divider', position: 'relative' }}>
                                <IconButton
                                    size="small"
                                    color="error"
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={async () => {
                                        if (confirm('Delete this record?')) {
                                            await deleteRecruitment(rec.id, employee.id);
                                            window.location.reload();
                                        }
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">EXAM NAME</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold">{rec.examName}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">YEAR</Typography>
                                        <Typography variant="body1">{rec.examYear}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">RANK</Typography>
                                        <Typography variant="body1">{rec.rank || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ORDER NO</Typography>
                                        <Typography variant="body1">{rec.orderNumber || '-'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary" fontWeight="bold">ORDER DATE</Typography>
                                        <Typography variant="body1">{rec.orderDate ? new Date(rec.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))
                    ) : (
                        <Alert severity="info" variant="outlined">No recruitment details added.</Alert>
                    )}
                </Box>
            </TabPanel>
        </Box>
    );
}

function InfoCard({ title, children, onEdit }: { title: string, children: React.ReactNode, onEdit?: () => void }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 0,
                border: '2px solid',
                borderColor: 'primary.main',
                height: '100%',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translate(-4px, -4px)',
                    boxShadow: '12px 12px 0px 0px #064E3B'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>{title}</Typography>
                {onEdit && <IconButton size="small" onClick={onEdit} sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}><EditIcon fontSize="small" /></IconButton>}
            </Box>
            {children}
        </Paper>
    );
}

function InfoRow({ label, value, subValue, isUser }: { label: string, value: string, subValue?: string, isUser?: boolean }) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" sx={{ mb: 0.5 }}>{label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isUser && <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{value?.[0]}</Avatar>}
                <Typography variant="body1" fontWeight="500">{value}</Typography>
                {subValue && <Typography variant="caption" color="text.secondary">{subValue}</Typography>}
            </Box>
        </Box>
    );
}

function TimelineItem({ title, date, desc, isLatest, onDelete }: { title: string, date: string, desc: string, isLatest?: boolean, onDelete?: () => void }) {
    return (
        <Box sx={{ mb: 3, position: 'relative' }}>
            <Box sx={{
                position: 'absolute',
                left: -21,
                top: 6,
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: isLatest ? 'success.main' : 'divider',
                border: '2px solid white',
                boxShadow: 1
            }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold">{title}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>{date}</Typography>
                    <Typography variant="body2" color="text.secondary">{desc}</Typography>
                </Box>
                {onDelete && (
                    <IconButton size="small" onClick={onDelete} color="error" sx={{ mt: -1, mr: -1 }}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}
