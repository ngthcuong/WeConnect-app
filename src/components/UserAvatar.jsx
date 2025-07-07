import { useUserInfo } from "@hooks/useUserInfo";
import { Avatar } from "@mui/material";

const UserAvatar = ({ className, isMyAvatar = false, name, src }) => {
  const { fullName, image } = useUserInfo();

  const userName = isMyAvatar ? fullName : name;
  const avatarImage = isMyAvatar ? image : src;

  return (
    <Avatar className={className} src={avatarImage} alt={userName}>
      {userName?.[0]?.toUpperCase()}
    </Avatar>
  );
};
export default UserAvatar;
