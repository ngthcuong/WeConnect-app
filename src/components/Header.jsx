import { useLogout } from "@hooks/useLogout";
import { useUserInfo } from "@hooks/useUserInfo";
import {
  AccountCircle,
  MenuOpen,
  Notifications,
  Search,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { showDrawer } from "@redux/slices/drawerSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searhQuery, setSearchQuery] = useState("");

  const theme = useTheme();
  const isMoble = useMediaQuery(theme.breakpoints.down("sm"));

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
    <AppBar color="white" position="" className="py-4">
      <Toolbar className="flex !min-h-fit justify-between">
        {!isMoble ? (
          <div className="flex items-center gap-6">
            <div>
              <Link to={"/"}>
                <img src="/weconnect-logo.png" className="h-10" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Search />
              <TextField
                variant="standard"
                placeholder="Search..."
                name="search"
                value={searhQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(
                      `/search/users/${encodeURIComponent(searhQuery?.trim())}`,
                      {
                        state: { searchQuery: searhQuery?.trim() },
                      },
                    );
                  }
                }}
                slotProps={{
                  input: { className: "h-10 px-3 py-2 " },
                  htmlInput: { className: "!p-0" },
                }}
              />
            </div>
          </div>
        ) : (
          <IconButton onClick={() => dispatch(showDrawer())}>
            <MenuOpen />
          </IconButton>
        )}
        <div>
          <IconButton size="small">
            <Search />
          </IconButton>
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
