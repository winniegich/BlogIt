// Landing.tsx
import {
  Button,
  Container,
  Typography,
  Box,
  Stack,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  const features = [
    {
      title: "Fast Publishing",
      desc: "Publish blogs instantly with a smooth and intuitive editor.",
    },
    {
      title: "Beautiful Layouts",
      desc: "Your blogs automatically look elegant and modern.",
    },
    {
      title: "Secure Accounts",
      desc: "Protected authentication with modern security.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3A86FF 0%, #8338EC 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        pt: 8,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* MAIN SECTION */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={6}
          alignItems="center"
        >
          {/* LEFT SECTION */}
          <Box flex={1}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <Typography variant="h2" fontWeight={700} mb={2}>
                Welcome to <span style={{ color: "#FFBE0B" }}>BlogIt</span>
              </Typography>

              <Typography variant="h6" sx={{ opacity: 0.9 }} mb={4}>
                Create, publish, and manage your blogs effortlessly.
                Beautiful UI, powerful editor, and modern tools built for
                creators.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  component={Link}
                  to="/signup"
                  sx={{
                    backgroundColor: "#FFBE0B",
                    color: "black",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    borderRadius: "30px",
                    "&:hover": { backgroundColor: "#FFD43B" },
                  }}
                >
                  Get Started
                </Button>

                <Button
                  variant="outlined"
                  component={Link}
                  to="/blogs"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    borderRadius: "30px",
                    "&:hover": { backgroundColor: "white", color: "black" },
                  }}
                >
                  Explore Blogs
                </Button>
              </Stack>
            </motion.div>
          </Box>

          {/* RIGHT SECTION */}
          <Box flex={1}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Box
                component="img"
                src="https://img.freepik.com/free-vector/blogging-concept-illustration_114360-788.jpg"
                alt="Blogging Illustration"
                sx={{
                  width: "100%",
                  maxHeight: "420px",
                  borderRadius: "20px",
                  boxShadow: "0px 12px 35px rgba(0,0,0,0.25)",
                }}
              />
            </motion.div>
          </Box>
        </Stack>

        {/* FEATURES SECTION */}
        <Box mt={10}>
          <Typography variant="h4" textAlign="center" fontWeight={700} mb={5}>
            Why Choose <span style={{ color: "#FFBE0B" }}>BlogIt?</span>
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            justifyContent="center"
          >
            {features.map((feature, index) => (
              <Paper
                key={index}
                elevation={4}
                sx={{
                  flex: 1,
                  p: 4,
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                  color: "white",
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    background: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <Typography variant="h6" fontWeight={700} mb={1}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.85 }}>
                  {feature.desc}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
