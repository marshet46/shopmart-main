import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCompany } from '../redux/slice/uploadCampany';
import {
  TextField, Button, Typography, Container, Box,
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@mui/material';

const AddCompany = () => {
  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    sector: '',
    industry: '',
    description: '',
    logoUrl: null,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.company);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logoUrl: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    dispatch(createCompany(form));
  };

  useEffect(() => {
    if (success) {
      setModalContent({
        title: 'Success',
        message: 'Company information successfully!'
      });
      setModalOpen(true);
    } else if (error) {
      setModalContent({
        title: 'Error',
        message: 'Failed to create company information select valid jpg image and file form correctly. and try again.'
      });
      setModalOpen(true);
    }
  }, [success, error]);

  const handleClose = () => {
    setModalOpen(false);
    setFormData({
      name: '',
      ticker: '',
      sector: '',
      industry: '',
      description: '',
      logoUrl: null,
    });
  };

  useEffect(() => {
    console.log("success:", success);
    console.log("error:", error);
    console.log("modalOpen:", modalOpen);
  }, [success, error, modalOpen]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Company
        </Typography>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Ticker"
            name="ticker"
            value={formData.ticker}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Sector"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Upload Logo
            <input
              type="file"
              hidden
              name="logoUrl"
              onChange={handleFileChange}
            />
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {loading ? <CircularProgress /> : <Button type="submit" variant="contained" color="primary">Submit</Button>}
          </Box>
        </form>
        <Dialog open={modalOpen} onClose={handleClose}>
          <DialogTitle>{modalContent.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{modalContent.message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">OK</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AddCompany;
