import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, fetchUserById, deleteUser, updateUser, addUser, setSelectedUser } from '../redux/slice/userSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, TablePagination, TableSortLabel, Button, Modal, FormControl, InputLabel, Input, FormHelperText, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { FiEye, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';
 
const Users = () => {

  const dispatch = useDispatch();
  const [selectedUser, setSelectedUserState] = useState({
    name: '',
    phone: '',
    email: '',
    addressRegion: '',
    occupation: ''
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
  const users = useSelector((state) => state.users.users);
  const selectedUserState = useSelector((state) => state.users.selectedUser);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedUserState) {
      setSelectedUserState(selectedUserState);
      setEditMode(false);
    }
  }, [selectedUserState]);

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setSelectedUserState(id);
  };

  const confirmDelete = () => {
    dispatch(deleteUser(selectedUser));
    setDeleteDialogOpen(false);
  };

  const handleEdit = (user) => {
    dispatch(setSelectedUser(user));
    setEditMode(true);
  };

  const handleSave = () => {
    dispatch(updateUser(selectedUser));
    setEditMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('User updated successfully');
  };

  const handleCancel = () => {
    setEditMode(false);
    dispatch(setSelectedUser(null));
  };

  const handleViewDetail = (id) => {
    dispatch(fetchUserById(id));
    setViewDetailModalOpen(true);
  };

  const handleRegister = () => {
    setRegistrationMode(true);
  };

  const handleRegisterSave = () => {
    dispatch(addUser(selectedUser));
    setRegistrationMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('User registered successfully');
  };

  const handleRegisterCancel = () => {
    setRegistrationMode(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page to first page when searching
  };

  const sortUsers = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(columnId);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = filteredUsers.slice().sort((a, b) => {
    if (sortColumn === 'name') {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortColumn === 'phone') {
      return sortDirection === 'asc' ? a.phone.localeCompare(b.phone) : b.phone.localeCompare(a.phone);
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
 
    return  <div style={{ padding: '100px',color:'red' }}>
    <div style={{alignContent:'center',fontSize:'100px'}}>Loading... please wait!</div>;
</div>
  }

  if (status === 'failed') {
   return  <div style={{ padding: '100px',color:'red' }}>
    <div style={{alignContent:'center',fontSize:'100px'}}>failed to load reload again</div>;
</div>

  }

  return (
    <div>
      <h1>User List</h1>
      <Button variant="contained" onClick={handleRegister}>Register New User</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'name'}
                  direction={sortDirection}
                  onClick={() => sortUsers('name')}
                >
                  name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'phone'}
                  direction={sortDirection}
                  onClick={() => sortUsers('phone')}
                >
                  phone
                </TableSortLabel>
                
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'email'}
                  direction={sortDirection}
                  onClick={() => sortUsers('email')}
                >
                  email
                </TableSortLabel>
                
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'addressRegion'}
                  direction={sortDirection}
                  onClick={() => sortUsers('addressRegion')}
                >
                  addressRegion
                </TableSortLabel>
                
              </TableCell>
              
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.addressRegion}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)}>
                      <Tooltip title="Edit">
                        <FiEye />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.id)}>
                      <Tooltip title="Delete">
                        <FiTrash />
                      </Tooltip>
                    </IconButton>
                    <Button onClick={() => handleViewDetail(user.id)}>View Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={editMode || registrationMode}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', margin: 'auto' }}>
          {editMode && (
            <div>
              <h2>Edit User</h2>
              <TextField
                label="name"
                value={selectedUser.name}
                onChange={(e) => setSelectedUserState({ ...selectedUser, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="phone"
                value={selectedUser.phone}
                onChange={(e) => setSelectedUserState({ ...selectedUser, phone: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="marcketCap"
                value={selectedUser.email}
                onChange={(e) => setSelectedUserState({ ...selectedUser, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="addressRegion"
                value={selectedUser.addressRegion}
                onChange={(e) => setSelectedUserState({ ...selectedUser, addressRegion: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedUser.occupation}
                onChange={(e) => setSelectedUserState({ ...selectedUser, occupation: e.target.value })}
                fullWidth
                margin="normal"
                multiline
              />
              <Button onClick={handleSave} variant="contained" color="primary" style={{ marginRight: '10px' }}>Save</Button>
              <Button onClick={handleCancel} variant="contained" color="secondary">Cancel</Button>
            </div>
          )}
          {registrationMode && (
            <div>
              <h2>Add User</h2>
              <TextField
                label="User name"
                value={selectedUser.name}
                onChange={(e) => setSelectedUserState({ ...selectedUser, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="User phone"
                value={selectedUser.phone}
                onChange={(e) => setSelectedUserState({ ...selectedUser, phone: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="marcketCap"
                value={selectedUser.email}
                onChange={(e) => setSelectedUserState({ ...selectedUser, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="addressRegion"
                value={selectedUser.addressRegion}
                onChange={(e) => setSelectedUserState({ ...selectedUser, addressRegion: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedUser.occupation}
                onChange={(e) => setSelectedUserState({ ...selectedUser, occupation: e.target.value })}
                fullWidth
                margin="normal"
                multiline
              />
              <Button onClick={handleRegisterSave} variant="contained" color="primary" style={{ marginRight: '10px' }}>Save</Button>
              <Button onClick={handleRegisterCancel} variant="contained" color="secondary">Cancel</Button>
            </div>
          )}
        </div>
      </Modal>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDetailModalOpen} onClose={() => setViewDetailModalOpen(false)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>name: {selectedUserState?.name}</p>
            <p>phone: {selectedUserState?.phone}</p>
            <p>marcketCap: {selectedUserState?.email}</p>
            <p>addressRegion: {selectedUserState?.addressRegion}</p>
            <p>Description: {selectedUserState?.occupation}</p>
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

export default Users;
