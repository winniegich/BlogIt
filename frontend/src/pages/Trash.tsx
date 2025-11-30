import React from "react";
import type { AxiosResponse } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BlogCard from "../components/BlogCard";
import { userAPI, restoreBlog, permanentDeleteBlog } from "../services/api";
import type { Blog } from "../types/Blog";
import { Box, Container, Typography, CircularProgress, Stack } from "@mui/material";

const Trash: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch deleted blogs
  const { data, isLoading, isError, error } = useQuery<Blog[], Error>({
    queryKey: ["deletedBlogs"],
    queryFn: async () => {
      const res = await userAPI.getTrash();
      console.log("🗑️ Fetched trash data:", res.data);
      return res.data;
    },
  });

  // Restore mutation
  const restoreMutation = useMutation<AxiosResponse, Error, string>({
    mutationFn: (id) => {
      console.log("🔄 Restoring blog ID:", id);
      return restoreBlog(id);
    },
    onSuccess: (response) => {
      console.log("✅ Restore successful:", response.data);
      queryClient.invalidateQueries({ queryKey: ["deletedBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] }); // Also refresh main blogs
    },
    onError: (error) => {
      console.error("❌ Restore failed:", error);
    }
  });

  // Permanent delete mutation
  const deleteMutation = useMutation<AxiosResponse, Error, string>({
    mutationFn: (id) => {
      console.log("🗑️ Permanently deleting blog ID:", id);
      return permanentDeleteBlog(id);
    },
    onSuccess: (response) => {
      console.log("✅ Permanent delete successful:", response.data);
      queryClient.invalidateQueries({ queryKey: ["deletedBlogs"] });
    },
    onError: (error) => {
      console.error("❌ Permanent delete failed:", error);
    }
  });

  const handleRestore = (id: string) => {
    console.log("🔄 Restore clicked for ID:", id);
    if (!id) {
      console.error("❌ Cannot restore: Blog ID missing");
      alert("Error: Blog ID is missing");
      return;
    }

    restoreMutation.mutate(id, {
      onError: (err) => {
        console.error("Restore error:", err);
        alert("Failed to restore blog: " + err.message);
      },
      onSuccess: (res) => {
        alert(res.data?.message ?? "Blog restored successfully!");
      },
    });
  };

  const handlePermanentDelete = (id: string) => {
    console.log("🗑️ Permanent delete clicked for ID:", id);
    if (!id) {
      console.error("❌ Cannot delete: Blog ID missing");
      alert("Error: Blog ID is missing");
      return;
    }

    if (!window.confirm("Are you sure you want to permanently delete this blog? This cannot be undone!")) {
      return;
    }

    deleteMutation.mutate(id, {
      onError: (err) => {
        console.error("Delete error:", err);
        alert("Failed to delete blog: " + err.message);
      },
      onSuccess: (res) => {
        alert(res.data?.message ?? "Blog deleted permanently!");
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: "#3A86FF" }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ minHeight: "70vh", p: 4, textAlign: "center" }}>
        <Typography sx={{ color: "#d32f2f" }}>
          Error loading trash: {error?.message}
        </Typography>
      </Box>
    );
  }

  const blogs = data ?? [];

  return (
    <Box sx={{ minHeight: "70vh", px: { xs: 3, md: 6 }, py: 4 }}>
      <Container>
        <Typography
          variant="h5"
          fontWeight="medium"
          mb={3}
          fontFamily="cursive"
          sx={{ color: "#3A86FF" }}
        >
          Trash
        </Typography>

        {blogs.length === 0 ? (
          <Typography sx={{ color: "#4361EE", textAlign: "center", mt: 4 }}>
            Trash is empty.
          </Typography>
        ) : (
          <Stack direction="row" flexWrap="wrap" justifyContent="flex-start" gap={3}>
            {blogs.map((blog) => (
              <Box
                key={blog.id}
                sx={{
                  width: { xs: "100%", sm: "48%", md: "30%" },
                }}
              >
                <BlogCard
                  blog={blog}
                  restore={() => handleRestore(blog.id)}
                  restoreMutation={restoreMutation}
                  permanentDelete={() => handlePermanentDelete(blog.id)}
                  permanentDeleteMutation={deleteMutation}
                  showReadMore={false}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Trash;