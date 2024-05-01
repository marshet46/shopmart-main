import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNewss, fetchNewsById, deleteNews, updateNews, addNews, setSelectedNews } from '../redux/slice/newsSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, TextField, TablePagination, TableSortLabel, Button, Modal, FormControl, InputLabel, Input, FormHelperText, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import { FiEye, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';
 
const Newss = () => {

  const dispatch = useDispatch();
  const [selectedNews, setSelectedNewsState] = useState({
    title: '',
    content: '',
    author: '',
    publishedAt: '',
  
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
  const newss = useSelector((state) => state.news.newss);
  const selectedNewsState = useSelector((state) => state.news.selectedNews);
  const status = useSelector((state) => state.news.status);
  const error = useSelector((state) => state.news.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNewss());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (selectedNewsState) {
      setSelectedNewsState(selectedNewsState);
      setEditMode(false);
    }
  }, [selectedNewsState]);

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setSelectedNewsState(id);
  };

  const confirmDelete = () => {
    dispatch(deleteNews(selectedNews));
    setDeleteDialogOpen(false);
  };

  const handleEdit = (news) => {
    dispatch(setSelectedNews(news));
    setEditMode(true);
  };

  const handleSave = () => {
    dispatch(updateNews(selectedNews));
    setEditMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('News updated successfully');
  };

  const handleCancel = () => {
    setEditMode(false);
    dispatch(setSelectedNews(null));
  };

  const handleViewDetail = (id) => {
    dispatch(fetchNewsById(id));
    setViewDetailModalOpen(true);
  };

  const handleRegister = () => {
    setRegistrationMode(true);
  };

  const handleRegisterSave = () => {
    dispatch(addNews(selectedNews));
    setRegistrationMode(false);
    setSnackbarOpen(true);
    setSnackbarMessage('News registered successfully');
  };

  const handleRegisterCancel = () => {
    setRegistrationMode(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset page to first page when searching
  };

  const sortNewss = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(columnId);
  };

  const filteredNewss = newss.filter(news =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedNewss = filteredNewss.slice().sort((a, b) => {
    if (sortColumn === 'title') {
      return sortDirection === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    } else if (sortColumn === 'content') {
      return sortDirection === 'asc' ? a.content.localeCompare(b.content) : b.content.localeCompare(a.content);
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
      <h1>News List</h1>
      <Button variant="contained" onClick={handleRegister}>Register New News</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'title'}
                  direction={sortDirection}
                  onClick={() => sortNewss('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'content'}
                  direction={sortDirection}
                  onClick={() => sortNewss('content')}
                >
                  Content
                </TableSortLabel>
                
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'author'}
                  direction={sortDirection}
                  onClick={() => sortNewss('author')}
                >
                  MarketCap
                </TableSortLabel>
                
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortColumn === 'publishedAt'}
                  direction={sortDirection}
                  onClick={() => sortNewss('publishedAt')}
                >
                  publishedAt
                </TableSortLabel>
                
              </TableCell>
              
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedNewss
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((news) => (
                <TableRow key={news.id}>
                  <TableCell>{news.title}</TableCell>
                  <TableCell>{news.content}</TableCell>
                  <TableCell>{news.author}</TableCell>
                  <TableCell>{news.publishedAt}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(news)}>
                      <Tooltip title="Edit">
                        <FiEye />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(news.id)}>
                      <Tooltip title="Delete">
                        <FiTrash />
                      </Tooltip>
                    </IconButton>
                    <Button onClick={() => handleViewDetail(news.id)}>View Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredNewss.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={editMode || registrationMode}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '400px', margin: 'auto' }}>
          {editMode && (
            <div>
              <h2>Edit News</h2>
              <TextField
                label="Title"
                value={selectedNews.title}
                onChange={(e) => setSelectedNewsState({ ...selectedNews, title: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Content"
                value={selectedNews.content}
                onChange={(e) => setSelectedNewsState({ ...selectedNews, content: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="author"
                value={selectedNews.author}
                onChange={(e) => setSelectedNewsState({ ...selectedNews, author: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date"
                value={selectedNews.publishedAt}
                onChange={(e) => setSelectedNewsState({ ...selectedNews, publishedAt: e.target.value })}
                fullWidth
                margin="normal"
              />
              
              <Button onClick={handleSave} variant="contained" color="primary" style={{ marginRight: '10px' }}>Save</Button>
              <Button onClick={handleCancel} variant="contained" color="secondary">Cancel</Button>
            </div>
          )}
          {registrationMode && (
            <div>
              <h2>Register New News</h2>
              <TextField
                label="News Title"
                value={selectedNews.title}
                onChange={(e) => setSelectedNewsState({ ...selectedNews, title: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="News Content"
                value={selectedNews.content}
                onChange={(e) => setSelectedNewsState({ ...selectedNews, content: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="author"
                value={selectedNews.author}
                onChange={(e) => setSelectedNewsState({ ...selectedNews, author: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="date"
                value={selectedNews.publishedAt}
                onChange={(e) => setSelectedNewsState({ ...selectedNews, publishedAt: e.target.value })}
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
        <DialogTitle>Delete News</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this news?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDetailModalOpen} onClose={() => setViewDetailModalOpen(false)}>
        <DialogTitle>News Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>Title: {selectedNewsState?.title}</p>
            <p>Content: {selectedNewsState?.content}</p>
            <p>author: {selectedNewsState?.author}</p>
            <p>Date: {selectedNewsState?.publishedAt}</p>
        
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

export default Newss;
