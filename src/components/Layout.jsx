import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
    Container,
    Divider,
    Collapse
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Report as ReportIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    VerifiedUser as VerifiedUserIcon,
    Block as BlockIcon,
    ExpandLess,
    ExpandMore,
    Support
} from '@mui/icons-material';
import config from '../config';
import { useTheme, useMediaQuery } from '@mui/material';

const drawerWidth = 240;

function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [moderationOpen, setModerationOpen] = useState(true);
    const [usersOpen, setUsersOpen] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleModerationToggle = () => {
        setModerationOpen(!moderationOpen);
    };

    const handleUsersToggle = () => {
        setUsersOpen(!usersOpen);
    };

    const navigation = [
        { name: 'Dashboard', path: config.ROUTES.DASHBOARD, icon: <DashboardIcon /> },
        { name: 'Users', path: config.ROUTES.USERS, icon: <PeopleIcon /> },
        // { name: 'Settings', path: config.ROUTES.SETTINGS, icon: <SettingsIcon /> },
    ];

    const userItems = [
        { text: 'All Users', path: config.ROUTES.USERS, icon: <PeopleIcon /> },
        { text: 'Wallets', path: config.ROUTES.WALLETS, icon: <BarChartIcon /> },
    ];

    const moderationItems = [
        { text: 'Verification', path: config.ROUTES.VERIFICATION, icon: <VerifiedUserIcon /> },
        { text: 'Ban Users', path: config.ROUTES.BAN, icon: <BlockIcon /> },
        { text: 'Support', path: config.ROUTES.SUPPORT, icon: <Support /> },
    ];

    const handleLogout = () => {
        navigate(config.ROUTES.LOGIN);
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Admin Panel
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {navigation.map((item, index) => (
                    <ListItem
                        button
                        key={index}
                        onClick={() => {
                            if (item.name === 'Users') {
                                handleUsersToggle();
                            } else {
                                navigate(item.path);
                                if (isMobile) setMobileOpen(false);
                            }
                        }}
                        selected={location.pathname === item.path}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                        {item.name === 'Users' && (usersOpen ? <ExpandLess /> : <ExpandMore />)}
                    </ListItem>
                ))}
            </List>
            <Collapse in={usersOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {userItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) setMobileOpen(false);
                            }}
                            selected={location.pathname === item.path}
                            sx={{ pl: 4 }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Collapse>
            <Divider />
            <List>
                <ListItem button onClick={handleModerationToggle}>
                    <ListItemIcon>
                        <VerifiedUserIcon />
                    </ListItemIcon>
                    <ListItemText primary="Moderation" />
                    {moderationOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={moderationOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {moderationItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }}
                                selected={location.pathname === item.path}
                                sx={{ pl: 4 }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {navigation.find(item => item.path === location.pathname)?.name || 
                         moderationItems.find(item => item.path === location.pathname)?.text || 
                         'Admin Panel'}
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px',
                    minHeight: 'calc(100vh - 64px)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box sx={{ 
                    width: '100%',
                    height: '100%',
                    p: 3
                }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default Layout; 