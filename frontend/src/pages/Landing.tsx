import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <Box
      sx={{
        minHeight: "57vh",
        backgroundImage: "linear-gradient(to right, white, white)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 3, md: 6 },
        py: { xs: 6, md: 8 },
      }}
    >
      
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography
          variant="h2"
          color="black"
          fontFamily="cursive"
          gutterBottom
          sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
        >
          Welcome to BlogIt
        </Typography>

        <Typography
          variant="h6"
          color="black"
          fontFamily="cursive"
          gutterBottom
          sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
        >
          A cozy blogging platform where you can share your thoughts and ideas with the world.
        </Typography>

        <Button
          component={Link}
          to="/signup"
          variant="contained"
          sx={{
            mt: 3,
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            borderRadius: "12px",
            textTransform: "none",
            backgroundColor: "#819067",
            "&:hover": {
              backgroundColor: "#6d7f50",
            },
          }}
        >
          Get started with us
        </Button>
      </Box>

      <Box sx={{ flex: 1, display: { xs: "none", md: "block" }, textAlign: "center" }}>
        <img
          src="/blog (2).jpg"
          alt="BlogIt Illustration"
          style={{
            width: "80%",
            maxHeight: "700px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );
}

export default Landing;
