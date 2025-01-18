import { Button, Center, Input, Paper, Stack, Text, Title } from "@mantine/core";
import { useLocation } from "react-router-dom";

const ValidationForm = () => {
  const location = useLocation();
  const state = location.state as { email: string };

  const handleOTPSubmit = () => {
    // Handle OTP submission logic
    console.log("OTP submitted");
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Paper withBorder shadow="md" p="xl" radius="md" style={{ maxWidth: 400, width: "100%" }}>
        <Stack>
          <Title order={3}>
            Confirm Your Email
          </Title>
          <Text size="sm">
            An email has been sent to <strong>{state?.email || "your email"}</strong>.
          </Text>
          <Text size="sm">
            Enter the code below to confirm your account.
          </Text>
          <Input name="OTP" placeholder="Enter OTP" size="md" />
          <Button onClick={handleOTPSubmit} fullWidth>
            Submit
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
};

export default ValidationForm;
