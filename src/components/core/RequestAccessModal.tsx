import { Button, Group, Loader, Modal, Overlay, Select } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useAuthService } from "../../api/authApi";
import { user_permissions } from "../../assets/permissions";

interface RequestAccessModalProps {
  opened: boolean;
  onClose: () => void;
  setNotification: (arg0: { status: boolean; msg: string }) => void;
}

export default function RequestAccessModal({
  opened,
  onClose,
  setNotification,
}: RequestAccessModalProps) {
  const { requestPermission } = useAuthService();
  const [selectedPermission, setSelectedPermission] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!selectedPermission) {
      showNotification({
        color: "red",
        message: "Please select a permission.",
      });
      return;
    }

    setLoading(true);
    const response = await requestPermission(selectedPermission);
    setLoading(false);

    if (response.success) {
      setNotification({
        status: true,
        msg: `Access Granted [${selectedPermission}], please refresh the page`,
      });
      onClose(); // Close modal on success
    } else {
      setNotification({
        status: false,
        msg: `Access Denied [${response.message}]`,
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Request Access" centered>
      <div style={{ position: "relative" }}>
        {loading && (
          <Overlay blur={2} color="white" opacity={0.7} zIndex={1000}>
            <Loader
              size="xl"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </Overlay>
        )}

        <Select
          label="Select Permission"
          placeholder="Pick one"
          data={user_permissions.codename}
          value={selectedPermission}
          onChange={setSelectedPermission}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRequest} loading={loading}>
            Request
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
