import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axios";
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
  featuredImg?: string;
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
        const res = await axiosInstance.get<Blog>(`/get-blog/${id}`);
        setBlog(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          // err is now typed as AxiosError
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
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 6 }}>
        <Typography color="error">{error}</Typography>
        <Button component={Link} to="/blogs" variant="outlined" sx={{ mt: 2 }}>
          ← Back to Blogs
        </Button>
      </Container>
    );

  if (!blog) return null;

  const initials = `${blog.author.firstName[0]}${blog.author.lastName[0]}`;

  return (
    <Container sx={{ mt: 6 }}>
      {blog.featuredImg && (
        <Box
          component="img"
          src={blog.featuredImg}
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

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {blog.title}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <Avatar sx={{ bgcolor: "#6d4c41" }}>{initials}</Avatar>
        <Typography variant="subtitle2">
          By {blog.author.firstName} {blog.author.lastName}
        </Typography>
      </Stack>

      <Typography
        variant="body1"
        sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}
      >
        {blog.content}
      </Typography>

      <Button component={Link} to="/blogs" variant="outlined" sx={{ mt: 5 }}>
        ← Back to Blogs
      </Button>
    </Container>
  );
}

export default BlogDetail;
