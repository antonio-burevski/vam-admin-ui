import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import classes from "../assets/Login.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthService } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";

export function AuthenticationForm() {
  const navigate = useNavigate();
  const { login } = useAuthService();
  const { getUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async () => {
    const success = await login(username, password);
    if (success) {
      await getUser(); // Ensure user data is loaded before navigation
      navigate("/"); // Now navigate only after user is set
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome! Please Login to continue.
        </Title>

        {/* username Input */}
        <TextInput
          label="Username"
          placeholder="hello@gmail.com"
          size="md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password Input */}
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Remember me Checkbox */}
        <Checkbox
          label="Keep me logged in"
          mt="xl"
          size="md"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />

        {/* Error message */}
        {error && (
          <Text size="sm" mt="md">
            {error}
          </Text>
        )}

        {/* Submit Button */}
        <Button fullWidth mt="xl" size="md" onClick={handleSubmit}>
          Login
        </Button>

        {/* Register link */}
        <Text ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor<"a"> href="#" fw={700} onClick={() => navigate("/register")}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
