import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BlogCard from "../components/BlogCard";
import { getMyBlogs, deleteBlog } from "../services/api";

interface Blog {
  _id: string;
  title: string;
  synopsis?: string;
  featuredImg?: string;
  createdAt?: string;
  author: {
    firstName: string;
    lastName: string;
  };
}

const MyBlogs = () => {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myBlogs"],
    queryFn: async () => {
      const res = await getMyBlogs();
      return res.data as { data: Blog[] };
    },
  });

  const blogs = data?.data ?? [];

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await deleteBlog(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBlogs"] });
      setDeleteDialogOpen(false);
      setSelectedBlogId(null);
    },
    onError: (err) => {
      alert(err.message || "Failed to delete blog.");
    },
  });

  const openDeleteDialog = (id: string) => {
    setSelectedBlogId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBlogId) deleteMutation.mutate(selectedBlogId);
  };

  if (isLoading)
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#3A86FF" }} />
      </Box>
    );

  if (isError)
    return (
      <Container sx={{ mt: 6 }}>
        <Typography color="error">
          {error?.message || "Failed to fetch your blogs."}
        </Typography>
      </Container>
    );

  if (blogs.length === 0)
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h6" mb={2}>
          You haven’t created any blogs yet.
        </Typography>
        <Button
          href="/create-blog"
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#4361EE",
            "&:hover": { backgroundColor: "#3F51B5" },
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Create Your First Blog
        </Button>
      </Container>
    );

  return (
    <Container sx={{ minHeight: "70vh", py: 5 }}>
      <Typography variant="h5" fontWeight="medium" mb={3} color="#3A86FF">
        My Blogs
      </Typography>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <BlogCard
            blog={blog}
            key={blog._id}
            onDelete={() => openDeleteDialog(blog._id)}
          />
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: "#3A86FF" }}>Delete Blog?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: "none", color: "#4361EE" }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={confirmDelete}
            disabled={deleteMutation.status === "pending"}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            {deleteMutation.status === "pending" ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBlogs;
