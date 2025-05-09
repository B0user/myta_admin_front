import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { axiosPrivate } from '../axios';

// Mock data for testing
const mockSettings = {
  general: {
    siteName: 'Dating App Admin',
    maintenanceMode: false,
    defaultLanguage: 'en',
    timezone: 'UTC'
  },
  security: {
    sessionTimeout: 30,
    requireTwoFactor: false,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90
  },
  notifications: {
    emailNotifications: true,
    telegramNotifications: true,
    notificationTypes: {
      newUser: true,
      newReport: true,
      verificationRequest: true,
      systemAlert: true
    }
  },
  limits: {
    maxUsersPerPage: 50,
    maxReportsPerPage: 25,
    maxVerificationsPerPage: 20,
    maxFileSize: 5
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    lastBackup: '2024-03-15T10:00:00Z'
  }
};

const Settings = () => {
  const [settings, setSettings] = useState(mockSettings);
  const [loading, setLoading] = useState(false);
  const [openBackupDialog, setOpenBackupDialog] = useState(false);
  const [backupType, setBackupType] = useState('full');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // const response = await axiosPrivate.get('/admin/settings');
      // setSettings(response.data);
      setSettings(mockSettings);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    try {
      setLoading(true);
      // await axiosPrivate.put(`/admin/settings/${section}`, settings[section]);
      toast.success(`${section} settings saved successfully`);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleBackup = async () => {
    try {
      setLoading(true);
      // await axiosPrivate.post('/admin/backup', { type: backupType });
      toast.success('Backup initiated successfully');
      setOpenBackupDialog(false);
    } catch (error) {
      toast.error('Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (backupId) => {
    if (window.confirm('Are you sure you want to restore this backup? This will override current settings.')) {
      try {
        setLoading(true);
        // await axiosPrivate.post(`/admin/restore/${backupId}`);
        toast.success('Settings restored successfully');
      } catch (error) {
        toast.error('Failed to restore settings');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Settings</Typography>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="General Settings"
              action={
                <Button
                  startIcon={<SaveIcon />}
                  onClick={() => handleSave('general')}
                  disabled={loading}
                >
                  Save
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Site Name"
                    value={settings.general.siteName}
                    onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Default Language</InputLabel>
                    <Select
                      value={settings.general.defaultLanguage}
                      onChange={(e) => handleChange('general', 'defaultLanguage', e.target.value)}
                      label="Default Language"
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.maintenanceMode}
                        onChange={(e) => handleChange('general', 'maintenanceMode', e.target.checked)}
                      />
                    }
                    label="Maintenance Mode"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Security Settings"
              action={
                <Button
                  startIcon={<SaveIcon />}
                  onClick={() => handleSave('security')}
                  disabled={loading}
                >
                  Save
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Session Timeout (minutes)"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Login Attempts"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.requireTwoFactor}
                        onChange={(e) => handleChange('security', 'requireTwoFactor', e.target.checked)}
                      />
                    }
                    label="Require Two-Factor Authentication"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Notification Settings"
              action={
                <Button
                  startIcon={<SaveIcon />}
                  onClick={() => handleSave('notifications')}
                  disabled={loading}
                >
                  Save
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleChange('notifications', 'emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.telegramNotifications}
                        onChange={(e) => handleChange('notifications', 'telegramNotifications', e.target.checked)}
                      />
                    }
                    label="Telegram Notifications"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Notification Types</Typography>
                  <Grid container spacing={1}>
                    {Object.entries(settings.notifications.notificationTypes).map(([type, enabled]) => (
                      <Grid item xs={12} key={type}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={enabled}
                              onChange={(e) => handleChange('notifications', 'notificationTypes', {
                                ...settings.notifications.notificationTypes,
                                [type]: e.target.checked
                              })}
                            />
                          }
                          label={type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Backup & Restore */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Backup & Restore"
              action={
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={() => setOpenBackupDialog(true)}
                  disabled={loading}
                >
                  Backup Now
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.backup.autoBackup}
                        onChange={(e) => handleChange('backup', 'autoBackup', e.target.checked)}
                      />
                    }
                    label="Automatic Backup"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backup.backupFrequency}
                      onChange={(e) => handleChange('backup', 'backupFrequency', e.target.value)}
                      label="Backup Frequency"
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Last Backup</Typography>
                  <Typography>
                    {new Date(settings.backup.lastBackup).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Backup Dialog */}
      <Dialog open={openBackupDialog} onClose={() => setOpenBackupDialog(false)}>
        <DialogTitle>Create Backup</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Backup Type</InputLabel>
            <Select
              value={backupType}
              onChange={(e) => setBackupType(e.target.value)}
              label="Backup Type"
            >
              <MenuItem value="full">Full Backup</MenuItem>
              <MenuItem value="settings">Settings Only</MenuItem>
              <MenuItem value="users">Users Data Only</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBackupDialog(false)}>Cancel</Button>
          <Button onClick={handleBackup} variant="contained" disabled={loading}>
            Create Backup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 