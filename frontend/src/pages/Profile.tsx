import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Alert,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import useUser from "../hooks/UseUser";
import { userAPI, authAPI } from "../services/api";
import { AxiosError } from "axios";

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  emailAddress?: string;
}

interface ApiErrorResponse {
  message?: string;
}

function Profile() {
  const user: User | null = useUser();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    emailAddress: user?.emailAddress || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateInfo = async () => {
    if (!user?.id) {
      setError("User ID not found");
      return;
    }

    setLoadingInfo(true);
    setError("");
    setSuccess("");

    try {
      const res = await userAPI.updateProfile(user.id, formData);

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        setSuccess("Info updated successfully!");
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      setError(axiosErr.response?.data?.message || "Failed to update info.");
    } finally {
      setLoadingInfo(false);
    }
  };

  const updatePassword = async () => {
    if (!passwordData.currentPassword) {
      return setError("Please fill in current password.");
    }
    if (!passwordData.newPassword) {
      return setError("Please fill in the new password.");
    }

    setLoadingPassword(true);
    setError("");
    setSuccess("");

    try {
      await authAPI.updatePassword({
        previousPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
      });

      setSuccess("Password updated!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      setError(axiosErr.response?.data?.message || "Incorrect current password.");
    } finally {
      setLoadingPassword(false);
    }
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  return (
    <Box maxWidth="xl" mx="20px" mt={2} mb={3}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Avatar sx={{ bgcolor: "#3A86FF", width: 50, height: 50 }}>
          {initials}
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          Manage Your Account
        </Typography>
      </Box>

      <Stack direction="row" spacing={3} flexWrap="wrap">
        {/* Update Info */}
        <Card
          sx={{
            bgcolor: "#f5f5f5",
            borderRadius: "13px",
            p: 2,
            flex: 1,
            minWidth: 200,
          }}
        >
          <CardContent>
            <Typography variant="h6" mb={1}>
              <SettingsIcon sx={{ mr: 1, color: "#3A86FF" }} />
              Update Info
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInfoChange}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInfoChange}
              />
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInfoChange}
              />
              <TextField
                label="Email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInfoChange}
              />

              <Button
                variant="contained"
                onClick={updateInfo}
                disabled={loadingInfo}
                sx={{
                  backgroundColor: "#3A86FF",
                  "&:hover": { backgroundColor: "#4361EE" },
                  textTransform: "none",
                }}
              >
                {loadingInfo ? "Saving..." : "Save Changes"}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card
          sx={{
            bgcolor: "#f5f5f5",
            borderRadius: "16px",
            p: 2,
            flex: 1,
            minWidth: 300,
          }}
        >
          <CardContent>
            <Typography variant="h6" mb={2} color="#3A86FF">
              🔐 Change Password
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />

              <Button
                variant="contained"
                onClick={updatePassword}
                disabled={loadingPassword}
                sx={{
                  backgroundColor: "#3A86FF",
                  "&:hover": { backgroundColor: "#4361EE" },
                  textTransform: "none",
                }}
              >
                {loadingPassword ? "Updating..." : "Update Password"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export default Profile;
