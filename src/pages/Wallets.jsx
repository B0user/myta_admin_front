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
  Tooltip,
  Chip
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { axiosPrivate } from '../axios';

const Wallets = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedWallet, setSelectedWallet] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      const response = await axiosPrivate.get('/admin/users');
      setUsers(response.data.users);
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

  const handleCopyWallet = (wallet) => {
    navigator.clipboard.writeText(wallet);
    toast.success('Wallet address copied to clipboard');
  };

  const handleViewWallet = (wallet) => {
    setSelectedWallet(wallet);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">User Wallets</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>TON Wallet</TableCell>
              <TableCell>Coins</TableCell>
              <TableCell>Myta Coins</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    {user.wallet?.ton_wallet ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: 'monospace',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {user.wallet.ton_wallet}
                        </Typography>
                      </Box>
                    ) : (
                      <Chip label="No wallet" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: 'monospace' }}>
                      {user.wallet?.coins?.toLocaleString() || '0'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontFamily: 'monospace' }}>
                      {user.wallet?.mytaCoins?.toLocaleString() || '0'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.wallet?.subscription?.type || 'free'}
                      color={user.wallet?.subscription?.type === 'premium' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {user.wallet?.ton_wallet && (
                      <>
                        <Tooltip title="Copy Wallet">
                          <IconButton
                            onClick={() => handleCopyWallet(user.wallet.ton_wallet)}
                            size="small"
                          >
                            <CopyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => handleViewWallet(user.wallet.ton_wallet)}
                            size="small"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
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

      {/* Wallet Details Dialog */}
      {selectedWallet && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: '90%',
            width: '400px'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Wallet Details
          </Typography>
          <Typography
            sx={{
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              mb: 2
            }}
          >
            {selectedWallet}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              onClick={() => handleCopyWallet(selectedWallet)}
              size="small"
              sx={{ mr: 1 }}
            >
              <CopyIcon />
            </IconButton>
            <IconButton
              onClick={() => setSelectedWallet(null)}
              size="small"
            >
              <ViewIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Wallets; 