import { useState } from "react";
import {
  Box,
  TextField,
  Stack,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { AxiosError } from "axios";

interface LoginDetails {
  identifier: string;
  password: string;
}

interface LoginResponse {
  user: { firstName: string; lastName: string; [key: string]: unknown };
  token?: string;
}

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation<LoginResponse, AxiosError, LoginDetails>({
    mutationFn: async (loginDetails: LoginDetails) => {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/login",
        loginDetails
      );
      return response.data;
    },
    onError: (err: AxiosError) => {
      const msg =
        (err.response?.data as { message?: string })?.message ||
        "Unknown error occurred";
      setFormErrors(msg);
    },
    onSuccess: (data) => {
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) localStorage.setItem("token", data.token);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      navigate("/userPage");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors("");
    mutation.mutate({ identifier, password });
  };

  const isLoading = mutation.status === "pending";

  return (
    <Box
      component="section"
      sx={{
        margin: "4rem auto",
        maxWidth: "500px",
        background: "#E0F7FF", // soft light blue background
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        borderRadius: "20px",
        p: 5,
        textAlign: "center",
      }}
    >
      <form onSubmit={handleLogin}>
        {formErrors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formErrors}
          </Alert>
        )}

        <Typography
          variant="h5"
          fontWeight="600"
          color="#3A86FF"
          mb={3}
          fontFamily="cursive"
        >
          Welcome back to <span style={{ color: "#4361EE" }}>BlogIt</span>
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Username or Email"
            required
            fullWidth
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            sx={{ backgroundColor: "#f0f8ff", borderRadius: "10px" }}
          />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: "#f0f8ff", borderRadius: "10px" }}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: "24px",
              backgroundColor: "#4361EE",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "#3F51B5",
              },
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Stack>
      </form>

      <Typography mt={4} fontSize="0.9rem" color="text.secondary">
        No account?{" "}
        <Link
          to="/signUp"
          style={{
            color: "#4361EE",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Create one
        </Link>
      </Typography>
    </Box>
  );
}

export default Login;
