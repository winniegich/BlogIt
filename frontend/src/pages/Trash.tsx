import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { userAPI, blogAPI } from "../services/api";

type Blog = {
  id: string;
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  createdAt: string;
};

function Trash() {
  const [trashedBlogs, setTrashedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchTrash = async () => {
      try {
        const res = await userAPI.getTrash();
        setTrashedBlogs(res.data);
      } catch (error) {
        console.error("Failed to fetch trash:", error);
      }
    };

    fetchTrash();
  }, []);

  const handleRecover = async (id: string) => {
    try {
      await blogAPI.recover(id);
      setTrashedBlogs((prev) => prev.filter((blog) => blog.id !== id));
      alert("Blog recovered successfully!");
    } catch (error) {
      console.error("Failed to recover blog:", error);
      alert("Failed to recover blog");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;

    try {
      await blogAPI.permanentDelete(id);
      setTrashedBlogs((prev) => prev.filter((blog) => blog.id !== id));
      alert("Blog permanently deleted");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        backgroundImage: "linear-gradient(to right, white, white)",
        px: 4,
        py: 4,
      }}
    >
      <Container>
        <Typography
          variant="h5"
          fontWeight="medium"
          mb={3}
          fontFamily="cursive"
          color="black"
        >
          🗑️ Trash
        </Typography>

        {trashedBlogs.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Your trash is empty.
          </Typography>
        ) : (
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={3}
            useFlexGap
            justifyContent="flex-start"
          >
            {trashedBlogs.map((blog) => {
              const date = new Date(blog.createdAt).toLocaleDateString("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <Box
                  key={blog.id}
                  sx={{ width: { xs: "100%", sm: "48%", md: "30%" } }}
                >
                  <Card sx={{ height: "100%", opacity: 0.9 }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={blog.featuredImageUrl}
                      alt={blog.title}
                    />
                    <CardContent>
                      <Typography variant="h6">{blog.title}</Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {blog.synopsis}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={2}
                        display="block"
                      >
                        Deleted on {date}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleRecover(blog.id)}
                      >
                        Recover
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handlePermanentDelete(blog.id)}
                      >
                        Delete Forever
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default Trash;
