import React, { useState } from "react";
import {
  Button,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Box,
} from "@mui/material";
import { Search, PersonAdd, Message, MoreHoriz } from "@mui/icons-material";
import { Link } from "react-router-dom";
import FriendCard from "@components/UserProfile/FriendCard";
import { useGetFriendsByUserIdQuery } from "@services/friendApi";

// Mock data
const friends = [
  {
    _id: "1",
    fullName: "John Doe",
    mutualFriends: 15,
    profileImage: "/api/placeholder/80/80",
    isOnline: true,
    location: "New York, USA",
    friendsSince: "2022-01-15",
  },
  {
    _id: "2",
    fullName: "Jane Smith",
    mutualFriends: 8,
    profileImage: "/api/placeholder/80/80",
    isOnline: false,
    location: "London, UK",
    friendsSince: "2021-05-20",
  },
  {
    _id: "3",
    fullName: "Mike Johnson",
    mutualFriends: 23,
    profileImage: "/api/placeholder/80/80",
    isOnline: true,
    location: "Tokyo, Japan",
    friendsSince: "2023-03-10",
  },
  {
    _id: "4",
    fullName: "Sarah Wilson",
    mutualFriends: 5,
    profileImage: "/api/placeholder/80/80",
    isOnline: false,
    location: "Sydney, Australia",
    friendsSince: "2022-12-01",
  },
  {
    _id: "5",
    fullName: "David Brown",
    mutualFriends: 12,
    profileImage: "/api/placeholder/80/80",
    isOnline: true,
    location: "Toronto, Canada",
    friendsSince: "2021-08-14",
  },
  {
    _id: "6",
    fullName: "Emily Davis",
    mutualFriends: 7,
    profileImage: "/api/placeholder/80/80",
    isOnline: false,
    location: "Berlin, Germany",
    friendsSince: "2023-01-22",
  },
];

const UserFriends = ({ userId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { data, isFetching } = useGetFriendsByUserIdQuery({ userId });

  const filterOptions = [
    { value: "all", label: "All Friends", count: friends.length },
    {
      value: "online",
      label: "Online",
      count: friends.filter((f) => f.isOnline).length,
    },
    { value: "recent", label: "Recently Added", count: 3 },
  ];

  const filteredFriends = friends.filter((friend) => {
    const matchesSearch = friend.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (selectedFilter === "online") {
      return matchesSearch && friend.isOnline;
    }
    if (selectedFilter === "recent") {
      const friendDate = new Date(friend.friendsSince);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return matchesSearch && friendDate > sixMonthsAgo;
    }

    return matchesSearch;
  });

  //   <Card
  //     sx={{
  //       height: "100%",
  //       transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  //       "&:hover": {
  //         transform: "translateY(-4px)",
  //         boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  //       },
  //     }}
  //   >
  //     <CardContent className="p-4">
  //       <div className="flex flex-col items-center text-center">
  //         {/* Avatar with online status */}
  //         <div className="relative mb-3">
  //           <Avatar
  //             src={friend.profileImage}
  //             alt={friend.fullName}
  //             sx={{ width: 80, height: 80, mb: 1 }}
  //           >
  //             {friend.fullName[0].toUpperCase()}
  //           </Avatar>
  //           {friend.isOnline && (
  //             <div className="absolute right-1 bottom-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
  //           )}
  //         </div>

  //         {/* Friend info */}
  //         <Typography variant="h6" className="mb-1 font-semibold">
  //           <Link
  //             to={`/user/${friend._id}`}
  //             className="text-gray-900 no-underline hover:text-blue-600"
  //           >
  //             {friend.fullName}
  //           </Link>
  //         </Typography>

  //         <Typography variant="body2" color="text.secondary" className="mb-2">
  //           {friend.mutualFriends} mutual friends
  //         </Typography>

  //         <Typography variant="caption" color="text.secondary" className="mb-3">
  //           📍 {friend.location}
  //         </Typography>

  //         {/* Action buttons */}
  //         <div className="flex w-full gap-2">
  //           <Button
  //             variant="outlined"
  //             size="small"
  //             startIcon={<Message />}
  //             className="flex-1"
  //             sx={{
  //               textTransform: "none",
  //               borderColor: "#246AA3",
  //               color: "#246AA3",
  //               "&:hover": {
  //                 borderColor: "#246AA3",
  //                 backgroundColor: "rgba(36, 106, 163, 0.04)",
  //               },
  //             }}
  //           >
  //             Message
  //           </Button>
  //           <Button
  //             variant="outlined"
  //             size="small"
  //             sx={{
  //               minWidth: "40px",
  //               padding: "6px",
  //               borderColor: "#e0e0e0",
  //               color: "#666",
  //             }}
  //           >
  //             <MoreHoriz />
  //           </Button>
  //         </div>
  //       </div>
  //     </CardContent>
  //   </Card>
  // );

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          {/* Search */}
          <TextField
            placeholder="Search friends..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            className="max-w-md flex-1"
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Chip
              key={option.value}
              label={`${option.label} (${option.count})`}
              onClick={() => setSelectedFilter(option.value)}
              variant={selectedFilter === option.value ? "filled" : "outlined"}
              sx={{
                backgroundColor:
                  selectedFilter === option.value ? "#246AA3" : "transparent",
                color: selectedFilter === option.value ? "white" : "#246AA3",
                borderColor: "#246AA3",
                "&:hover": {
                  backgroundColor:
                    selectedFilter === option.value
                      ? "#1e5a8a"
                      : "rgba(36, 106, 163, 0.04)",
                },
              }}
            />
          ))}
        </div>
      </div>

      {/* Friends Grid */}
      {filteredFriends.length > 0 ? (
        <Grid container spacing={3}>
          {filteredFriends.map((friend) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={friend._id}>
              <FriendCard friend={friend} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box className="py-12 text-center">
          <Typography variant="h6" color="text.secondary" className="mb-2">
            No friends found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? `No friends match "${searchTerm}"`
              : "No friends to display"}
          </Typography>
        </Box>
      )}

      {/* Load more button (if needed) */}
      {filteredFriends.length >= 12 && (
        <div className="mt-6 text-center">
          <Button
            variant="outlined"
            size="large"
            sx={{
              textTransform: "none",
              borderColor: "#246AA3",
              color: "#246AA3",
              paddingX: 4,
            }}
          >
            Load More Friends
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserFriends;
