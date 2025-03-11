import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {MantineProvider} from "@mantine/core";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";
import {AuthenticationForm} from "./components/AuthenticationForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthenticationForm } from "./components/AuthenticationForm";
import ValidationForm from "./components/ValidationForm";
import {Navbar} from "./components/core/Navbar";
import {AuthProvider} from "./contexts/AuthProvider";
import Account from "./components/core/Account";
import Dashboard from "./components/core/Dashboard";
import Settings from "./components/core/Settings";
import {useAuth} from "./hooks/useAuth";
import Products from "./components/core/Products";
import NotFoundPage from "./utils/NotFoundPage.tsx";

function App() {
    return (
        <MantineProvider defaultColorScheme="dark">
            <Router>
                <AuthProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<AuthenticationForm/>}/>
                        <Route path="/register" element={<RegisterForm/>}/>
                        <Route path="/validate" element={<ValidationForm/>}/>

                        {/* Private Routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <AuthenticatedApp/>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </AuthProvider>
            </Router>
        </MantineProvider>
    );
}

const AuthenticatedApp = () => {
    const {user} = useAuth();

    if (!user) return null;

  return (
    <>
      <Navbar />
      <Routes>
        {user.permissions.includes("can_view_dashboard") && (
          <Route path="/" element={<Dashboard />} />
        )}

        {user.permissions.includes("can_view_products") && (
          <Route path="/products" element={<Products />} />
        )}

        {user.permissions.includes("can_view_account") && (
          <Route path="/account" element={<Account />} />
        )}

        {user.permissions.includes("can_view_settings") && (
          <Route path="/settings" element={<Settings />} />
        )}
      </Routes>
    </>
  );
};

export default App;
