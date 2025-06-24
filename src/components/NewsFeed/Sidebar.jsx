import styled from "@emotion/styled";
import {
  AccountCircle,
  HomeOutlined,
  Hub,
  Language,
  Message,
  People,
} from "@mui/icons-material";
import { List, ListSubheader } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const ListStyled = styled("List")`
  padding: 16px 12px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Sidebar = () => {
  return (
    <div className="flex w-64 flex-col gap-4">
      <ListStyled>
        <Link to={"/"}>
          <HomeOutlined className="mr-1" />
          News Feeds
        </Link>
        <Link to={"/messages"}>
          <Message className="mr-1" />
          Messenger
        </Link>
        <Link to={"/friends"}>
          <People className="mr-1" />
          Friends
        </Link>
        <Link to={"/groups"}>
          <Hub className="mr-1" />
          Groups
        </Link>
      </ListStyled>

      <ListStyled>
        <ListSubheader className="mb-2 !px-0 !leading-none font-bold">
          Settings
        </ListSubheader>
        <Link to={"/settings/accounts"}>
          <AccountCircle className="mr-1" />
          Accounts
        </Link>
        <Link to={"/settings/languages"}>
          <Language className="mr-1" />
          Languages
        </Link>
      </ListStyled>
    </div>
  );
};

export default Sidebar;
