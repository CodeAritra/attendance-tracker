import { useContext, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AuthPage = () => {
  const { login } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup
      ? "https://attendance-tracker-backend-ssna.onrender.com/auth/signup"
      : "https://attendance-tracker-backend-ssna.onrender.com/auth/login";

    const payload = isSignup
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      : { email: formData.email, password: formData.password };

    try {
      const { data } = await axios.post(url, payload);
      console.log("data == ", data);

      if (data.success) {
        login(data.user, data.token);
        navigate("/");
        toast.success(data.message);
        console.log("data == ", data);
      } else {
        console.log("data == ", data);

        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error in authentication request:", error);
      // Check if it's a network error or an API error
      if (error.response) {
        // Handle API errors (like 400, 500, etc.)
        toast.error(error.response.data.message || "Something went wrong.");
      } else if (error.request) {
        // Handle network errors
        toast.error("Network error: Please check your connection.");
      } else {
        // Catch any other errors
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "90vh", overflow: "hidden" }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={3} style={{ padding: "2rem" }}>
          <Typography variant="h5" align="center" gutterBottom>
            {isSignup ? "Signup" : "Login"}
          </Typography>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {isSignup ? "Signup" : "Login"}
              </Button>
            </Box>
          </form>
          <Box
            mt={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isSignup}
                  onChange={() => setIsSignup(!isSignup)}
                />
              }
              label={isSignup ? "Switch to Login" : "Switch to Signup"}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AuthPage;
