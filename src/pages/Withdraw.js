import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWithdraws, fetchWithdrawById, deleteWithdraw, updateWithdraw, addWithdraw, setSelectedWithdraw } from '../redux/slice/withdrawSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, TablePagination, TableSortLabel, Button, Modal, FormControl, InputLabel, Input, FormHelperText, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar,MenuItem, Select } from '@mui/material';
import { FiEye, FiTrash } from 'react-icons/fi';

import { Link } from 'react-router-dom';
 
const Withdraws = () => {

  const dispatch = useDispatch();
  const [selectedWithdraw, setSelectedWithdrawState] = useState({
    amount: '',
    bankName: '',
    status: '',

  });
  const [editMode, setEditMode] = useState(false);
  const [registrationMode, setRegistrationMode] = useState(false);
  const [viewDetailModalOpen, setViewDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortColumn, setSortColumn] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const withdraws = useSelector((state) => state.withdraws.withdraws);
  const selectedWithdrawState = useSelector((state) => state.withdraws.selectedWithdraw);
  const status = useSelector((state) => state.withdraws.status);
  const error = useSelector((state) => state.withdraws.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWithdraws());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedWithdrawState) {
      setSelectedWithdrawState(selectedWithdrawState);
      setEditMode(false);
    }
  }, [selectedWithdrawState]);

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setSelectedWithdrawState(id);
  };

  const confirmDelete = () => {
    dispatch(deleteWithdraw(selectedWithdraw));
    setDeleteDialogOpen(false);
  };

  const handleEdit = (withdraw) => {
    dispatch(setSelectedWithdraw(withdraw));
    setEditMode(true);
  };

  const handleSave = () => {
    dispatch(updateWithdraw(selectedWithdraw));
    setEditMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Withdraw updated successfully');
  };

  const handleCancel = () => {
    setEditMode(false);
    dispatch(setSelectedWithdraw(null));
  };

  const handleViewDetail = (id) => {
    dispatch(fetchWithdrawById(id));
    setViewDetailModalOpen(true);
  };

  const handleRegister = () => {
    setRegistrationMode(true);
  };

  const handleRegisterSave = () => {
    dispatch(addWithdraw(selectedWithdraw));
    setRegistrationMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Withdraw registered successfully');
  };

  const handleRegisterCancel = () => {
    setRegistrationMode(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page to first page when searching
  };

  const sortWithdraws = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(columnId);
  };

  const filteredWithdraws = withdraws.filter(withdraw =>

    withdraw.bankName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedWithdraws = filteredWithdraws.slice().sort((a, b) => {
    if (sortColumn === 'amount') {
      return sortDirection === 'asc' ? a.amount.localeCompare(b.amount) : b.amount.localeCompare(a.amount);
    } else if (sortColumn === 'bankName') {
      return sortDirection === 'asc' ? a.bankName.localeCompare(b.bankName) : b.bankName.localeCompare(a.bankName);
    }
    return 0;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Withdraw List</h1>
      <Button variant="contained" onClick={handleRegister}>Register New Withdraw</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'amount'}
                  direction={sortDirection}
                  onClick={() => sortWithdraws('amount')}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'bankName'}
                  direction={sortDirection}
                  onClick={() => sortWithdraws('bankName')}
                >
                  BankName
                </TableSortLabel>
                
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'status'}
                  direction={sortDirection}
                  onClick={() => sortWithdraws('status')}
                >
                  Status
                </TableSortLabel>
                
              </TableCell>
              
              
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedWithdraws
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((withdraw) => (
                <TableRow key={withdraw.id}>
                  <TableCell>{withdraw.amount}</TableCell>
                  <TableCell>{withdraw.bankName}</TableCell>
                  <TableCell>{withdraw.status}</TableCell>
         
                  <TableCell>
                    <IconButton onClick={() => handleEdit(withdraw)}>
                      <Tooltip title="Edit">
                        <FiEye />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(withdraw.id)}>
                      <Tooltip title="Delete">
                        <FiTrash />
                      </Tooltip>
                    </IconButton>
                    <Button onClick={() => handleViewDetail(withdraw.id)}>View Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredWithdraws.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={editMode || registrationMode}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', margin: 'auto' }}>
          {editMode && (
            <div>
              <h2>Edit Withdraw</h2>
              <TextField
                label="Amount"
                value={selectedWithdraw.amount}
                onChange={(e) => setSelectedWithdrawState({ ...selectedWithdraw, amount: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="BankName"
                value={selectedWithdraw.bankName}
                onChange={(e) => setSelectedWithdrawState({ ...selectedWithdraw, bankName: e.target.value })}
                fullWidth
                margin="normal"
              />
            <FormControl fullWidth margin="normal">
  <InputLabel id="status-label">Status</InputLabel>
  <Select
    labelId="status-label"
    id="status"
    value={selectedWithdraw.status}
    onChange={(e) => setSelectedWithdrawState({ ...selectedWithdraw, status: e.target.value })}
    label="Status"
  >
    <MenuItem value="approved">Approved</MenuItem>
    <MenuItem value="rejected">Rejected</MenuItem>
    <MenuItem value="pending">pending</MenuItem>
  </Select>
</FormControl>
              
            
              <Button onClick={handleSave} variant="contained" color="primary" style={{ marginRight: '10px' }}>Save</Button>
              <Button onClick={handleCancel} variant="contained" color="secondary">Cancel</Button>
            </div>
          )}
          {registrationMode && (
            <div>
              <h2>Register New Withdraw</h2>
              <TextField
                label="Withdraw Amount"
                value={selectedWithdraw.amount}
                onChange={(e) => setSelectedWithdrawState({ ...selectedWithdraw, amount: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Withdraw BankName"
                value={selectedWithdraw.bankName}
                onChange={(e) => setSelectedWithdrawState({ ...selectedWithdraw, bankName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="marcketCap"
                value={selectedWithdraw.status}
                onChange={(e) => setSelectedWithdrawState({ ...selectedWithdraw, status: e.target.value })}
                fullWidth
                margin="normal"
              />
    
              <Button onClick={handleRegisterSave} variant="contained" color="primary" style={{ marginRight: '10px' }}>Save</Button>
              <Button onClick={handleRegisterCancel} variant="contained" color="secondary">Cancel</Button>
            </div>
          )}
        </div>
      </Modal>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Withdraw</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this withdraw?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDetailModalOpen} onClose={() => setViewDetailModalOpen(false)}>
        <DialogTitle>Withdraw Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>Amount: {selectedWithdrawState?.amount}</p>
            <p>BankName: {selectedWithdrawState?.bankName}</p>
            <p>marcketCap: {selectedWithdrawState?.status}</p>
      

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDetailModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  message={snackbarMessage}
  sx={{ width: '500px' }} // Adjust the width to your desired size
/>

    </div>
  );
};

export default Withdraws;
