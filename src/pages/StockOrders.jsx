import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, fetchOrderById, deleteOrder, updateOrder, addOrder, setSelectedOrder } from '../redux/slice/OrderSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, TablePagination, TableSortLabel, Button, Modal, FormControl, InputLabel, Input, FormHelperText, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar,MenuItem, Select } from '@mui/material';
import { FiEye, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';
 
const Orders = () => {

  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrderState] = useState({
    symbol: '',
    price: '',
    quantity: '',
    status: '',
    description: ''
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
  const orders = useSelector((state) => state.orders.orders);
  const selectedOrderState = useSelector((state) => state.orders.selectedOrder);
  const status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrders());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedOrderState) {
      setSelectedOrderState(selectedOrderState);
      setEditMode(false);
    }
  }, [selectedOrderState]);

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setSelectedOrderState(id);
  };

  const confirmDelete = () => {
    dispatch(deleteOrder(selectedOrder));
    setDeleteDialogOpen(false);
  };

  const handleEdit = (order) => {
    dispatch(setSelectedOrder(order));
    setEditMode(true);
  };

  const handleSave = () => {
    dispatch(updateOrder(selectedOrder));
    setEditMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Order updated successfully');
  };

  const handleCancel = () => {
    setEditMode(false);
    dispatch(setSelectedOrder(null));
  };

  const handleViewDetail = (id) => {
    dispatch(fetchOrderById(id));
    setViewDetailModalOpen(true);
  };

  const handleRegister = () => {
    setRegistrationMode(true);
  };

  const handleRegisterSave = () => {
    dispatch(addOrder(selectedOrder));
    setRegistrationMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Order registered successfully');
  };

  const handleRegisterCancel = () => {
    setRegistrationMode(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page to first page when searching
  };

  const sortOrders = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(columnId);
  };

  const filteredOrders = orders.filter(order =>
    order.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.price.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedOrders = filteredOrders.slice().sort((a, b) => {
    if (sortColumn === 'symbol') {
      return sortDirection === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
    } else if (sortColumn === 'price') {
      return sortDirection === 'asc' ? a.price.localeCompare(b.price) : b.price.localeCompare(a.price);
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
      <h1>Order List</h1>
      <Button variant="contained" onClick={handleRegister}>Register New Order</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'symbol'}
                  direction={sortDirection}
                  onClick={() => sortOrders('symbol')}
                >
                  Symbol
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'price'}
                  direction={sortDirection}
                  onClick={() => sortOrders('price')}
                >
                  CurrentPrice
                </TableSortLabel>
                
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'quantity'}
                  direction={sortDirection}
                  onClick={() => sortOrders('quantity')}
                >
                  quantity
                </TableSortLabel>
                
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'status'}
                  direction={sortDirection}
                  onClick={() => sortOrders('status')}
                >
                  status
                </TableSortLabel>
                
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.symbol}</TableCell>
                  <TableCell>{order.price}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.User.name}</TableCell>
                  <TableCell>{order.User.phone}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(order)}>
                      <Tooltip title="Edit">
                        <FiEye />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(order.id)}>
                      <Tooltip title="Delete">
                        <FiTrash />
                      </Tooltip>
                    </IconButton>
                    <Button onClick={() => handleViewDetail(order.id)}>View Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={editMode || registrationMode}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', margin: 'auto' }}>
          {editMode && (
            <div>
              <h2>Edit Order</h2>
              <TextField
                label="Symbol"
                value={selectedOrder.symbol}
                onChange={(e) => setSelectedOrderState({ ...selectedOrder, symbol: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="CurrentPrice"
                value={selectedOrder.price}
                onChange={(e) => setSelectedOrderState({ ...selectedOrder, price: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="quantity"
                value={selectedOrder.quantity}
                onChange={(e) => setSelectedOrderState({ ...selectedOrder, quantity: e.target.value })}
                fullWidth
                margin="normal"
              />
             <FormControl fullWidth margin="normal">
  <InputLabel id="status-label">Status</InputLabel>
  <Select
    labelId="status-label"
    id="status"
    value={selectedOrder.status}
    onChange={(e) => setSelectedOrderState({ ...selectedOrder, status: e.target.value })}
    label="Status"
  >
    <MenuItem value="approved">Approved</MenuItem>
    <MenuItem value="rejected">Rejected</MenuItem>
    <MenuItem value="pending">pending</MenuItem>
  </Select>
</FormControl>
              <TextField
                label="Description"
                value={selectedOrder.description}
                onChange={(e) => setSelectedOrderState({ ...selectedOrder, description: e.target.value })}
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
              <h2>Add New Order</h2>
              <TextField
                label="Order Symbol"
                value={selectedOrder.symbol}
                onChange={(e) => setSelectedOrderState({ ...selectedOrder, symbol: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Order CurrentPrice"
                value={selectedOrder.price}
                onChange={(e) => setSelectedOrderState({ ...selectedOrder, price: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="quantity"
                value={selectedOrder.quantity}
                onChange={(e) => setSelectedOrderState({ ...selectedOrder, quantity: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="status"
                value={selectedOrder.status}
                onChange={(e) => setSelectedOrderState({ ...selectedOrder, status: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedOrder.description}
                onChange={(e) => setSelectedOrderState({ ...selectedOrder, description: e.target.value })}
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
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDetailModalOpen} onClose={() => setViewDetailModalOpen(false)}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>Symbol: {selectedOrderState?.symbol}</p>
            <p>CurrentPrice: {selectedOrderState?.price}</p>
            <p>quantity: {selectedOrderState?.quantity}</p>
            <p>status: {selectedOrderState?.status}</p>
            <p>Description: {selectedOrderState?.description}</p>
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

export default Orders;
