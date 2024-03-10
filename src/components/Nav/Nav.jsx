import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LogOutButton from "../LogOutButton/LogOutButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
// The Header creates links that can be used to navigate
// between routes.
function Nav() {
  const user = useSelector((store) => store.user);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer toggle function
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  // Nav links
  const navLinks = [
    { text: "Home", path: "/home" },
    { text: "About", path: "/about" },
    { text: "Data Grid", path: "/data-grid" },
    { text: "All Dog Cards", path: "/allDogCards" },
    // Conditional authentication links are handled outside of this array
    { text: "Sitter Home", path: "/sitter-home" },
    { text: "Admin Home", path: "/admin-home" },
    { text: "Edit Profile", path: "/user-edit" },
    { text: "Info", path: "/info" },
    { text: "Request Care Form", path: "/requestCareForm" },
    { text: "Volunteer Sitter Form", path: "/volunteerSitterForm" },
  ];
  // Nav bar
  return (
    <AppBar position="static">
      {/* Drawer */}
      <Toolbar>
        {/* Hamburger Menu */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        {/* Drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {/* Drawer List */}
          <List>
            {user.id && (
              <>
                {user.role === "admin" && (
                  <ListItem
                    button
                    component={NavLink}
                    to="/admin-home"
                    onClick={toggleDrawer(false)}
                  >
                    <ListItemText primary="Admin" />
                  </ListItem>
                )}
                {user.role === "raiser" && (
                  <ListItem
                    button
                    component={NavLink}
                    to="/raiser-dog-page"
                    onClick={toggleDrawer(false)}
                  >
                    <ListItemText primary="Raiser" />
                  </ListItem>
                )}
                {user.role === "sitter" && (
                  <ListItem
                    button
                    component={NavLink}
                    to="/sitter-home"
                    onClick={toggleDrawer(false)}
                  >
                    <ListItemText primary="Sitter" />
                  </ListItem>
                )}
              </>
            )}
            {navLinks.map((link) => (
              <ListItem
                key={link.path}
                button
                component={NavLink}
                to={link.path}
                onClick={toggleDrawer(false)}
              >
                <ListItemText primary={link.text} />
              </ListItem>
            ))}
            {user.id && (
              <ListItem button onClick={toggleDrawer(false)}>
                <LogOutButton />
              </ListItem>
            )}
          </List>
        </Drawer>
        <Button color="inherit" component={NavLink} to="/">
          Home
        </Button>
        {!user.id && (
          <>
            <Button color="inherit" component={NavLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={NavLink} to="/registration">
              Register
            </Button>
          </>
        )}
        {user.id && (
          <Button color="inherit" component={NavLink} to="/user">
            Profile
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
