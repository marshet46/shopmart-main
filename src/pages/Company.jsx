import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCompanies, fetchCompanyById, deleteCompany, updateCompany, addCompany, setSelectedCompany } from '../redux/slice/companySlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, TablePagination, TableSortLabel, Button, Modal, FormControl, InputLabel, Input, FormHelperText, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { FiEye, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CompanyList = () => {

  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompanyState] = useState({
    name: '',
    ticker: '',
    sector: '',
    industry: '',
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
  const companies = useSelector((state) => state.companies.companies);
  const selectedCompanyState = useSelector((state) => state.companies.selectedCompany);
  const status = useSelector((state) => state.companies.status);
  const error = useSelector((state) => state.companies.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCompanies());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedCompanyState) {
      setSelectedCompanyState(selectedCompanyState);
      setEditMode(false);
    }
  }, [selectedCompanyState]);

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setSelectedCompanyState(id);
  };

  const confirmDelete = () => {
    dispatch(deleteCompany(selectedCompany));
    setDeleteDialogOpen(false);
  };

  const handleEdit = (company) => {
    dispatch(setSelectedCompany(company));
    setEditMode(true);
  };

  const handleSave = () => {
    dispatch(updateCompany(selectedCompany));
    setEditMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Company updated successfully');
  };

  const handleCancel = () => {
    setEditMode(false);
    dispatch(setSelectedCompany(null));
  };

  const handleViewDetail = (id) => {
    dispatch(fetchCompanyById(id));
    setViewDetailModalOpen(true);
  };

  const handleRegister = () => {
    setRegistrationMode(true);
  };

  const handleRegisterSave = () => {
    dispatch(addCompany(selectedCompany));
    setRegistrationMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('Company registered successfully');
  };

  const handleRegisterCancel = () => {
    setRegistrationMode(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page to first page when searching
  };

  const sortCompanies = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(columnId);
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCompanies = filteredCompanies.slice().sort((a, b) => {
    if (sortColumn === 'name') {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortColumn === 'ticker') {
      return sortDirection === 'asc' ? a.ticker.localeCompare(b.ticker) : b.ticker.localeCompare(a.ticker);
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
      <h1>Company List</h1>
      <Button variant="contained" onClick={handleRegister}>Register New Company</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'name'}
                  direction={sortDirection}
                  onClick={() => sortCompanies('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'ticker'}
                  direction={sortDirection}
                  onClick={() => sortCompanies('ticker')}
                >
                  Ticker
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCompanies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.ticker}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(company)}>
                      <Tooltip title="Edit">
                        <FiEye />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(company.id)}>
                      <Tooltip title="Delete">
                        <FiTrash />
                      </Tooltip>
                    </IconButton>
                    <Button onClick={() => handleViewDetail(company.id)}>View Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCompanies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={editMode || registrationMode}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', margin: 'auto' }}>
          {editMode && (
            <div>
              <h2>Edit Company</h2>
              <TextField
                label="Name"
                value={selectedCompany.name}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Ticker"
                value={selectedCompany.ticker}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, ticker: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Sector"
                value={selectedCompany.sector}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, sector: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Industry"
                value={selectedCompany.industry}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, industry: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedCompany.description}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, description: e.target.value })}
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
              <h2>Add Company</h2>
              <TextField
                label="Company Name"
                value={selectedCompany.name}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Company Ticker"
                value={selectedCompany.ticker}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, ticker: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Sector"
                value={selectedCompany.sector}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, sector: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Industry"
                value={selectedCompany.industry}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, industry: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedCompany.description}
                onChange={(e) => setSelectedCompanyState({ ...selectedCompany, description: e.target.value })}
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
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this company?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDetailModalOpen} onClose={() => setViewDetailModalOpen(false)}>
        <DialogTitle>Company Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>Name: {selectedCompanyState?.name}</p>
            <p>Ticker: {selectedCompanyState?.ticker}</p>
            <p>Sector: {selectedCompanyState?.sector}</p>
            <p>Industry: {selectedCompanyState?.industry}</p>
            <p>Description: {selectedCompanyState?.description}</p>
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

export default CompanyList;
