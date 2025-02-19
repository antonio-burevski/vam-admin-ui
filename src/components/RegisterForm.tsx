import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Box,
  Stack,
  Title,
  Center,
  Paper,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuthService } from "../api/authApi";

const RegisterForm = () => {
  const { register } = useAuthService(); // Use the register method from the auth service
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.trim().length < 3
          ? "Username must be at least 3 characters"
          : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  // Handle form submission
  const handleSubmit = async (values: typeof form.values) => {
    const response = await register(
      values.username,
      values.email,
      values.password
    );
  
    if (response.success) {
      console.log("Registration successful");
      navigate("/validate", { state: { email: values.email } });
    } else {
      console.error("Registration failed:", response.message);
      alert(response.message);
    }
  };
  
  return (
    <Center style={{ height: "100vh" }}>
      <Paper
        withBorder
        shadow="md"
        p="xl"
        radius="md"
        style={{ maxWidth: 400, width: "100%" }}
      >
        <Box>
          <Title style={{ alignContent: "center" }} mb="lg">
            Register
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Username"
                placeholder="Enter your username"
                required
                {...form.getInputProps("username")}
              />
              <TextInput
                label="Email"
                placeholder="Enter your email"
                type="email"
                required
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                {...form.getInputProps("password")}
              />
              <Group mt="lg">
                <Button
                  variant="outline"
                  color="gray"
                  onClick={() => navigate("/login")}
                >
                  Cancel
                </Button>
                <Button type="submit" color="blue">
                  Register
                </Button>
              </Group>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Center>
  );
};

export default RegisterForm;
