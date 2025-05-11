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
  Grid,
  Chip,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Block as BanIcon,
  LockOpen as UnbanIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { axiosPrivate } from '../axios';

// Mock data for testing
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    telegramId: '123456789',
    isBanned: true,
    banReason: 'Inappropriate behavior',
    bannedAt: '2024-03-15T10:00:00Z'
  },
  {
    _id: '2',
    name: 'Jane Smith',
    telegramId: '987654321',
    isBanned: false
  }
];

const Ban = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.telegramId.includes(searchQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      // For testing, we'll use mock data
      const response = await axiosPrivate.get('/admin/users', {
        params: {
          page: page + 1,
          limit: rowsPerPage
        }
      });
      console.log(response);
      setUsers(response.data.users);
      // setUsers(mockUsers);
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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleBanUser = (user) => {
    setSelectedUser(user);
    setBanReason('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setBanReason('');
  };

  const handleBan = async () => {
    try {
      await axiosPrivate.put(`/admin/users/${selectedUser._id}/ban`, { ban:true, reason: banReason });
      // For testing, update mock data
      setUsers(users.map(user => 
        user._id === selectedUser._id ? {
          ...user,
          isBanned: true,
          banReason,
          bannedAt: new Date().toISOString()
        } : user
      ));
      toast.success('User banned successfully');
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to ban user');
    }
  };

  const handleUnban = async (userId) => {
    if (window.confirm('Are you sure you want to unban this user?')) {
      try {
        await axiosPrivate.put(`/admin/users/${userId}/unban`, {ban:false});
        // For testing, update mock data
        setUsers(users.map(user => 
          user._id === userId ? {
            ...user,
            isBanned: false,
            banReason: '',
            bannedAt: null
          } : user
        ));
        toast.success('User unbanned successfully');
      } catch (error) {
        toast.error('Failed to unban user');
      }
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">User Ban Management</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or Telegram ID..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Telegram ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ban Reason</TableCell>
              <TableCell>Banned At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.telegramId}</TableCell>
                <TableCell>
                  <Chip
                    label={user.banStatus?.ban ? 'Banned' : 'Active'}
                    color={user.banStatus?.ban ? 'error' : 'success'}
                  />
                </TableCell>
                <TableCell>
                  {user.banStatus?.history?.[user.banStatus.history.length - 1]?.reason || '-'}
                </TableCell>
                <TableCell>
                  {user.banStatus?.history?.[user.banStatus.history.length - 1]?.date
                    ? new Date(user.banStatus.history[user.banStatus.history.length - 1].date).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {user.banStatus?.ban ? (
                    <Tooltip title="Unban">
                      <IconButton onClick={() => handleUnban(user._id)} color="success">
                        <UnbanIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Ban">
                      <IconButton onClick={() => handleBanUser(user)} color="error">
                        <BanIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ban User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Are you sure you want to ban {selectedUser?.name}?
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ban Reason"
                multiline
                rows={4}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleBan}
            color="error"
            variant="contained"
            disabled={!banReason.trim()}
          >
            Ban User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ban; 