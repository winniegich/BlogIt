import { Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Typography variant="h2" fontWeight="bold" mb={2} color="#3A86FF">
        404
      </Typography>
      <Typography variant="h5" mb={3} color="#4361EE">
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        sx={{
          backgroundColor: "#3A86FF",
          "&:hover": {
            backgroundColor: "#4361EE",
          },
          textTransform: "none",
          px: 4,
          py: 1.5,
        }}
      >
        Go Back Home
      </Button>
    </Box>
  );
}

export default NotFound;
