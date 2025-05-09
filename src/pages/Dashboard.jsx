import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import {
    People as PeopleIcon,
    Group as GroupIcon,
    Favorite as FavoriteIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { axiosPrivate } from '../axios';
import config from '../config';

function StatCard({ title, value, icon }) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                height: '100%'
            }}
        >
            <Box sx={{ mr: 2, color: 'primary.main' }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="h6" color="text.secondary">
                    {title}
                </Typography>
                <Typography variant="h4" component="div">
                    {value}
                </Typography>
            </Box>
        </Paper>
    );
}

function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalMatches: 0,
        totalReports: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsResponse, activityResponse] = await Promise.all([
                    axiosPrivate.get(config.API.ADMIN.STATS),
                    axiosPrivate.get(config.API.ADMIN.RECENT_ACTIVITY)
                ]);

                setStats(statsResponse.data);
                setRecentActivity(activityResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={<PeopleIcon sx={{ fontSize: 40 }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Users"
                        value={stats.activeUsers}
                        icon={<GroupIcon sx={{ fontSize: 40 }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Matches"
                        value={stats.totalMatches}
                        icon={<FavoriteIcon sx={{ fontSize: 40 }} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Reports"
                        value={stats.totalReports}
                        icon={<WarningIcon sx={{ fontSize: 40 }} />}
                    />
                </Grid>
            </Grid>

            <Paper elevation={2}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" component="h2">
                        Recent Activity
                    </Typography>
                </Box>
                <Divider />
                <List>
                    {recentActivity.map((activity, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={activity.description}
                                secondary={new Date(activity.timestamp).toLocaleString()}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}

export default Dashboard; 