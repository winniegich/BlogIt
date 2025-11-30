import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Stack, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

export default function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  // Check login state on mount and whenever localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem("user");
      setLoggedIn(!!user);
    };

    // Initial check
    handleStorageChange();

    // Listen for localStorage changes (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("user");
    setLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "#3A86FF", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 6 } }}>
        <Typography
          variant="h6"
          component={Link}
          to={loggedIn ? "/userPage" : "/"}
          sx={{ textDecoration: "none", color: "#fff", fontWeight: "bold", fontFamily: "cursive", fontSize: { xs: "1.2rem", md: "1.5rem" } }}
        >
          BlogIt
        </Typography>

        <Stack direction="row" spacing={{ xs: 1, md: 3 }} alignItems="center">
          {loggedIn ? (
            <>
              <IconButton
                color="inherit"
                component={Link}
                to="/userPage"
                sx={{ "&:hover": { color: "#FFD166", transform: "scale(1.1)", transition: "0.2s" } }}
              >
                <HomeIcon />
              </IconButton>
              <Button color="inherit" component={Link} to="/blogs" sx={{ textTransform: "none", fontWeight: "bold", "&:hover": { color: "#FFD166" } }}>Blogs</Button>
              <Button color="inherit" component={Link} to="/new-Blog" sx={{ textTransform: "none", fontWeight: "bold", "&:hover": { color: "#FFD166" } }}>New Blog</Button>
              <Button color="inherit" component={Link} to="/profile" sx={{ textTransform: "none", fontWeight: "bold", "&:hover": { color: "#FFD166" } }}>Profile</Button>
              <Button color="inherit" component={Link} to="/trash" sx={{ textTransform: "none", fontWeight: "bold", "&:hover": { color: "#FFD166" } }}>Trash</Button>
              <Button color="inherit" onClick={handleLogout} sx={{ textTransform: "none", fontWeight: "bold", "&:hover": { color: "#FFD166" } }}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/" sx={{ textTransform: "none", fontWeight: "bold", "&:hover": { color: "#FFD166" } }}>Home</Button>
              <Button color="inherit" component={Link} to="/login" sx={{ textTransform: "none", fontWeight: "bold", "&:hover": { color: "#FFD166" } }}>Login</Button>
              <Button
                variant="contained"
                component={Link}
                to="/signup"
                sx={{ backgroundColor: "#4361EE", color: "#fff", borderRadius: "24px", textTransform: "none", fontWeight: "bold", px: 3, py: 1, "&:hover": { backgroundColor: "#3F51B5", transform: "scale(1.05)", transition: "0.2s" } }}
              >
                Get Started
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
