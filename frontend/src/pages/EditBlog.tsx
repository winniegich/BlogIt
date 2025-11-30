import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import axiosInstance from "../services/axiosInstance";
import { useSingleBlog } from "@/hooks/useSingleBlog.ts";

import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";

// Cloudinary constants
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlhjs2xu0/image/upload";
const UPLOAD_PRESET = "xpdtf7bf";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Zustand + React Query fetch
  const { data: blog, isLoading } = useSingleBlog(id as string);

  // local form state
  const [form, setForm] = useState({
    title: "",
    synopsis: "",
    content: "",
    featuredImg: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // ⭐ FILL FORM WHEN BLOG LOADS
  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title,
        synopsis: blog.synopsis ?? "",
        content: blog.content,
        featuredImg: blog.featuredImg ?? "",
      });
    }
  }, [blog]);

  // ⭐ UPDATE MUTATION
  const updateMutation = useMutation({
    mutationFn: async () =>
      axiosInstance.patch(`/blogs/${id}`, {
        title: form.title,
        synopsis: form.synopsis,
        content: form.content,
        featuredImageUrl: form.featuredImg,
      }),
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

  // ⭐ FORM INPUT HANDLER
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ⭐ IMAGE UPLOAD (Cloudinary)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setUploadingImage(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "images");

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.secure_url) {
        alert("Image upload failed");
        return;
      }

      // set image URL in form state
      setForm((prev) => ({ ...prev, featuredImg: data.secure_url }));
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <Container sx={{ mt: 4, maxWidth: 600 }}>
      <Typography
        variant="h5"
        mb={3}
        sx={{ fontFamily: "cursive", fontWeight: "bold", color: "#3A86FF" }}
      >
        Edit Blog
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress sx={{ color: "#3A86FF" }} />
        </Box>
      ) : (
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

            <Button
              variant="contained"
              component="label"
              sx={{
                textTransform: "none",
                backgroundColor: "#4361EE",
                "&:hover": { backgroundColor: "#3F51B5" },
              }}
            >
              Upload Featured Image
              <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
            </Button>

            {uploadingImage && <Typography>Uploading image...</Typography>}

            {form.featuredImg && (
              <Box sx={{ mt: 1 }}>
                <img
                  src={form.featuredImg}
                  alt="Preview"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#3A86FF",
                color: "#fff",
                "&:hover": { backgroundColor: "#4361EE" },
              }}
              disabled={updateMutation.isPending || uploadingImage}
            >
              {updateMutation.isPending ? "Updating..." : "Update Blog"}
            </Button>
          </Stack>
        </form>
      )}
    </Container>
  );
}

export default EditBlog;
