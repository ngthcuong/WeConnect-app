import { useLogout } from "@hooks/useLogout";
import { useUserInfo } from "@hooks/useUserInfo";
import { AccountCircle, Notifications, Search } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
} from "@mui/material";
import React, { useState } from "react";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const userInfo = useUserInfo();
  const handleLogout = useLogout();

  const handleOpenMenuAccount = (event) => {
    setAnchorEl(event.target);
  };

  const handleCloseMenuAccount = () => {
    setAnchorEl(null);
  };

  const menuAccount = (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleCloseMenuAccount}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  return (
    <AppBar color="white" position="sticky" className="py-4">
      <Toolbar className="flex !min-h-fit justify-between">
        <div className="flex items-center gap-6">
          <div>
            <img src="/weconnect-logo.png" className="h-10" />
          </div>
          <div className="flex items-center gap-2">
            <Search />
            <TextField
              variant="standard"
              placeholder="Search..."
              name="search"
              slotProps={{
                input: { className: "h-10 px-3 py-2 " },
                htmlInput: { className: "!p-0" },
              }}
            />
          </div>
        </div>
        <div>
          <IconButton size="small">
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton onClick={handleOpenMenuAccount} size="small">
            {/* <AccountCircle /> */}
            <Avatar className="!bg-[#246AA3]">
              {userInfo.fullName?.[0].toUpperCase()}
            </Avatar>
          </IconButton>
        </div>
      </Toolbar>
      {menuAccount}
    </AppBar>
  );
};

export default Header;
