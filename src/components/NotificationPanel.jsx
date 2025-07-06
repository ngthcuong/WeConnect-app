import { generateNotificationMessage } from "@libs/utils";
import { Circle, Notifications } from "@mui/icons-material";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { useGetNotificationsQuery } from "@services/notificationApi";
import React, { useState } from "react";

const NotificationPanel = () => {
  const { data = {} } = useGetNotificationsQuery();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenNotificationMenu = (event) => {
    setAnchorEl(event.target);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorEl(null);
  };

  const newNotificationsCount =
    (data.notifications || []).filter((not) => !not.seen)?.length || 0;

  const menuAccount = (
    <Menu
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleCloseNotificationMenu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      classes={{ paper: "!min-w-80 !max-h-80 overflow-y-auto" }}
    >
      {(data?.notifications || []).map((notification) => (
        <MenuItem
          key={notification._id}
          className="flex !justify-between"
          onClick={handleCloseNotificationMenu}
        >
          <p>{generateNotificationMessage(notification)}</p>
          {!notification.seen && <Circle fontSize="10px" color="primary" />}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <>
      <IconButton size="small" onClick={handleOpenNotificationMenu}>
        <Badge badgeContent={newNotificationsCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      {menuAccount}
    </>
  );
};

export default NotificationPanel;
