/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { Typography, TextField, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function Form({ addSubject, setOpen }) {
  const [newSubject, setNewSubject] = useState({
    subject: "",
    totalClasses: 0,
    attendedClasses: 0,
  });

  const handleAddSubject = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/attendance",
        newSubject
      );
      addSubject(res.data); // Update parent state with the new subject
      setNewSubject({ subject: "", totalClasses: 0, attendedClasses: 0 }); // Reset fields
      if (setOpen) setOpen(false); // Close dialog if mobile view
    } catch (err) {
      console.error("Error adding subject:", err.message);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        Add Subject
      </Typography>
      <TextField
        label="Subject"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newSubject.subject}
        onChange={(e) =>
          setNewSubject({ ...newSubject, subject: e.target.value })
        }
      />

      <TextField
        label="Total Classes"
        type="number"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newSubject.totalClasses}
        onChange={(e) =>
          setNewSubject({ ...newSubject, totalClasses: e.target.value })
        }
        inputProps={{
            min: 0, // Set the minimum value
          }}
      />

      <TextField
        label="Attended Classes"
        type="number"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newSubject.attendedClasses}
        onChange={(e) =>
          setNewSubject({ ...newSubject, attendedClasses: e.target.value })
        }
        inputProps={{
            min: 0, // Set the minimum value
          }}
      />

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddSubject}
        fullWidth
        style={{ marginTop: "16px" }}
      >
        Add Subject
      </Button>
    </Paper>
  );
}

export default Form;
