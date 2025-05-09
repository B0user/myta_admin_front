import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { axiosPrivate } from '../axios';

// Mock data for testing
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    gender: 'male',
    wantToFind: 'female',
    birthDay: '1990-01-01',
    country: 'USA',
    city: 'New York',
    purpose: 'Dating',
    interests: ['Sports', 'Music'],
    isVerified: true,
    wallet: { subscription: { type: 'premium' } }
  },
  {
    _id: '2',
    name: 'Jane Smith',
    gender: 'female',
    wantToFind: 'male',
    birthDay: '1992-05-15',
    country: 'Canada',
    city: 'Toronto',
    purpose: 'Friendship',
    interests: ['Reading', 'Travel'],
    isVerified: false,
    wallet: { subscription: { type: 'free' } }
  },
  // Add more mock users as needed
];

const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    wantToFind: '',
    birthDay: '',
    country: '',
    city: '',
    purpose: '',
    interests: [],
    isVerified: false,
    'wallet.subscription.type': 'free'
  });

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      // For testing, we'll use mock data
      // const response = await axiosPrivate.get('/users', {
      //   params: {
      //     page: page + 1,
      //     limit: rowsPerPage
      //   }
      // });
      // setUsers(response.data.users);
      setUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error('Failed to fetch users');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name || '',
        gender: user.gender || '',
        wantToFind: user.wantToFind || '',
        birthDay: user.birthDay ? new Date(user.birthDay).toISOString().split('T')[0] : '',
        country: user.country || '',
        city: user.city || '',
        purpose: user.purpose || '',
        interests: user.interests || [],
        isVerified: user.isVerified || false,
        'wallet.subscription.type': user.wallet?.subscription?.type || 'free'
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        gender: '',
        wantToFind: '',
        birthDay: '',
        country: '',
        city: '',
        purpose: '',
        interests: [],
        isVerified: false,
        'wallet.subscription.type': 'free'
      });
    }
    setOpenDialog(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenViewDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        // await axiosPrivate.put(`/users/${selectedUser._id}`, formData);
        // For testing, update mock data
        setUsers(users.map(user => 
          user._id === selectedUser._id ? { ...user, ...formData } : user
        ));
        toast.success('User updated successfully');
      } else {
        // await axiosPrivate.post('/users', formData);
        // For testing, add to mock data
        setUsers([...users, { _id: Date.now().toString(), ...formData }]);
        toast.success('User created successfully');
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // await axiosPrivate.delete(`/users/${userId}`);
        // For testing, remove from mock data
        setUsers(users.filter(user => user._id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          // Handle the JSON data here
          console.log('Uploaded JSON:', jsonData);
          toast.success('File uploaded successfully');
          setOpenUploadDialog(false);
        } catch (error) {
          toast.error('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setOpenUploadDialog(true)}
            sx={{ mr: 2 }}
          >
            Upload Users
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Looking For</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.wantToFind}</TableCell>
                <TableCell>{`${user.city}, ${user.country}`}</TableCell>
                <TableCell>
                  <Chip
                    label={user.wallet?.subscription?.type || 'free'}
                    color={user.wallet?.subscription?.type === 'premium' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isVerified ? 'Yes' : 'No'}
                    color={user.isVerified ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton onClick={() => handleViewUser(user)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Edit/Create Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Looking For"
                name="wantToFind"
                value={formData.wantToFind}
                onChange={handleInputChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Birthday"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Subscription Type"
                name="wallet.subscription.type"
                value={formData['wallet.subscription.type']}
                onChange={handleInputChange}
              >
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedUser.name}</Typography>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Gender</Typography>
                <Typography>{selectedUser.gender}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Looking For</Typography>
                <Typography>{selectedUser.wantToFind}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Birthday</Typography>
                <Typography>{new Date(selectedUser.birthDay).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Location</Typography>
                <Typography>{`${selectedUser.city}, ${selectedUser.country}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Purpose</Typography>
                <Typography>{selectedUser.purpose}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Interests</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedUser.interests.map((interest, index) => (
                    <Chip key={index} label={interest} />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Subscription</Typography>
                <Chip
                  label={selectedUser.wallet?.subscription?.type || 'free'}
                  color={selectedUser.wallet?.subscription?.type === 'premium' ? 'primary' : 'default'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Verified</Typography>
                <Chip
                  label={selectedUser.isVerified ? 'Yes' : 'No'}
                  color={selectedUser.isVerified ? 'success' : 'default'}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          <Button onClick={() => {
            handleCloseViewDialog();
            handleOpenDialog(selectedUser);
          }} variant="contained">
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
        <DialogTitle>Upload Users</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept=".json"
              style={{ display: 'none' }}
              id="upload-file"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="upload-file">
              <Button variant="contained" component="span">
                Choose JSON File
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users; 