// import { generateNotificationMessage } from "@libs/utils";
import { Circle, Notifications } from "@mui/icons-material";
import { Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { useGetNotificationsQuery } from "@services/notificationApi";
import React, { useState } from "react";
import NotificationItem from "./NotificationItem";

const NotificationPanel = () => {
  const { data = {} } = useGetNotificationsQuery();
  console.log(data);

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
          {/* <p>{generateNotificationMessage(notification)}</p> */}
          <NotificationItem {...notification} />
          {!notification.seen && (
            <Circle color="primary" className="!ml-2 !h-3 !w-3" />
          )}
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
