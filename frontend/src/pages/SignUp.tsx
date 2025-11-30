import { Box, TextField, Stack, Button, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  password: string;
}

interface ApiErrorResponse {
  message?: string;
}

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [formErrors, setFormErrors] = useState("");
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: ["register_user"],
    mutationFn: async (newUser: User) => {
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        newUser,
        { withCredentials: true }
      );
      return response.data;
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<ApiErrorResponse>;
      const message = err.response?.data?.message || "Registration failed.";
      setFormErrors(message);
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors("");

    const newUser: User = {
      firstName,
      lastName,
      username,
      emailAddress,
      password,
    };

    mutate(newUser);
  };

  return (
    <Box
      sx={{
        margin: "4rem auto",
        maxWidth: "500px",
        background: "linear-gradient(145deg, #f5f5f5, #ffffff)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        borderRadius: "20px",
        p: 5,
        textAlign: "center",
      }}
    >
      <form onSubmit={handleSignUp}>
        {formErrors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formErrors}
          </Alert>
        )}

        <Typography variant="h5" fontWeight="600" color="#37474f" mb={3}>
          Join <span style={{ color: "#3A86FF" }}>BlogIt</span>
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ backgroundColor: "#f9f9f9", borderRadius: "10px" }}
          />
          <TextField
            label="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ backgroundColor: "#f9f9f9", borderRadius: "10px" }}
          />
          <TextField
            label="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ backgroundColor: "#f9f9f9", borderRadius: "10px" }}
          />
          <TextField
            label="Email Address"
            type="email"
            required
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            sx={{ backgroundColor: "#f9f9f9", borderRadius: "10px" }}
          />
          <TextField
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ backgroundColor: "#f9f9f9", borderRadius: "10px" }}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={isPending}
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: "12px",
              backgroundColor: "#3A86FF",
              "&:hover": { backgroundColor: "#4361EE" },
              transition: "all 0.3s",
            }}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
        </Stack>
      </form>

      <Typography mt={4} fontSize="0.9rem" color="text.secondary">
        Already have an account?{" "}
        <a
          href="/login"
          style={{
            color: "#3A86FF",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Login here
        </a>
      </Typography>
    </Box>
  );
}

export default SignUp;
