import { useState } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
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
      ? "http://localhost:5000/auth/signup"
      : "http://localhost:5000/auth/login";

    const payload = isSignup
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      : { email: formData.email, password: formData.password };

    try {
      const { data } = await axios.post(url, payload);

      // console.log(data.success);

      if (data.success) {
        console.log("Success:", data);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        window.location.reload();
        // Handle success (e.g., redirect or show success message)
      } else {
        console.error("Error:", data);
        // Handle error (e.g., show error message)
      }
    } catch (error) {
      console.error("Network Error:", error);
      // Handle network error
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
