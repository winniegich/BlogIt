import {
  TextField,
  Typography,
  Button,
  Stack,
  Container,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios"; // import isAxiosError
import axiosInstance from "../api/axios";

interface BlogForm {
  title: string;
  synopsis: string;
  content: string;
}

function NewBlog() {
  const [form, setForm] = useState<BlogForm>({
    title: "",
    synopsis: "",
    content: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("synopsis", form.synopsis);
    formData.append("content", form.content);
    formData.append("image", selectedFile);

    try {
      const response = await axiosInstance.post("/create-blog", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        navigate("/blogs");
      }
    } catch (error: unknown) {
      // Proper type guard for AxiosError
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        const msg = axiosError.response?.data?.message ?? "Error creating blog";
        alert(msg);
      } else {
        alert("An unexpected error occurred");
      }
      console.error("Error submitting blog:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Create a New Blog
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Synopsis"
            name="synopsis"
            value={form.synopsis}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            fullWidth
            multiline
            minRows={7}
          />

          <Button
            variant="contained"
            component="label"
            sx={{ textTransform: "none" }}
          >
            Upload Featured Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
              required
            />
          </Button>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ maxHeight: "200px", borderRadius: "8px" }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#819067",
              "&:hover": { backgroundColor: "#6d7b59" },
            }}
          >
            Publish Blog
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default NewBlog;
