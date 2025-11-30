import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { blogAPI } from "../services/api";
import type { Blog } from "@/types/Blog";

interface BlogCardProps {
  blog: Blog;
  onDelete?: (id: string) => void;
  restore?: () => void;
  restoreMutation?: UseMutationResult<AxiosResponse, Error, string, unknown>;
  permanentDelete?: () => void;
  permanentDeleteMutation?: UseMutationResult<AxiosResponse, Error, string, unknown>;
  showReadMore?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onDelete,
  restore,
  restoreMutation,
  permanentDelete,
  permanentDeleteMutation,
  showReadMore = true,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    console.log("📌 BlogCard mounted with blog:", blog);
    console.log("🖼️ Featured Image URL:", blog.featuredImageUrl);
    console.log("👤 Author:", blog.user);
  }, [blog]);

  const initials = `${blog.user?.firstName?.[0] ?? ""}${blog.user?.lastName?.[0] ?? ""}`.toUpperCase();

  const handleSoftDelete = async () => {
    console.log("🗑️ Soft deleting blog ID:", blog.id);
    if (!blog.id) return console.warn("❌ No blog.id provided!");

    try {
      await blogAPI.softDelete(blog.id);
      console.log("✅ Soft delete successful for ID:", blog.id);
      onDelete?.(blog.id);
    } catch (error) {
      console.error("🔥 Soft delete failed:", error);
    }
  };

  const toggleContent = () => setShowFullContent(prev => !prev);

  const previewLength = 150;
  const contentPreview =
    blog.synopsis && blog.synopsis.length > previewLength
      ? blog.synopsis.slice(0, previewLength) + "..."
      : blog.synopsis ?? "";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ddd",
        borderRadius: 2,
        overflow: "hidden",
        height: "100%",
        boxShadow: 3,
        "&:hover": { boxShadow: 6 },
      }}
    >
      {/* Featured Image */}
      {blog.featuredImageUrl && (
        <Box
          component="img"
          src={blog.featuredImageUrl}
          alt={blog.title}
          sx={{ width: "100%", height: 180, objectFit: "cover" }}
        />
      )}

      {/* Blog Content */}
      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {blog.title}
        </Typography>

        <Box mb={2}>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {showFullContent ? blog.synopsis ?? "" : contentPreview}
          </ReactMarkdown>

          {blog.synopsis && blog.synopsis.length > previewLength && (
            <Button size="small" variant="text" onClick={toggleContent} sx={{ mt: 1 }}>
              {showFullContent ? "Show Less" : "Read More"}
            </Button>
          )}
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} mt="auto">
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#1976d2" }}>{initials}</Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {blog.user?.firstName ?? "Unknown"} {blog.user?.lastName ?? ""}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {blog.createdAt ? new Date(blog.createdAt).toDateString() : "No date"}
            </Typography>
          </Box>
        </Stack>

        {/* Action Buttons */}
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          {restore ? (
            <>
              <Button
                onClick={restore}
                variant="contained"
                color="success"
                size="small"
                disabled={restoreMutation?.status === "pending"}
              >
                {restoreMutation?.status === "pending" ? "Restoring..." : "Restore"}
              </Button>

              {permanentDelete && (
                <Button
                  onClick={permanentDelete}
                  variant="contained"
                  color="error"
                  size="small"
                  disabled={permanentDeleteMutation?.status === "pending"}
                >
                  {permanentDeleteMutation?.status === "pending" ? "Deleting..." : "Delete Permanently"}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                component={Link}
                to={`/edit-blog/${blog.id}`}
                variant="contained"
                color="warning"
                size="small"
              >
                Edit
              </Button>

              <Button onClick={handleSoftDelete} variant="contained" color="error" size="small">
                Delete
              </Button>

              {showReadMore && (
                <Button
                  component={Link}
                  to={`/blog/${blog.id}`}
                  variant="contained"
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: "#3A86FF",
                    "&:hover": { backgroundColor: "#265CBF" },
                    textTransform: "none",
                  }}
                >
                  Read More
                </Button>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BlogCard;

