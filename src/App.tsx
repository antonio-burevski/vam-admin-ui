import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/core/ProtectedRoute";
import { AuthenticationForm } from "./components/AuthenticationForm";
import ValidationForm from "./components/ValidationForm";
import { Navbar } from "./components/core/Navbar";
import { AuthProvider } from "./contexts/AuthProvider";
import Account from "./components/core/Account";
import Dashboard from "./components/core/Dashboard";
import Settings from "./components/core/Settings";
import { useAuth } from "./hooks/useAuth";

function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Router>
        {/* ✅ Move AuthProvider here so ALL routes have access to auth */}
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<AuthenticationForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/validate" element={<ValidationForm />} />

            {/* Private Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AuthenticatedApp />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </MantineProvider>
  );
}

const AuthenticatedApp = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  );
};

export default App;
