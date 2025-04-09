import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {MantineProvider} from "@mantine/core";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";
import {AuthenticationForm} from "./components/AuthenticationForm";
import ValidationForm from "./components/ValidationForm";
import {Navbar} from "./components/core/Navbar";
import {AuthProvider} from "./utils/AuthProvider.tsx";
import Account from "./components/core/Account";
import Dashboard from "./components/core/Dashboard";
import Settings from "./components/core/Settings";
import {useAuth} from "./hooks/useAuth";
import Products from "./components/core/Products";
import NotFoundPage from "./utils/NotFoundPage.tsx";
import {Notifications} from "@mantine/notifications";
import '@mantine/notifications/styles.css'

function App() {
    return (
        <MantineProvider defaultColorScheme="dark">
            <Notifications/>
            <Router>
                <AuthProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<AuthenticationForm/>}/>
                        <Route path="/register" element={<RegisterForm/>}/>
                        <Route path="/validate" element={<ValidationForm/>}/>

                        {/* Private Routes */}
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <AuthenticatedApp/>
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback for unknown routes */}
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
        <div style={{display: "flex"}}>
            <Navbar/>
            <Routes>
                <Route path="/dashboard"
                       element={user.permissions.includes("can_view_dashboard") ? <Dashboard/> : <NotFoundPage/>}/>
                <Route path="/products"
                       element={user.permissions.includes("can_view_products") ? <Products/> : <NotFoundPage/>}/>
                <Route path="/account"
                       element={user.permissions.includes("can_view_products") ? <Account/> : <NotFoundPage/>}/>
                <Route path="/settings"
                       element={user.permissions.includes("can_view_settings") ? <Settings/> : <NotFoundPage/>}/>
            </Routes>
        </div>
    );
};

export default App;
