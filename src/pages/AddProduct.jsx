import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { BiImageAdd } from "react-icons/bi";
import styled from "@emotion/styled";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    account_no: "",
    entity_name: "",
    account_holder_name: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const imageInput = useRef(null);
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const UploadBox = styled(Box)({
    marginTop: 30,
    height: 200,
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderStyle: "dashed",
    borderWidth: "2px",
    borderColor: "divider",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("https://aksion.vpsolutions.et/api/v1/accounts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer 85|iFvyuUIeJvvGNMNerwOgcJUKfw2d7QzSy7gubmqO1ccfbd1c",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const responseData = await response.json();
      setSuccessMessage("Deposit Account has Created successfully!");
      setDialogContent(responseData.message);
      setOpenDialog(true);
      setFormData({
        account_no: "",
        entity_name: "",
        account_holder_name: "",
      });
    } catch (error) {
      setError(error.message);
      alert(error.message);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ pt: "80px", pb: "20px" }}>
      <Typography variant="h6" sx={{ marginBottom: "14px" }}>
        Create Depsit account
      </Typography>

      {error && <div style={{ color: "red" }}>{error}</div>}
          {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      <Paper
        sx={{
          boxShadow: "none !important",
          borderRadius: "12px",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "divider",
          p: "20px",
          maxWidth: "800px",
          margin: "0 auto",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box sx={{ my: 2 }}>
            <TextField
              label="Account Number"
              variant="outlined"
              size="small"
              fullWidth
              name="account_no"
              value={formData.account_no}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ mt: 4 }}>
            <TextField
              label="Entity Name"
              variant="outlined"
              size="small"
              fullWidth
              name="entity_name"
              value={formData.entity_name}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ mt: 4 }}>
            <TextField
              label="Account Holder Name"
              variant="outlined"
              size="small"
              fullWidth
              name="account_holder_name"
              value={formData.account_holder_name}
              onChange={handleChange}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: "30px",
            }}
          >
            <Button variant="contained" type="submit" sx={{ borderRadius: "20px" }}>
              Create Deposit Account
            </Button>
          </Box>
        </form>
      </Paper>
      <Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      maxHeight: "90vh", // Set the maximum height to 80% of the viewport height
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: "#027edd", // Change background color
      color: "white", // Change text color
      textAlign: "center", // Center align text
    }}
  >
    Depost Account has created successfully
  </DialogTitle>
  <DialogContent>
    <DialogContentText>{dialogContent}</DialogContentText>
  </DialogContent>
  <DialogActions sx={{ justifyContent: "center" }}>
    <Button onClick={handleCloseDialog} variant="contained">
      Close
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default AddProduct;
