import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Typography,
  Button,
  Stack,
  Box,
  Container,
} from "@mui/material";
import { useBlogStore } from "../store/blogStore";
import { blogAPI } from "../services/api";

// Local sample blogs for lightweight AI
const SAMPLE_BLOGS = [
  {
    title: "The Beauty of Minimalism",
    synopsis: "Discover how minimalism can simplify your life.",
    content: "Minimalism is more than just a style—it's a mindset. It encourages clarity and focus. By reducing clutter, both physical and mental, you can achieve more peace and creativity in your daily life.",
    featuredImageUrl: "https://via.placeholder.com/1024x600.png?text=Minimalism",
  },
  {
    title: "Top 5 Productivity Hacks",
    synopsis: "Boost your productivity with these simple tips.",
    content: "Productivity doesn't mean doing more; it means doing the right things. Track your time, prioritize tasks, and take short breaks. Small consistent improvements lead to big results over time.",
    featuredImageUrl: "https://via.placeholder.com/1024x600.png?text=Productivity",
  },
  {
    title: "Healthy Eating Made Simple",
    synopsis: "Learn easy ways to eat healthy every day.",
    content: "Healthy eating doesn't have to be complicated. Start by including more fruits and vegetables, staying hydrated, and avoiding processed foods. Small changes can make a huge difference in your overall wellbeing.",
    featuredImageUrl: "https://via.placeholder.com/1024x600.png?text=Healthy+Eating",
  },
];

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const addBlog = useBlogStore((state) => state.addBlog);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Lightweight "AI" – pick a random sample blog
  const generateSampleBlog = () => {
    const randomBlog = SAMPLE_BLOGS[Math.floor(Math.random() * SAMPLE_BLOGS.length)];
    setForm({
      title: randomBlog.title,
      synopsis: randomBlog.synopsis,
      content: randomBlog.content,
    });
    // Set preview to sample image
    setImagePreview(randomBlog.featuredImageUrl);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("📎 File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit blog to backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert("Please upload a featured image.");
      return;
    }

    setLoading(true);
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("synopsis", form.synopsis);
      formData.append("content", form.content);
      formData.append("featuredImage", imageFile); // Must match backend: uploadMiddleware.single("featuredImage")
      
      console.log("📤 Submitting blog with:");
      console.log("  - Title:", form.title);
      console.log("  - Image:", imageFile.name);

      const response = await blogAPI.create(formData);
      
      console.log("✅ Response:", response.data);
      
      if (response.status === 201) {
        addBlog(response.data);
        setSuccessMsg("Blog published successfully!");
        setTimeout(() => navigate("/blogs"), 1500);
      }
    } catch (error) {
      console.error("❌ Error creating blog:", error);
      alert("Error creating blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3} color="#3A86FF">
        Create a New Blog
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2, backgroundColor: "#3A86FF", "&:hover": { backgroundColor: "#265CBF" } }}
        onClick={generateSampleBlog}
      >
        Generate Sample Blog
      </Button>

      {successMsg && (
        <Typography sx={{ background: "#d4edda", color: "#155724", padding: "10px", borderRadius: "6px", mb: 2 }}>
          {successMsg}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
        {/* Form */}
        <Box sx={{ flex: 1 }}>
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
                label="Content [Markdown Supported]"
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                fullWidth
                multiline
                minRows={10}
              />

              <Box>
                <Button 
                  variant="contained" 
                  component="label" 
                  sx={{ 
                    textTransform: "none", 
                    backgroundColor: "#4361EE", 
                    "&:hover": { backgroundColor: "#3F51B5" } 
                  }}
                >
                  {imageFile ? `✓ ${imageFile.name}` : "Upload Featured Image"}
                  <input 
                    type="file" 
                    accept="image/*" 
                    hidden 
                    onChange={handleImageChange}
                  />
                </Button>
                {imageFile && (
                  <Typography variant="caption" display="block" sx={{ mt: 1, color: "green" }}>
                    Image ready to upload: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                  </Typography>
                )}
              </Box>

              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                disabled={loading || !imageFile} 
                sx={{ 
                  mt: 2, 
                  backgroundColor: "#3A86FF", 
                  "&:hover": { backgroundColor: "#4361EE" }, 
                  fontWeight: "bold", 
                  textTransform: "none" 
                }}
              >
                {loading ? "Publishing..." : "Publish Blog"}
              </Button>
            </Stack>
          </form>
        </Box>

        {/* Live Preview */}
        <Box sx={{ flex: 1, border: "1px solid #ddd", borderRadius: 2, p: 2, height: "fit-content" }}>
          <Typography variant="h6" mb={2}>Live Preview</Typography>
          {imagePreview && (
            <Box sx={{ mb: 2 }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  width: "100%", 
                  borderRadius: 8, 
                  maxHeight: 300, 
                  objectFit: "cover" 
                }} 
              />
            </Box>
          )}
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {form.title || "Title goes here"}
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.7, mb: 2 }}>
            {form.synopsis || "Synopsis goes here"}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {form.content || "Content goes here"}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default NewBlog;



