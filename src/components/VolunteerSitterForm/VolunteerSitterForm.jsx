import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const VolunteerSitterForm = ({ onGoBack, onSubmit }) => {
  const [dates, setDates] = useState({
    startDate: "2024-04-03",
    endDate: "2024-04-07",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDates({ ...dates, [name]: value });
  };

  const handleDialogOpen = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleGoBack = () => {
    handleDialogOpen("Are you sure you want to go back without saving?");
  };

  const handleGoBackConfirm = () => {
    handleDialogClose();
    onGoBack();
  };

  const handleSubmit = () => {
    handleDialogOpen("Your request has been saved successfully!");
  };

  const handleSubmitConfirm = () => {
    handleDialogClose();
    onSubmit(dates);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" sx={{ my: 2 }}>
        Volunteer to be a Sitter for Loki
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={dates.startDate}
          onChange={handleChange}
          sx={{ width: "100%", my: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          name="endDate"
          value={dates.endDate}
          onChange={handleChange}
          sx={{ width: "100%", my: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            mt: 2,
          }}
        >
          <Button variant="outlined" onClick={handleGoBackConfirm}>
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitConfirm}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {dialogContent.includes("saved") ? (
            <Button onClick={handleSubmitConfirm} autoFocus>
              Confirm
            </Button>
          ) : (
            <Button onClick={handleGoBackConfirm} autoFocus>
              Confirm
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VolunteerSitterForm;
