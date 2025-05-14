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
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Divider
} from '@mui/material';
import {
    Visibility as ViewIcon,
    Send as SendIcon,
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { axiosPrivate } from '../axios';
import { io } from 'socket.io-client';

const Support = () => {
    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all'
    });

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io('/support', {
            path: '/socket.io',
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Connected to support socket');
        });

        newSocket.on('admin_notification', (data) => {
            if (data.type === 'new_ticket' || data.type === 'new_message') {
                fetchTickets();
                toast.success('New support activity!');
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [page, rowsPerPage, filters]);

    const fetchTickets = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: page + 1,
                limit: rowsPerPage,
                ...(filters.status !== 'all' && { status: filters.status }),
                ...(filters.priority !== 'all' && { priority: filters.priority })
            });

            const response = await axiosPrivate.get(`/support?${queryParams}`);
            setTickets(response.data.tickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to fetch tickets');
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewTicket = async (ticket) => {
        try {
            const response = await axiosPrivate.get(`/support/${ticket._id}`);
            setSelectedTicket(response.data);
            setOpenDialog(true);

            // Join ticket room
            if (socket) {
                socket.emit('join_ticket', ticket._id);
            }
        } catch (error) {
            console.error('Error fetching ticket details:', error);
            toast.error('Failed to fetch ticket details');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTicket(null);
        setNewMessage('');

        // Leave ticket room
        if (socket && selectedTicket) {
            socket.emit('leave_ticket', selectedTicket._id);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            toast.error('Please enter a message');
            return;
        }

        try {
            const response = await axiosPrivate.post(`/support/${selectedTicket._id}/messages`, {
                content: newMessage
            });

            // Emit socket event
            if (socket) {
                socket.emit('new_message', {
                    ticketId: selectedTicket._id,
                    content: newMessage,
                    userId: response.data.user,
                    isAdmin: true
                });
            }

            setSelectedTicket(response.data);
            setNewMessage('');
            toast.success('Message sent successfully');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            const response = await axiosPrivate.patch(`/support/${selectedTicket._id}/status`, {
                status
            });

            // Emit socket event
            if (socket) {
                socket.emit('update_status', {
                    ticketId: selectedTicket._id,
                    status
                });
            }

            setSelectedTicket(response.data);
            toast.success('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleUpdatePriority = async (priority) => {
        try {
            const response = await axiosPrivate.patch(`/support/${selectedTicket._id}/priority`, {
                priority
            });

            // Emit socket event
            if (socket) {
                socket.emit('update_priority', {
                    ticketId: selectedTicket._id,
                    priority
                });
            }

            setSelectedTicket(response.data);
            toast.success('Priority updated successfully');
        } catch (error) {
            console.error('Error updating priority:', error);
            toast.error('Failed to update priority');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'warning';
            case 'in_progress':
                return 'info';
            case 'closed':
                return 'success';
            default:
                return 'default';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high':
                return <ErrorIcon color="error" />;
            case 'medium':
                return <WarningIcon color="warning" />;
            case 'low':
                return <CheckCircleIcon color="success" />;
            default:
                return null;
        }
    };

    return (
        <Box sx={{ width: '100%', height: '100%', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Support Tickets</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filters.status}
                            label="Status"
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="closed">Closed</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={filters.priority}
                            label="Priority"
                            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Priority</TableCell>
                            <TableCell>Last Updated</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket._id}>
                                <TableCell>{ticket.user?.name || 'Unknown User'}</TableCell>
                                <TableCell>{ticket.subject}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={ticket.status}
                                        color={getStatusColor(ticket.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {getPriorityIcon(ticket.priority)}
                                        <Typography variant="body2">
                                            {ticket.priority}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {new Date(ticket.updatedAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleViewTicket(ticket)}
                                        size="small"
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tickets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Ticket Details Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedTicket && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">
                                    Ticket #{selectedTicket._id}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={selectedTicket.status}
                                            label="Status"
                                            onChange={(e) => handleUpdateStatus(e.target.value)}
                                        >
                                            <MenuItem value="open">Open</MenuItem>
                                            <MenuItem value="in_progress">In Progress</MenuItem>
                                            <MenuItem value="closed">Closed</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Priority</InputLabel>
                                        <Select
                                            value={selectedTicket.priority}
                                            label="Priority"
                                            onChange={(e) => handleUpdatePriority(e.target.value)}
                                        >
                                            <MenuItem value="high">High</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="low">Low</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Subject: {selectedTicket.subject}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    From: {selectedTicket.user?.name || 'Unknown User'}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
                                {selectedTicket.messages.map((message, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: message.isAdmin ? 'flex-end' : 'flex-start',
                                            mb: 2
                                        }}
                                    >
                                        <Paper
                                            sx={{
                                                p: 2,
                                                maxWidth: '70%',
                                                bgcolor: message.isAdmin ? 'primary.light' : 'grey.100'
                                            }}
                                        >
                                            <Typography variant="body1">
                                                {message.content}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(message.createdAt).toLocaleString()}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                >
                                    Send
                                </Button>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default Support;
