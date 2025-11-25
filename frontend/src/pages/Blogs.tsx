import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios"; 
import axiosInstance from "../api/axios";
import {
  Container,
  Avatar,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";

interface Author {
  firstName: string;
  lastName: string;
}

interface Blog {
  _id: string;
  title: string;
  synopsis?: string;
  content: string;
  featuredImg?: string;
  dateCreated: string;
  author: Author;
}

function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBlogs = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Blog[]>("/get-blogs");
        setBlogs(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          
          const axiosError = err as AxiosError<{ message: string }>;
          setError(axiosError.response?.data?.message || "Failed to fetch blogs.");
        } else {
          setError("Failed to fetch blogs.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading)
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ minHeight: "70vh", p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ minHeight: "70vh", px: 4, py: 4 }}>
      <Container>
        <Typography
          variant="h5"
          fontWeight="medium"
          mb={3}
          fontFamily="cursive"
          color="black"
        >
          All Blogs
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={3}
          justifyContent="flex-start"
        >
          {blogs.map((blog) => {
            const initials = `${blog.author.firstName[0]}${blog.author.lastName[0]}`;
            const date = new Date(blog.dateCreated).toLocaleDateString("en", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <Box
                key={blog._id}
                sx={{ width: { xs: "100%", sm: "48%", md: "30%" } }}
              >
                <Card sx={{ height: "100%" }}>
                  {blog.featuredImg && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={blog.featuredImg}
                      alt={blog.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{blog.title}</Typography>
                    {blog.synopsis && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {blog.synopsis}
                      </Typography>
                    )}

                    <Stack direction="row" spacing={1} mt={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "#6d4c41", width: 40, height: 40 }}>
                        {initials}
                      </Avatar>
                      <Box>
                        <Typography variant="caption" display="block">
                          By {blog.author.firstName} {blog.author.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {date}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      component={Link}
                      to={`/blogsDetails/${blog._id}`}
                      variant="outlined"
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}

export default Blogs;
