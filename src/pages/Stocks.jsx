import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStocks, fetchStockById, deleteStock, updateStock, addStock, setSelectedStock } from '../redux/slice/stockSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, TablePagination, TableSortLabel, Button, Modal, FormControl, InputLabel, Input, FormHelperText, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { FiEye, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';
 
const Stocks = () => {

  const dispatch = useDispatch();
  const [selectedStock, setSelectedStockState] = useState({
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
  const stocks = useSelector((state) => state.stocks.stocks);
  const selectedStockState = useSelector((state) => state.stocks.selectedStock);
  const status = useSelector((state) => state.stocks.status);
  const error = useSelector((state) => state.stocks.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchStocks());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedStockState) {
      setSelectedStockState(selectedStockState);
      setEditMode(false);
    }
  }, [selectedStockState]);

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setSelectedStockState(id);
  };

  const confirmDelete = () => {
    dispatch(deleteStock(selectedStock));
    setDeleteDialogOpen(false);
  };

  const handleEdit = (stock) => {
    dispatch(setSelectedStock(stock));
    setEditMode(true);
  };

  const handleSave = () => {
    dispatch(updateStock(selectedStock));
    setEditMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Stock updated successfully');
  };

  const handleCancel = () => {
    setEditMode(false);
    dispatch(setSelectedStock(null));
  };

  const handleViewDetail = (id) => {
    dispatch(fetchStockById(id));
    setViewDetailModalOpen(true);
  };

  const handleRegister = () => {
    setRegistrationMode(true);
  };

  const handleRegisterSave = () => {
    dispatch(addStock(selectedStock));
    setRegistrationMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Stock registered successfully');
  };

  const handleRegisterCancel = () => {
    setRegistrationMode(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page to first page when searching
  };

  const sortStocks = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(columnId);
  };

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.currentPrice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStocks = filteredStocks.slice().sort((a, b) => {
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
      <h1>Stock List</h1>
      <Button variant="contained" onClick={handleRegister}>Register New Stock</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'symbol'}
                  direction={sortDirection}
                  onClick={() => sortStocks('symbol')}
                >
                  Symbol
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'currentPrice'}
                  direction={sortDirection}
                  onClick={() => sortStocks('currentPrice')}
                >
                  CurrentPrice
                </TableSortLabel>
                
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'marketCap'}
                  direction={sortDirection}
                  onClick={() => sortStocks('marketCap')}
                >
                  Capital
                </TableSortLabel>
                
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'dividendYield'}
                  direction={sortDirection}
                  onClick={() => sortStocks('dividendYield')}
                >
                  Share earning
                </TableSortLabel>
                
              </TableCell>
              
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStocks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell>{stock.symbol}</TableCell>
                  <TableCell>{stock.currentPrice}</TableCell>
                  <TableCell>{stock.marketCap}</TableCell>
                  <TableCell>{stock.dividendYield}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(stock)}>
                      <Tooltip title="Edit">
                        <FiEye />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(stock.id)}>
                      <Tooltip title="Delete">
                        <FiTrash />
                      </Tooltip>
                    </IconButton>
                    <Button onClick={() => handleViewDetail(stock.id)}>View Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredStocks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={editMode || registrationMode}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', margin: 'auto' }}>
          {editMode && (
            <div>
              <h2>Edit Stock</h2>
              <TextField
                label="Symbol"
                value={selectedStock.symbol}
                onChange={(e) => setSelectedStockState({ ...selectedStock, symbol: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="CurrentPrice"
                value={selectedStock.currentPrice}
                onChange={(e) => setSelectedStockState({ ...selectedStock, currentPrice: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="marcketCap"
                value={selectedStock.marketCap}
                onChange={(e) => setSelectedStockState({ ...selectedStock, marketCap: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="dividendYield"
                value={selectedStock.dividendYield}
                onChange={(e) => setSelectedStockState({ ...selectedStock, dividendYield: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedStock.description}
                onChange={(e) => setSelectedStockState({ ...selectedStock, description: e.target.value })}
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
              <h2>Add Stock</h2>
              <TextField
                label="Stock Symbol"
                value={selectedStock.symbol}
                onChange={(e) => setSelectedStockState({ ...selectedStock, symbol: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Stock CurrentPrice"
                value={selectedStock.currentPrice}
                onChange={(e) => setSelectedStockState({ ...selectedStock, currentPrice: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="marcketCap"
                value={selectedStock.marketCap}
                onChange={(e) => setSelectedStockState({ ...selectedStock, marketCap: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="dividendYield"
                value={selectedStock.dividendYield}
                onChange={(e) => setSelectedStockState({ ...selectedStock, dividendYield: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedStock.description}
                onChange={(e) => setSelectedStockState({ ...selectedStock, description: e.target.value })}
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
        <DialogTitle>Delete Stock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this stock?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDetailModalOpen} onClose={() => setViewDetailModalOpen(false)}>
        <DialogTitle>Stock Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>Symbol: {selectedStockState?.symbol}</p>
            <p>CurrentPrice: {selectedStockState?.currentPrice}</p>
            <p>marcketCap: {selectedStockState?.marketCap}</p>
            <p>dividendYield: {selectedStockState?.dividendYield}</p>
            <p>Description: {selectedStockState?.description}</p>
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

export default Stocks;
