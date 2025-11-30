import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../services/axiosInstance";
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

type Author = {
  firstName: string;
  lastName: string;
};

type Blog = {
  id: string;
  title: string;
  synopsis?: string;
  content: string;
  featuredImageUrl?: string; // <- use this
  author: Author;
};

type ApiErrorResponse = {
  message: string;
};

function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const res = await axiosInstance.get<Blog>(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as ApiErrorResponse | undefined;
          setError(data?.message || "Failed to fetch blog.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress sx={{ color: "#3A86FF" }} />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Typography color="#d32f2f">{error}</Typography>
        <Button
          component={Link}
          to="/blogs"
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#3A86FF",
            color: "#fff",
            "&:hover": { backgroundColor: "#265CBF" },
          }}
        >
          ← Back to Blogs
        </Button>
      </Container>
    );

  if (!blog) return null;

  const initials = blog?.author
  ?`${blog.author.firstName[0] ?? "" }${blog.author.lastName[0] ?? "" }`.toUpperCase():"";

  return (
    <Container sx={{ mt: 6 }}>
      {blog.featuredImageUrl && (
  <Box
    component="img"
    src={blog.featuredImageUrl}
    alt={blog.title}
    sx={{
      width: "100%",
      maxHeight: 450,
      objectFit: "cover",
      borderRadius: 2,
      mb: 4,
    }}
  />
)}

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#3A86FF" }}
      >
        {blog.title}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Avatar sx={{ bgcolor: "#4361EE" }}>{initials}</Avatar>
        <Typography variant="subtitle2" sx={{ color: "#003366" }}>
          By {blog.author?.firstName ?? "Unknown"} {blog.author?.lastName ?? ""}
        </Typography>
      </Stack>

      <Typography
        variant="body1"
        sx={{ whiteSpace: "pre-line", lineHeight: 1.8, color: "#003366" }}
      >
        {blog.content}
      </Typography>

      <Button
        component={Link}
        to="/blogs"
        variant="contained"
        sx={{
          mt: 5,
          backgroundColor: "#3A86FF",
          color: "#fff",
          borderRadius: "24px",
          px: 3,
          py: 1,
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#265CBF" },
        }}
      >
        ← Back to Blogs
      </Button>
    </Container>
  );
}

export default BlogDetail;
