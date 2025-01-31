/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import { Typography, TextField, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SubjectContext from "../context/SubjectContext.js";

function Form() {
  const { handleAddOrEditSubject,newSubject,setNewSubject,editSubject } = useContext(SubjectContext);

  useEffect(() => {
    if (editSubject) {
      setNewSubject({
        subject: editSubject.subject,
        totalClasses: editSubject.totalClasses,
        attendedClasses: editSubject.attendedClasses,
      });
    }
  }, [editSubject]);

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
