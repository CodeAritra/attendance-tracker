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
import AuthContext from "../context/AuthContext.js"; // Import AuthContext

function Dashboard() {
  const { user } = useContext(AuthContext); // Get user authentication status
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = () => {
    if (!user) {
      alert("Please log in to add a subject.");
      return;
    }
  };

  const handleOpen = () => {
    if (!user) {
      alert("Please log in to add a subject.");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/attendance")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Error fetching subjects:", err.message));
  }, []);

  const handleIncrementAttendance = async (id, type) => {
    if (!user) {
      alert("Please log in to update attendance.");
      return;
    }
    try {
      const res = await axios.put(`http://localhost:5000/attendance/${id}`, {
        [type]: 1,
      });
      setSubjects(subjects.map((subj) => (subj._id === id ? res.data : subj)));
    } catch (err) {
      console.error("Error updating attendance:", err.message);
    }
  };

  const addSubject = (newSubject) => {
    setSubjects([...subjects, newSubject]);
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
                                  onClick={handleClick}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="secondary"
                                  onClick={handleClick}
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
              <Dialog open={open} onClose={handleClose}>
                <Form addSubject={addSubject} setOpen={setOpen} />
              </Dialog>
            </div>
          ) : (
            <Grid item xs={12} md={6}>
              <Form addSubject={addSubject} setOpen={setOpen} />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;
