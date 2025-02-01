import { useContext, useState, useEffect } from "react";
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
  CircularProgress,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Form from "../components/Form";
import Navbar from "../components/Navbar";
import SubjectContext from "../context/SubjectContext.js";

function Dashboard() {
  const {
    subjects,
    handleIncrementAttendance,
    deleteSubject,
    setEditSubject,
    open,
    setOpen,
  } = useContext(SubjectContext);

  const [loading, setLoading] = useState(true); // Tracks loading state
  const [dataFetched, setDataFetched] = useState(false); // Ensures data is fetched before showing "No Records"

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setDataFetched(true); // Data fetching is complete
    }, 1500);
  }, [subjects]); // This effect runs when `subjects` updates

  const handleOpen = (subject = null) => {
    setEditSubject(subject);
    setOpen(true);
  };

  const handleClose = () => {
    setEditSubject(null);
    setOpen(false);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" style={{ marginTop: "20px" }}>
        <Grid container spacing={4}>
          {loading ? ( // Show loading spinner while fetching data
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box display="flex" flexDirection="column" alignItems="center">
                <CircularProgress size={50} color="primary" />
                <Typography variant="h6" style={{ marginTop: "10px" }}>
                  Loading Subjects...
                </Typography>
              </Box>
            </Grid>
          ) : subjects.length > 0 ? ( // Show subjects if available
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                style={{ padding: "16px", height: "70vh", overflowY: "auto" }}
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
                                  onClick={() => handleOpen(subj)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="secondary"
                                  onClick={() => deleteSubject(subj._id)}
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
          ) : dataFetched ? ( // Show "No Records" only after data has been fetched
            <Grid item xs={11} md={6}>
              <Typography
                variant="h6"
                align="center"
                style={{ marginTop: "100px", fontWeight: "bold" }}
              >
                No Records
              </Typography>
            </Grid>
          ) : null}

          {/* Right Side: Add or Edit Subject Form */}
          {!loading ? (
            <>
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
                    <Form />
                  </Dialog>
                </div>
              ) : (
                <Grid item xs={12} md={6}>
                  <Form />
                </Grid>
              )}
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;
