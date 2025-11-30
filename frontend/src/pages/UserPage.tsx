import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Container,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Single sample blog
const sampleBlog = {
  id: "1",
  title: "Power of Journaling",
  synopsis:
    "Journaling clarifies thoughts, manages stress, and improves self-awareness. Start today and track your personal growth!",
  content:
    "Journaling clarifies thoughts, manages stress, and improves self-awareness. Write about daily experiences, emotions, goals, and lessons learned. Structured or free writing helps track progress, identify patterns, and set intentions.",
  featuredImageUrl:
    "https://res.cloudinary.com/dlhjs2xu0/image/upload/v1764422006/images/uqgdmck4bxaodrrciart.jpg",
  createdAt: new Date().toISOString(),
  user: { firstName: "Johnn", lastName: "Doel" },
};

function UserPage() {
  const guest = { firstName: "Guest" };
  const user = JSON.parse(localStorage.getItem("user") || "null") || guest;
  const initials = `${user.firstName[0]}`;

  // State for guide toggle
  const [showFullGuide, setShowFullGuide] = useState(false);

  const toggleGuide = () => setShowFullGuide(!showFullGuide);

  const guideSteps = [
    "1. Register first if you don't have an account.",
    "2. If you have an account, login or sign up.",
    "3. Create a blog using 'Create New Blog'.",
    "4. View a single blog by clicking on it.",
    "5. View all blogs using 'Browse Blogs'.",
    "6. Update a blog anytime from your dashboard.",
    "7. Delete a blog (moves to trash).",
    "8. Recover a deleted blog from the trash.",
    "9. Permanently delete a blog from trash.",
    "10. View all blogs in the trash using 'Trash'.",
    "11. Change your profile: first name, last name, username, email address, password.",
    "12. Logout safely when done.",
  ];

  const previewSteps = guideSteps.slice(0, 4);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #bbdefb, #64b5f6)", // soothing blue gradient
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* User Greeting */}
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          mb={6}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 70,
              height: 70,
              fontSize: 28,
              boxShadow: 3,
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#0d47a1"
              sx={{ mb: 1 }}
            >
              Welcome to BlogIt, {user.firstName}!
            </Typography>
            <Typography
              variant="body1"
              color="#0d47a1"
              sx={{ fontSize: { xs: 14, sm: 16 } }}
            >
              Your personal space to write, explore, and share ideas. ✨
            </Typography>
          </Box>
        </Box>

        {/* Action Cards */}
        <Stack
          direction="row"
          spacing={3}
          mb={6}
          justifyContent="center"
          sx={{ width: "100%" }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            style={{ flex: 1, maxWidth: "100%" }}
          >
            <Card
              sx={{
                bgcolor: "#e3f2fd",
                borderRadius: "20px",
                boxShadow: 5,
                p: { xs: 3, sm: 4 },
                width: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="#1565c0"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <ArticleIcon sx={{ color: "#42a5f5" }} />
                  Let’s start blogging!
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  mt={1}
                  justifyContent="center"
                >
                  <Button
                    variant="contained"
                    component={Link}
                    to="/new-blog"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: "bold",
                      borderRadius: "12px",
                      textTransform: "none",
                      backgroundColor: "#42a5f5",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                  >
                    Create New Blog
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/blogs"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: "bold",
                      borderRadius: "12px",
                      textTransform: "none",
                      backgroundColor: "#64b5f6",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                  >
                    Browse Blogs
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Stack>

        {/* Guide Tip with Show More / Less */}
        <Box mb={6}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card
              sx={{
                bgcolor: "#ffffffcc",
                borderRadius: "20px",
                p: 4,
                boxShadow: 6,
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                color="#1565c0"
              >
                👋 New here? Here's a quick guide!
              </Typography>

              <Typography variant="body1" color="#0d47a1" sx={{ lineHeight: 1.8 }}>
                {(showFullGuide ? guideSteps : previewSteps).map((step) => (
                  <span key={step}>
                    {step} <br />
                  </span>
                ))}
              </Typography>

              <Button
                size="small"
                variant="text"
                onClick={toggleGuide}
                sx={{ mt: 2, textTransform: "none", color: "#1565c0" }}
              >
                {showFullGuide ? "Show Less ▲" : "Show More ▼"}
              </Button>
            </Card>
          </motion.div>
        </Box>

        {/* Sample Blog */}
        <Box>
          <Typography
            variant="h5"
            fontWeight="medium"
            mb={4}
            color="#1565c0"
            sx={{ textShadow: "1px 1px 3px rgba(0,0,0,0.2)" }}
          >
            Example Blog
          </Typography>

          <Stack direction="row" justifyContent="center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: 500, width: "100%" }}
            >
              <BlogCard blog={sampleBlog} showReadMore={true} />
            </motion.div>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default UserPage;
