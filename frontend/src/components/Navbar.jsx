import React, { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const { user, logout } = useContext(AuthContext);
  const [userLoaded, setUserLoaded] = useState(false); 

  useEffect(() => {
    if (user !== undefined) {
      setUserLoaded(true);
    }
  }, [user]); 

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleLogout = async () => {
    const { data } = await axios.post(
      "https://attendance-tracker-backend-ssna.onrender.com/auth/logout"
    );
    if (data.success) {
      logout();
      toast.success(data.message);
      navigate("/auth");
    }
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Left side: App Name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Attendance Tracker
        </Typography>

        {/* Right side: User Info */}
        <Box>
          {userLoaded && ( // Only render Avatar when user data is loaded
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </IconButton>
          )}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MenuItem disabled>{user?.name || "User Name"}</MenuItem>
            {user ? (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            ) : (
              <MenuItem onClick={handleLogin}>LogIn</MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
