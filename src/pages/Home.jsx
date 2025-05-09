import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Report as ReportIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    Login as LoginIcon
} from '@mui/icons-material';
import config from '../config';

const pages = [
    { name: 'Dashboard', path: config.ROUTES.DASHBOARD, icon: <DashboardIcon /> },
    { name: 'Users', path: config.ROUTES.USERS, icon: <PeopleIcon /> },
    { name: 'Reports', path: config.ROUTES.REPORTS, icon: <ReportIcon /> },
    { name: 'Statistics', path: config.ROUTES.STATS, icon: <BarChartIcon /> },
    { name: 'Settings', path: config.ROUTES.SETTINGS, icon: <SettingsIcon /> },
    { name: 'Login', path: config.ROUTES.LOGIN, icon: <LoginIcon /> },
];

function Home() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                width: '100vw',
                height: '100vh',
                overflow: 'auto',
                py: 4
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Admin Panel
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Select a page to navigate
                    </Typography>
                    <Grid container spacing={3}>
                        {pages.map((page) => (
                            <Grid item xs={12} sm={6} md={4} key={page.path}>
                                <Button
                                    component={Link}
                                    to={page.path}
                                    variant="outlined"
                                    fullWidth
                                    startIcon={page.icon}
                                    sx={{
                                        height: '100%',
                                        py: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 1
                                    }}
                                >
                                    {page.name}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}

export default Home; 