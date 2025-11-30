import { useQuery } from "@tanstack/react-query";
import { getBlogs, softDeleteBlog } from "../services/api";
import BlogCard from "../components/BlogCard";
import { Box, Container, Typography, CircularProgress, Stack } from "@mui/material";
import type { Blog } from "../types/Blog";

const Blogs = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  const blogs: Blog[] = data?.data ?? [];

  const handleDelete = async (id: string) => {
    try {
      await softDeleteBlog(id);
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  if (isLoading)
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress sx={{ color: "#3A86FF" }} />
      </Box>
    );

  if (isError)
    return (
      <Box sx={{ minHeight: "70vh", p: 4, textAlign: "center" }}>
        <Typography sx={{ color: "#d32f2f" }}>Failed to fetch blogs.</Typography>
      </Box>
    );

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
          All Blogs
        </Typography>

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
                onDelete={() => handleDelete(blog.id)}
                showReadMore={true}
              />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Blogs;


