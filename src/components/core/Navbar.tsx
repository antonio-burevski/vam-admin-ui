import { useState } from "react";
import { Code, Group } from "@mantine/core";
import { RiDashboard2Line, RiLogoutBoxLine } from "react-icons/ri";
import { GoGraph } from "react-icons/go";
import { IoNewspaper } from "react-icons/io5";
import {
  MdOutlineProductionQuantityLimits,
  MdOutlineDiscount,
  MdOutlineAccountCircle,
  MdOutlineSettings,
} from "react-icons/md";
import { SiBrandfolder } from "react-icons/si";
import { SiEsotericsoftware } from "react-icons/si";
import classes from "../../assets/Navbar.module.css";
import { useAuthService } from "../../api/authApi";

const data = [
  { link: "", label: "Dashboard", icon: RiDashboard2Line },
  { link: "", label: "Page", icon: IoNewspaper },
  { link: "", label: "Products", icon: MdOutlineProductionQuantityLimits },
  { link: "", label: "Discounts", icon: MdOutlineDiscount },
  { link: "", label: "Statistics", icon: GoGraph },
  { link: "", label: "Account", icon: MdOutlineAccountCircle },
  { link: "", label: "Brand", icon: SiBrandfolder },
  { link: "", label: "Settings", icon: MdOutlineSettings },
];

export function Navbar() {
  const [active, setActive] = useState("Dashboard");
//   const { user } = useAuth();
  const { logout } = useAuthService();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hangleLogout = (event: any) => {
    event.preventDefault();
    logout();
  };

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={"1.5"} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <SiEsotericsoftware /> VAM Software
          <Code fw={700}>v3.1.2</Code>
        </Group>
        {/* <Group className={classes.header} justify="space-between">
          <MdAccountCircle /> {user?.username}
        </Group> */}
        {links}
      </div>

      <div className={classes.footer}>
        {/* <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a> */}

        <a
          href="#"
          className={classes.link}
          onClick={(event) => hangleLogout(event)}
        >
          <RiLogoutBoxLine className={classes.linkIcon} stroke={"1.5"} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
