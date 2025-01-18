import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MantineProvider, Title } from "@mantine/core";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthenticationForm } from "./components/AuthenticationForm";
import ValidationForm from "./components/ValidationForm";

function App() {
  return (
    <Router>
      <MantineProvider defaultColorScheme="dark">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<AuthenticationForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/validate" element={<ValidationForm />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Title>Home</Title>
              </ProtectedRoute>
            }
          />
          {/* Add more protected routes as needed */}
        </Routes>
      </MantineProvider>
    </Router>
  );
}

export default App;
