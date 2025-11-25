import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";

interface Blog {
  _id: string;
  title: string;
  synopsis?: string;
  content: string;
  featuredImg?: string;
  dateCreated: string;
  author: {
    firstName: string;
    lastName: string;
  };
}

function MyBlog() {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // --- Fetch user's blogs ---
  const { data: blogs = [], isLoading, isError, error } = useQuery<Blog[], Error>({
    queryKey: ["user-blogs"],
    queryFn: async () => {
      const res = await axiosInstance.get<Blog[]>("/get-user-blogs");
      return res.data;
    },
  });

  // --- Delete mutation ---
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/delete-blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-blogs"] });
      setDeleteDialogOpen(false);
      setSelectedBlogId(null);
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        alert(err.message || "Failed to delete blog");
      } else {
        alert("Failed to delete blog");
      }
    },
  });

  const handleDeleteClick = (id: string) => {
    setSelectedBlogId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBlogId) deleteMutation.mutate(selectedBlogId);
  };

  if (isLoading)
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Container sx={{ mt: 6 }}>
        <Typography color="error">{error?.message}</Typography>
      </Container>
    );

  if (blogs.length === 0)
    return (
      <Container sx={{ mt: 6 }}>
        <Typography variant="h6">You haven’t created any blogs yet.</Typography>
        <Button component={Link} to="/create-blog" variant="contained" sx={{ mt: 2, backgroundColor: "#819067" }}>
          Create Your First Blog
        </Button>
      </Container>
    );

  return (
    <Box sx={{ minHeight: "70vh", px: 4, py: 4 }}>
      <Container>
        <Typography variant="h5" fontWeight="medium" mb={3}>
          My Blogs
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={3}>
          {blogs.map((blog: Blog) => {
            const initials = `${blog.author.firstName[0]}${blog.author.lastName[0]}`;
            const date = new Date(blog.dateCreated).toLocaleDateString("en", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <Box key={blog._id} sx={{ width: { xs: "100%", sm: "48%", md: "30%" } }}>
                <Card sx={{ height: "100%" }}>
                  {blog.featuredImg && <CardMedia component="img" height="180" image={blog.featuredImg} alt={blog.title} />}
                  <CardContent>
                    <Typography variant="h6">{blog.title}</Typography>
                    {blog.synopsis && <Typography variant="body2" color="text.secondary" mt={1}>{blog.synopsis}</Typography>}
                    <Stack direction="row" spacing={1} mt={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "#6d4c41", width: 40, height: 40 }}>{initials}</Avatar>
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
                    <Button component={Link} to={`/edit-blog/${blog._id}`} size="small" variant="outlined" sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(blog._id)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            );
          })}
        </Stack>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Blog?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this blog? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyBlog;
