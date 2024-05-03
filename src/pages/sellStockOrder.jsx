import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSellStocks, fetchSellStockById, deleteSellStock, updateSellStock, addSellStock, setSelectedSellStock } from '../redux/slice/sellStockSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, TablePagination, TableSortLabel, Button, Modal, FormControl, InputLabel, Input, FormHelperText, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { FiEye, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';
 
const SellStocks = () => {

  const dispatch = useDispatch();
  const [selectedSellStock, setSelectedSellStockState] = useState({
    symbol: '',
    currentPrice: '',
    marketCap: '',
    dividendYield: '',
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
  const sellStocks = useSelector((state) => state.sellStocks.sellStocks);
  const selectedSellStockState = useSelector((state) => state.sellStocks.selectedSellStock);
  const status = useSelector((state) => state.sellStocks.status);
  const error = useSelector((state) => state.sellStocks.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSellStocks());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedSellStockState) {
      setSelectedSellStockState(selectedSellStockState);
      setEditMode(false);
    }
  }, [selectedSellStockState]);

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setSelectedSellStockState(id);
  };

  const confirmDelete = () => {
    dispatch(deleteSellStock(selectedSellStock));
    setDeleteDialogOpen(false);
  };

  const handleEdit = (sellStock) => {
    dispatch(setSelectedSellStock(sellStock));
    setEditMode(true);
  };

  const handleSave = () => {
    dispatch(updateSellStock(selectedSellStock));
    setEditMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('SellStock updated successfully');
  };

  const handleCancel = () => {
    setEditMode(false);
    dispatch(setSelectedSellStock(null));
  };

  const handleViewDetail = (id) => {
    dispatch(fetchSellStockById(id));
    setViewDetailModalOpen(true);
  };

  const handleRegister = () => {
    setRegistrationMode(true);
  };

  const handleRegisterSave = () => {
    dispatch(addSellStock(selectedSellStock));
    setRegistrationMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('SellStock registered successfully');
  };

  const handleRegisterCancel = () => {
    setRegistrationMode(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page to first page when searching
  };

  const sortSellStocks = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(columnId);
  };

  const filteredSellStocks = sellStocks.filter(sellStock =>
    sellStock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sellStock.currentPrice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSellStocks = filteredSellStocks.slice().sort((a, b) => {
    if (sortColumn === 'symbol') {
      return sortDirection === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
    } else if (sortColumn === 'currentPrice') {
      return sortDirection === 'asc' ? a.currentPrice.localeCompare(b.currentPrice) : b.currentPrice.localeCompare(a.currentPrice);
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
      <h1>SellStock List</h1>
      <Button variant="contained" onClick={handleRegister}>Register New SellStock</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'symbol'}
                  direction={sortDirection}
                  onClick={() => sortSellStocks('symbol')}
                >
                  Symbol
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'currentPrice'}
                  direction={sortDirection}
                  onClick={() => sortSellStocks('currentPrice')}
                >
                  CurrentPrice
                </TableSortLabel>
                
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'marketCap'}
                  direction={sortDirection}
                  onClick={() => sortSellStocks('marketCap')}
                >
                  MarketCap
                </TableSortLabel>
                
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'dividendYield'}
                  direction={sortDirection}
                  onClick={() => sortSellStocks('dividendYield')}
                >
                  dividendYield
                </TableSortLabel>
                
              </TableCell>
              
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSellStocks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((sellStock) => (
                <TableRow key={sellStock.id}>
                  <TableCell>{sellStock.symbol}</TableCell>
                  <TableCell>{sellStock.currentPrice}</TableCell>
                  <TableCell>{sellStock.marketCap}</TableCell>
                  <TableCell>{sellStock.dividendYield}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(sellStock)}>
                      <Tooltip title="Edit">
                        <FiEye />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(sellStock.id)}>
                      <Tooltip title="Delete">
                        <FiTrash />
                      </Tooltip>
                    </IconButton>
                    <Button onClick={() => handleViewDetail(sellStock.id)}>View Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredSellStocks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={editMode || registrationMode}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', margin: 'auto' }}>
          {editMode && (
            <div>
              <h2>Edit SellStock</h2>
              <TextField
                label="Symbol"
                value={selectedSellStock.symbol}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, symbol: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="CurrentPrice"
                value={selectedSellStock.currentPrice}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, currentPrice: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="marcketCap"
                value={selectedSellStock.marketCap}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, marketCap: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="dividendYield"
                value={selectedSellStock.dividendYield}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, dividendYield: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedSellStock.description}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, description: e.target.value })}
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
              <h2>Add SellStock</h2>
              <TextField
                label="SellStock Symbol"
                value={selectedSellStock.symbol}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, symbol: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="SellStock CurrentPrice"
                value={selectedSellStock.currentPrice}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, currentPrice: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="marcketCap"
                value={selectedSellStock.marketCap}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, marketCap: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="dividendYield"
                value={selectedSellStock.dividendYield}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, dividendYield: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedSellStock.description}
                onChange={(e) => setSelectedSellStockState({ ...selectedSellStock, description: e.target.value })}
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
        <DialogTitle>Delete SellStock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this sellStock?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDetailModalOpen} onClose={() => setViewDetailModalOpen(false)}>
        <DialogTitle>SellStock Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>Symbol: {selectedSellStockState?.symbol}</p>
            <p>CurrentPrice: {selectedSellStockState?.currentPrice}</p>
            <p>marcketCap: {selectedSellStockState?.marketCap}</p>
            <p>dividendYield: {selectedSellStockState?.dividendYield}</p>
            <p>Description: {selectedSellStockState?.description}</p>
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

export default SellStocks;
