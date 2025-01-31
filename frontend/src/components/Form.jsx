/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Typography, TextField, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AuthContext from "../context/AuthContext.js";
import { toast } from "react-hot-toast";

function Form({ addSubject, setOpen, editSubject }) {
  const { user } = useContext(AuthContext);

  const [newSubject, setNewSubject] = useState({
    subject: "",
    totalClasses: 0,
    attendedClasses: 0,
  });

  useEffect(() => {
    if (editSubject) {
      setNewSubject({
        subject: editSubject.subject,
        totalClasses: editSubject.totalClasses,
        attendedClasses: editSubject.attendedClasses,
      });
    }
  }, [editSubject]);

  const handleAddOrEditSubject = async () => {
    try {
      if (!user) {
        toast.error("Please log in");
        return;
      }

      if (editSubject) {
        // Edit existing subject
        const { data } = await axios.put(
          `http://localhost:5000/attendance/${editSubject._id}`,
          newSubject
        );
        addSubject(data); // Update parent state with the updated subject
      } else {
        // Add new subject
        const { data } = await axios.post(
          "http://localhost:5000/attendance",
          newSubject
        );
        toast.success(data.message);
        addSubject(data);
        // Update the parent state with the new subject
      }

      setNewSubject({ subject: "", totalClasses: 0, attendedClasses: 0 }); // Reset fields
      if (setOpen) setOpen(false);
      window.location.reload();
      // Close dialog if mobile view
    } catch (err) {
      console.error("Error adding or editing subject:", err.message);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        {editSubject ? "Edit Subject" : "Add Subject"}
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
        onClick={handleAddOrEditSubject}
        fullWidth
        style={{ marginTop: "16px" }}
      >
        {editSubject ? "Save Changes" : "Add Subject"}
      </Button>
    </Paper>
  );
}

export default Form;
