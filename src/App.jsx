import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Verification from './pages/Verification';
import Ban from './pages/Ban';
import Settings from './pages/Settings';
import config from './config';
import theme from './theme';
import Wallets from './pages/Wallets';

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
                        <Route path="/users" element={<Users />} />

                        <Route path={config.ROUTES.WALLETS} element={<Wallets/>} />
                        <Route path={config.ROUTES.REPORTS} element={<div>Reports Page</div>} />
                        <Route path={config.ROUTES.STATS} element={<div>Stats Page</div>} />
                        <Route path={config.ROUTES.SETTINGS} element={<Settings />} />
                        <Route path={config.ROUTES.VERIFICATION} element={<Verification />} />
                        <Route path={config.ROUTES.BAN} element={<Ban />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App; 