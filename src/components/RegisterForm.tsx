import {useForm} from "@mantine/form";
import {Box, Button, Center, Group, Paper, PasswordInput, Stack, TextInput, Title,} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {useNavigate} from "react-router-dom";
import {useAuthService} from "../api/authApi";

const RegisterForm = () => {
    const {register} = useAuthService();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validate: {
            username: (value) =>
                value.trim().length < 3
                    ? "Username must be at least 3 characters"
                    : null,
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email address",
            password: (value) => {
                if (value.length < 8) {
                    return "Password must be at least 8 characters";
                }
                if (!/[a-z]/.test(value)) {
                    return "Password must include at least one lowercase letter";
                }
                if (!/[A-Z]/.test(value)) {
                    return "Password must include at least one uppercase letter";
                }
                if (!/\d/.test(value)) {
                    return "Password must include at least one number";
                }
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    return "Password must include at least one special character";
                }
                return null;
            },
            confirmPassword: (value, values) =>
                value !== values.password ? "Passwords do not match" : null,
        },
    });

    const handleSubmit = async ({
                                    username,
                                    email,
                                    password,
                                }: typeof form.values) => {
        const response = await register(username, email, password);

        if (response.success) {
            notifications.show({
                title: "Registration Successful",
                message: "Check your email for OTP verification.",
                color: "green",
                autoClose: 5000,
                position: "top-right",
            });
            navigate("/validate", {state: {email}});
        } else {
            notifications.show({
                title: "Registration Failed",
                message: response.message || "An error occurred. Please try again.",
                color: "red",
                autoClose: 5000,
                position: "top-right",
            });
        }
    };

    return (
        <Center style={{height: "100vh"}}>
            <Paper
                withBorder
                shadow="md"
                p="xl"
                radius="md"
                style={{maxWidth: 400, width: "100%"}}
            >
                <Box>
                    <Title mb="lg">Register</Title>
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
                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                required
                                {...form.getInputProps("confirmPassword")}
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
