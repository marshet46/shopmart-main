import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDeposits, fetchDepositById, deleteDeposit, updateDeposit, addDeposit, setSelectedDeposit } from '../redux/slice/depositSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, TablePagination, TableSortLabel, Button, Modal, FormControl, InputLabel, Input, FormHelperText, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar,MenuItem, Select } from '@mui/material';
import { FiEye, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';


const Deposits = () => {

  const dispatch = useDispatch();
  const [selectedDeposit, setSelectedDepositState] = useState({
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
  const deposits = useSelector((state) => state.deposits.deposits);
  const selectedDepositState = useSelector((state) => state.deposits.selectedDeposit);
  const status = useSelector((state) => state.deposits.status);
  const error = useSelector((state) => state.deposits.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDeposits());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedDepositState) {
      setSelectedDepositState(selectedDepositState);
      setEditMode(false);
    }
  }, [selectedDepositState]);

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setSelectedDepositState(id);
  };

  const confirmDelete = () => {
    dispatch(deleteDeposit(selectedDeposit));
    setDeleteDialogOpen(false);
  };

  const handleEdit = (deposit) => {
    dispatch(setSelectedDeposit(deposit));
    setEditMode(true);
  };

  const handleSave = () => {
    dispatch(updateDeposit(selectedDeposit));
    setEditMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Deposit updated successfully');
  };

  const handleCancel = () => {
    setEditMode(false);
    dispatch(setSelectedDeposit(null));
  };

  const handleViewDetail = (id) => {
    dispatch(fetchDepositById(id));
    setViewDetailModalOpen(true);
  };

  const handleRegister = () => {
    setRegistrationMode(true);
  };

  const handleRegisterSave = () => {
    dispatch(addDeposit(selectedDeposit));
    setRegistrationMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Deposit registered successfully');
  };

  const handleRegisterCancel = () => {
    setRegistrationMode(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page to first page when searching
  };

  const sortDeposits = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(columnId);
  };

  const filteredDeposits = deposits.filter(deposit =>
  
    deposit.bankName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDeposits = filteredDeposits.slice().sort((a, b) => {
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
      <h1>Deposit orders</h1>
      <Button variant="contained" onClick={handleRegister}>add New Deposit</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'amount'}
                  direction={sortDirection}
                  onClick={() => sortDeposits('amount')}
                >
                  amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'bankName'}
                  direction={sortDirection}
                  onClick={() => sortDeposits('bankName')}
                >
                  bank name
                </TableSortLabel>
                
              </TableCell>
              <TableCell>Name</TableCell>
    <TableCell>Phone</TableCell>

            
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'status'}
                  direction={sortDirection}
                  onClick={() => sortDeposits('status')}
                >
                  status
                </TableSortLabel>
                
              </TableCell>
              
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDeposits
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>{deposit.amount}</TableCell>
                  <TableCell>{deposit.bankName}</TableCell>
                  <TableCell>{deposit.User.name}</TableCell>
                  <TableCell>{deposit.User.phone}</TableCell>
                  <TableCell>{deposit.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(deposit)}>
                      <Tooltip title="Edit">
                        <FiEye />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(deposit.id)}>
                      <Tooltip title="Delete">
                        <FiTrash />
                      </Tooltip>
                    </IconButton>
                    <Button onClick={() => handleViewDetail(deposit.id)}>View Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredDeposits.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={editMode || registrationMode}>
        <div style={{ backgroundColor: 'white', padding: '20px', bdepositRadius: '10px', width: '400px', margin: 'auto' }}>
          {editMode && (
            <div>
              <h2>Edit Deposit</h2>
              <TextField
                label="Amount"
                value={selectedDeposit.amount}
                onChange={(e) => setSelectedDepositState({ ...selectedDeposit, amount: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="bank Name"
                value={selectedDeposit.bankName}
                onChange={(e) => setSelectedDepositState({ ...selectedDeposit, bankName: e.target.value })}
                fullWidth
                margin="normal"
              />
              
              <FormControl fullWidth margin="normal">
  <InputLabel id="status-label">Status</InputLabel>
  <Select
    labelId="status-label"
    id="status"
    value={selectedDeposit.status}
    onChange={(e) => setSelectedDepositState({ ...selectedDeposit, status: e.target.value })}
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
              <h2>Add New Deposit</h2>
              <TextField
                label="Deposit Symbol"
                value={selectedDeposit.amount}
                onChange={(e) => setSelectedDepositState({ ...selectedDeposit, amount: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Deposit CurrentPrice"
                value={selectedDeposit.bankName}
                onChange={(e) => setSelectedDepositState({ ...selectedDeposit, bankName: e.target.value })}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="status"
                value={selectedDeposit.status}
                onChange={(e) => setSelectedDepositState({ ...selectedDeposit, status: e.target.value })}
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
        <DialogTitle>Delete Deposit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this deposit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
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

export default Deposits;
