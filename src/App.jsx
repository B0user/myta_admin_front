import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import config from './config';
import theme from './theme';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path={config.ROUTES.LOGIN} element={<Login />} />
                    
                    {/* All routes under Layout */}
                    <Route element={<Layout />}>
                        <Route path={config.ROUTES.DASHBOARD} element={<Dashboard />} />
                        <Route path={config.ROUTES.USERS} element={<div>Users Page</div>} />
                        <Route path={config.ROUTES.REPORTS} element={<div>Reports Page</div>} />
                        <Route path={config.ROUTES.STATS} element={<div>Stats Page</div>} />
                        <Route path={config.ROUTES.SETTINGS} element={<div>Settings Page</div>} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App; 