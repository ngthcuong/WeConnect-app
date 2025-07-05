import styled from "@emotion/styled";
import {
  AccountCircle,
  Close,
  HomeOutlined,
  Hub,
  Language,
  Message,
  People,
} from "@mui/icons-material";
import {
  Drawer,
  IconButton,
  List,
  ListSubheader,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { hideDrawer } from "@redux/slices/drawerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ListStyled = styled(List)`
  padding: 16px 12px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SidebarContent = () => {
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

const Sidebar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMoble = useMediaQuery(theme.breakpoints.down("md"));
  const isShowDrawer = useSelector((state) => state.drawer.isDrawerOpen);

  return isMoble ? (
    <Drawer
      open={isShowDrawer}
      onClose={() => dispatch(hideDrawer())}
      classes={{ paper: "p-4 flex flex-col gap-4 bg-[#F8F7FA]" }}
    >
      <div className="flex justify-between">
        <Link to={"/"}>
          <img src="/weconnect-logo.png" className="h-10" />
        </Link>
        <IconButton>
          <Close onClick={() => dispatch(hideDrawer())} />
        </IconButton>
      </div>
      <SidebarContent />;
    </Drawer>
  ) : (
    <SidebarContent />
  );
};

export default Sidebar;
