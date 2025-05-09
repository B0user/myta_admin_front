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
  Grid,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  CheckCircle as VerifyIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { axiosPrivate } from '../axios';

// Mock data for testing
const mockVerifications = [
  {
    _id: '1',
    userId: 'user1',
    userName: 'John Doe',
    photo: 'https://example.com/photo1.jpg',
    status: 'pending',
    submittedAt: '2024-03-15T10:00:00Z',
    reason: 'Profile verification'
  },
  {
    _id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    photo: 'https://example.com/photo2.jpg',
    status: 'pending',
    submittedAt: '2024-03-15T11:30:00Z',
    reason: 'Identity verification'
  }
];

const Verification = () => {
  const [verifications, setVerifications] = useState(mockVerifications);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);

  useEffect(() => {
    fetchVerifications();
  }, [page, rowsPerPage]);

  const fetchVerifications = async () => {
    try {
      // For testing, we'll use mock data
      // const response = await axiosPrivate.get('/verifications', {
      //   params: {
      //     page: page + 1,
      //     limit: rowsPerPage
      //   }
      // });
      // setVerifications(response.data.verifications);
      setVerifications(mockVerifications);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      toast.error('Failed to fetch verification requests');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewVerification = (verification) => {
    setSelectedVerification(verification);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVerification(null);
  };

  const handleVerification = async (status) => {
    try {
      // await axiosPrivate.put(`/verifications/${selectedVerification._id}`, { status });
      // For testing, update mock data
      setVerifications(verifications.map(v => 
        v._id === selectedVerification._id ? { ...v, status } : v
      ));
      toast.success(`Verification ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Verification Requests</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {verifications.map((verification) => (
              <TableRow key={verification._id}>
                <TableCell>{verification.userName}</TableCell>
                <TableCell>
                  {new Date(verification.submittedAt).toLocaleString()}
                </TableCell>
                <TableCell>{verification.reason}</TableCell>
                <TableCell>
                  <Chip
                    label={verification.status}
                    color={
                      verification.status === 'approved' ? 'success' :
                      verification.status === 'rejected' ? 'error' : 'warning'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View">
                    <IconButton onClick={() => handleViewVerification(verification)}>
                      <ViewIcon />
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
          count={verifications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Verification Request</DialogTitle>
        <DialogContent>
          {selectedVerification && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6">{selectedVerification.userName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Verification Photo</Typography>
                <Box
                  component="img"
                  src={selectedVerification.photo}
                  alt="Verification"
                  sx={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    mt: 1
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Reason</Typography>
                <Typography>{selectedVerification.reason}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Submitted At</Typography>
                <Typography>
                  {new Date(selectedVerification.submittedAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedVerification?.status === 'pending' && (
            <>
              <Button
                onClick={() => handleVerification('rejected')}
                color="error"
                startIcon={<RejectIcon />}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleVerification('approved')}
                color="success"
                startIcon={<VerifyIcon />}
                variant="contained"
              >
                Verify
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Verification; 