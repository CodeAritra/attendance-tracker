import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Paper,
  Dialog,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Form from "../components/Form";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext.js";
import { toast } from "react-hot-toast";

function Dashboard() {
  const { user } = useContext(AuthContext); 
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editSubject, setEditSubject] = useState(null); // State for editing a subject

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpen = (subject = null) => {
    setEditSubject(subject); // Set the subject to edit if provided
    setOpen(true);
  };

  const handleClose = () => {
    setEditSubject(null); // Clear the edit subject when dialog is closed
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/attendance")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Error fetching subjects:", err.message));
  }, []);

  const handleIncrementAttendance = async (id, type) => {
    if (!user) {
      toast.error("Please log in to update attendance.");
      return;
    }
    try {
      const updatedSubjects = subjects.map((subj) => {
        if (subj._id === id) {
          return { ...subj, [type]: subj[type] + 1 };
        }
        return subj;
      });

      setSubjects(updatedSubjects);

      await axios.put(`http://localhost:5000/attendance/${id}`, {
        [type]: updatedSubjects.find((subj) => subj._id === id)[type],
      });
    } catch (err) {
      console.error("Error updating attendance:", err.message);
    }
  };


  const handleDeleteSubject = async (id) => {
    if (!user) {
      toast.error("Please log in to delete a subject.");
      return;
    }
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/attendance/${id}`
      );
      setSubjects(subjects.filter((subj) => subj._id !== id));
      toast.success(data.message);
    } catch (err) {
      console.error("Error deleting subject:", err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" style={{ marginTop: "20px" }}>
        <Grid container spacing={4}>
          {subjects.length > 0 ? (
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                style={{
                  padding: "16px",
                  height: "70vh",
                  overflowY: "auto",
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Attendance
                </Typography>
                <List>
                  {subjects.map((subj, index) => {
                    const attendancePercentage = subj.totalClasses
                      ? (
                          (subj.attendedClasses / subj.totalClasses) *
                          100
                        ).toFixed(2)
                      : 0;

                    return (
                      <ListItem key={subj._id || index} divider>
                        <ListItemText
                          primary={
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography>{subj.subject}</Typography>
                              <div>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleOpen(subj)} // Open edit form with subject data
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="secondary"
                                  onClick={() => handleDeleteSubject(subj._id)} // Handle delete
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </div>
                            </div>
                          }
                          secondary={
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography>
                                  My Attendance: {subj.attendedClasses}
                                </Typography>
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleIncrementAttendance(
                                      subj._id,
                                      "attendedClasses"
                                    )
                                  }
                                >
                                  <AddIcon />
                                </IconButton>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Typography>
                                  Total Attendance: {subj.totalClasses}
                                </Typography>
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleIncrementAttendance(
                                      subj._id,
                                      "totalClasses"
                                    )
                                  }
                                >
                                  <AddIcon />
                                </IconButton>
                              </div>
                              <Typography style={{ fontWeight: "bold" }}>
                                Attendance Percentage: {attendancePercentage}%
                              </Typography>
                            </div>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
          ) : (
            <Grid item xs={11} md={6}>
              <Typography
                variant="h6"
                align="center"
                style={{ marginTop: "100px", fontWeight: "bold" }}
              >
                No Records
              </Typography>
            </Grid>
          )}

          {/* Right Side: Add or Edit Subject Form */}
          {isMobile ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
              >
                Add Subject
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <Form
                  addSubject={(newSubject) =>
                    setSubjects([...subjects, newSubject])
                  }
                  setOpen={setOpen}
                  editSubject={editSubject}
                />
              </Dialog>
            </div>
          ) : (
            <Grid item xs={12} md={6}>
              <Form
                addSubject={(newSubject) =>
                  setSubjects([...subjects, newSubject])
                }
                setOpen={setOpen}
                editSubject={editSubject}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;
