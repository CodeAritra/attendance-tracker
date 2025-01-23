import { useState, useEffect } from "react";
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

function Dashboard() {
  const [subjects, setSubjects] = useState([]); // State to manage subjects
  const [open, setOpen] = useState(false); // State to manage dialog visibility

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch subjects on initial render
  useEffect(() => {
    axios
      .get("http://localhost:5000/attendance")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Error fetching subjects:", err.message));
  }, []);

  // Increment attendance (specific to "attendedClasses" or "totalClasses")
  const handleIncrementAttendance = async (id, type) => {
    try {
      const res = await axios.put(`http://localhost:5000/attendance/${id}`, {
        [type]: 1,
      });
      setSubjects(subjects.map((subj) => (subj._id === id ? res.data : subj)));
    } catch (err) {
      console.error("Error updating attendance:", err.message);
    }
  };

  // Function to add a new subject and update the list
  const addSubject = (newSubject) => {
    setSubjects([...subjects, newSubject]);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Attendance Tracker
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side: Attendance List */}
        {subjects.length > 0 ? (
          <>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                style={{
                  padding: "16px",
                  height: "70vh",
                  overflowY: "auto", // Enable scroll only for attendance list
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Attendance
                </Typography>
                <List>
                  {subjects.map((subj) => {
                    const attendancePercentage = subj.totalClasses
                      ? (
                          (subj.attendedClasses / subj.totalClasses) *
                          100
                        ).toFixed(2)
                      : 0;

                    return (
                      <ListItem key={subj._id} divider>
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
                                  //   onClick={() => handleEdit(subj)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="secondary"
                                  //   onClick={() => handleDelete(subj._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </div>
                            </div>
                          }
                          secondary={
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  marginTop: 0,
                                }}
                              >
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
                                <Typography
                                  style={{ marginTop: 0, fontWeight: "bold" }}
                                >
                                  Attendance Percentage: {attendancePercentage}%
                                </Typography>
                              </div>
                            </>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={11} md={6}>
              <Typography
                variant="h6"
                align="center"
                style={{ marginTop: "100px", fontWeight: "bold" }}
              >
                No Records
              </Typography>
            </Grid>
          </>
        )}

        {/* Right Side: Add Subject Form */}
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
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Add Subject
            </Button>

            {/* Dialog for mobile view */}
            <Dialog open={open} onClose={handleClose}>
              <Form addSubject={addSubject} setOpen={setOpen} />
            </Dialog>
          </div>
        ) : (
          // Display form directly for PC/Laptop view
          <Grid item xs={12} md={6}>
            <Form addSubject={addSubject} setOpen={setOpen} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;
