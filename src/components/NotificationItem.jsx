import TimeAgo from "@components/TimeAgo";
import UserAvatar from "@components/UserAvatar";

const NotificationItem = (notification) => {
  if (notification.like)
    return (
      <div className="flex items-center gap-1">
        <UserAvatar
          name={notification.author?.fullName}
          src={notification.author?.image}
        />
        <div>
          <div>
            <p className="inline-block font-semibold">
              {notification.author?.fullName}
            </p>{" "}
            liked a post
          </div>
          <TimeAgo
            date={notification.createdAt}
            className="text-dark-400 -mt-[1px] text-xs"
          />
        </div>
      </div>
    );
  if (notification.comment)
    return (
      <div className="flex items-center gap-1">
        <UserAvatar
          name={notification.author?.fullName}
          src={notification.author?.image}
        />
        <div>
          <div>
            <p className="inline-block font-semibold">
              {notification.author?.fullName}
            </p>{" "}
            commented a post
          </div>
          <TimeAgo
            date={notification.createdAt}
            className="text-dark-400 -mt-[1px] text-xs"
          />
        </div>
      </div>
    );

  if (notification.message)
    return (
      <div className="flex items-center gap-1">
        <UserAvatar
          name={notification.author?.fullName}
          src={notification.author?.image}
        />
        <div>
          <div>
            <p className="inline-block font-semibold">
              {notification.author?.fullName}
            </p>{" "}
            sent you a message
          </div>
          <TimeAgo
            date={notification.createdAt}
            className="text-dark-400 -mt-[1px] text-xs"
          />
        </div>
      </div>
    );

  return "";
};

export default NotificationItem;
