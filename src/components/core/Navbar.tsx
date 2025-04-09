import {Button, Group, Notification} from "@mantine/core";
import {useState} from "react";
import {
    MdAccountCircle,
    MdOutlineAccountCircle,
    MdOutlineEmail,
    MdOutlineProductionQuantityLimits,
    MdOutlineSettings,
} from "react-icons/md";
import {RiDashboard2Line, RiLogoutBoxLine} from "react-icons/ri";
import {useAuthService} from "../../api/authApi";
import classes from "../../assets/Navbar.module.css";
import {useAuth} from "../../hooks/useAuth";
import RequestAccessModal from "./RequestAccessModal.tsx";
import {useLocation, useNavigate} from "react-router-dom";

// Define menu items with required permissions
const menuItems = [
    {
        link: "/dashboard",
        label: "Dashboard",
        icon: RiDashboard2Line,
        permission: "can_view_dashboard",
    },
    {
        link: "/products",
        label: "Products",
        icon: MdOutlineProductionQuantityLimits,
        permission: "can_view_products",
    },
    {
        link: "/account",
        label: "Account",
        icon: MdOutlineAccountCircle,
        permission: "can_view_account",
    },
    {
        link: "/settings",
        label: "Settings",
        icon: MdOutlineSettings,
        permission: "can_view_settings",
    },
];

export function Navbar() {
    const {user} = useAuth();
    const {logout} = useAuthService();
    const navigate = useNavigate();
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    const [notification, setNotification] = useState<
        { status: boolean; msg: string } | undefined
    >(undefined);

    const handleLogout = (event: React.MouseEvent) => {
        event.preventDefault();
        logout();
    };

    const renderNotification = () => {
        if (!notification) return null;
        return (
            <Notification
                color={notification.status ? "green" : "red"}
                title={notification.status ? "Success" : "Error"}
            >
                {notification.msg}
            </Notification>
        );
    };

    const filteredMenuItems = menuItems.filter((item) =>
        user?.permissions.includes(item.permission)
    );

    return (
        <>
            {renderNotification()}
            <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                    <Group className={classes.header}>
            <span style={{display: "inline-flex", alignItems: "center"}}>
              <MdAccountCircle style={{margin: "3px"}}/> {user?.username}
            </span>
                        <span style={{display: "inline-flex", alignItems: "center"}}>
              <MdOutlineEmail style={{margin: "3px", paddingTop: "5px"}}/>
              <span>{user?.email}</span>
            </span>
                    </Group>

                    {filteredMenuItems.map((item) => (
                        <a
                            key={item.label}
                            className={classes.link}
                            data-active={location.pathname === item.link || undefined}
                            onClick={(event) => {
                                event.preventDefault();
                                navigate(item.link);
                            }}
                        >
                            <item.icon className={classes.linkIcon} stroke={"1.5"}/>
                            <span>{item.label}</span>
                        </a>
                    ))}

                    <Button
                        fullWidth
                        mt="md"
                        variant="light"
                        onClick={() => setModalOpen(true)}
                    >
                        Request Access
                    </Button>
                </div>

                <div className={classes.footer}>
                    <a href="#" className={classes.link} onClick={handleLogout}>
                        <RiLogoutBoxLine className={classes.linkIcon} stroke={"1.5"}/>
                        <span>Logout</span>
                    </a>
                </div>
            </nav>

            <RequestAccessModal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                setNotification={setNotification}
            />
        </>
    );
}
