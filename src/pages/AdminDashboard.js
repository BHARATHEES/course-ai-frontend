import React, { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Dialog, DialogTitle,
    DialogContent, List, ListItem, ListItemText, Box, Chip, Divider, IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [selectedUserHistory, setSelectedUserHistory] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Fetch users failed");
        }
    };

    const handleViewUser = async (user) => {
        setCurrentUser(user);
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/user-history/${user._id}`);
            const historyData = await res.json();
            setSelectedUserHistory(historyData);
            setOpen(true);
        } catch (err) {
            console.error("Fetch history failed");
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonIcon sx={{ color: '#64748b' }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    Owner Control Panel
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
                <Table size="small">
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#475569' }}>User</TableCell>
                            <TableCell sx={{ py: 1.5, fontWeight: 700, color: '#475569' }}>Email</TableCell>
                            <TableCell align="center" sx={{ py: 1.5, fontWeight: 700, color: '#475569' }}>Searches</TableCell>
                            <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: '#475569' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell sx={{ py: 1, fontWeight: 600, color: '#1e293b' }}>{u.name}</TableCell>
                                <TableCell sx={{ py: 1, color: '#64748b', fontSize: '0.85rem' }}>{u.email}</TableCell>
                                <TableCell align="center" sx={{ py: 1 }}>
                                    <Chip
                                        label={u.historyCount}
                                        size="small"
                                        sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 700, fontSize: '0.75rem' }}
                                    />
                                </TableCell>
                                <TableCell align="right" sx={{ py: 1 }}>
                                    <Button
                                        size="small"
                                        variant="text"
                                        onClick={() => handleViewUser(u)}
                                        sx={{ textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* User Details Modal - Refined & Compact */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                {currentUser && (
                    <>
                        <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>User Profile</Typography>
                            <IconButton size="small" onClick={() => setOpen(false)}><CloseIcon fontSize="small" /></IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ p: 2, pt: 0 }}>
                            <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, mb: 2, border: '1px solid #e2e8f0' }}>
                                <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, mb: 1 }}>ACCOUNT INFO</Typography>
                                <Stack spacing={0.5}>
                                    <Typography variant="body2"><strong>Name:</strong> {currentUser.name}</Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}><strong>ID:</strong> {currentUser._id}</Typography>
                                    <Typography variant="body2"><strong>Email:</strong> {currentUser.email}</Typography>
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                        <strong>Last Pass Change:</strong> {currentUser.passwordLastChanged ? new Date(currentUser.passwordLastChanged).toLocaleDateString() : 'Never'}
                                    </Typography>
                                </Stack>
                            </Box>

                            <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, mb: 1, ml: 1 }}>RECENT ACTIVITY</Typography>
                            <Paper variant="outlined" sx={{ maxHeight: 250, overflow: 'auto', borderRadius: 2 }}>
                                <List dense disablePadding>
                                    {selectedUserHistory.length > 0 ? (
                                        selectedUserHistory.map((h, idx) => (
                                            <React.Fragment key={h._id}>
                                                <ListItem>
                                                    <ListItemText
                                                        primary={h.searchQuery}
                                                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }}
                                                        secondary={new Date(h.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                        secondaryTypographyProps={{ fontSize: '0.7rem' }}
                                                    />
                                                </ListItem>
                                                {idx < selectedUserHistory.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography variant="caption" color="textSecondary">No history available</Typography>
                                        </Box>
                                    )}
                                </List>
                            </Paper>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Container>
    );
}

// Added Stack import helper if not using MUI Stack directly
const Stack = ({ children, spacing }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>{children}</Box>
);