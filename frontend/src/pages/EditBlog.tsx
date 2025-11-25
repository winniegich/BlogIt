import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import axiosInstance from "../api/axios";

import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";

type Blog = {
  _id: string;
  title: string;
  synopsis?: string;
  content: string;
  featuredImg?: string;
};

function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch blog
  const { data: blogData, isLoading } = useQuery<Blog>({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/get-blog/${id}`);
      return res.data as Blog;
    },
    enabled: !!id,
  });

  // Initialize form ONCE using lazy state initialization
  const [form, setForm] = useState(() => ({
    title: blogData?.title ?? "",
    synopsis: blogData?.synopsis ?? "",
    content: blogData?.content ?? "",
    featuredImg: blogData?.featuredImg ?? "",
  }));

  // When blogData loads AFTER first render, update form safely
  if (blogData && form.title === "" && form.content === "") {
    setForm({
      title: blogData.title,
      synopsis: blogData.synopsis || "",
      content: blogData.content,
      featuredImg: blogData.featuredImg || "",
    });
  }

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedBlog: Partial<Blog>) =>
      axiosInstance.patch(`/update-blog/${id}`, updatedBlog),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      navigate("/blogs");
    },

    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to update blog");
      } else {
        alert("Failed to update blog");
      }
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
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
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ mt: 4, maxWidth: 600 }}>
      <Typography variant="h5" mb={3}>
        Edit Blog
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Synopsis"
            name="synopsis"
            value={form.synopsis}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={6}
            required
          />

          <TextField
            label="Featured Image URL"
            name="featuredImg"
            value={form.featuredImg}
            onChange={handleChange}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update Blog"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default EditBlog;
