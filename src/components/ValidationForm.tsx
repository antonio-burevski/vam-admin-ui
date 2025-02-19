import { useState } from "react";
import { Button, Center, Input, Paper, Stack, Text, Title } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthService } from "../api/authApi";

const ValidationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { email: string } | null;
  const [otp, setOtp] = useState(""); // Controlled OTP input
  const [error, setError] = useState<string | null>(null);

  const { verifyOtp } = useAuthService();  // Use the login method from the auth service
  

  const handleOTPSubmit = async () => {
    if (!otp) {
      setError("Please enter your OTP.");
      return;
    }

    const emailAdd = state?.email;
    if (!emailAdd) {
      setError("There's something wrong with the email address.");
      return;
    }
  
    try {
      const response = await verifyOtp(emailAdd, otp);
  
      // Check if the response status is 200
      if (response.success) {
        console.log("OTP verified successfully");
        navigate("/login"); // Redirect after successful verification
      } else {
        setError("Invalid OTP. Please try again.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };
  

  return (
    <Center style={{ height: "100vh" }}>
      <Paper withBorder shadow="md" p="xl" radius="md" style={{ maxWidth: 400, width: "100%" }}>
        <Stack>
          <Title order={3}>Confirm Your Email</Title>
          <Text size="sm">
            An email has been sent to <strong>{state?.email || "your email"}</strong>.
          </Text>
          <Text size="sm">Enter the code below to confirm your account.</Text>

          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            size="md"
          />

          {error && <Text color="red">{error}</Text>}

          <Button onClick={handleOTPSubmit} fullWidth>
            Submit
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
};

export default ValidationForm;
