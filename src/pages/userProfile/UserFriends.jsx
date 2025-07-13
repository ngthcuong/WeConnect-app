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
import { Search } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import FriendCard from "@components/UserProfile/FriendCard";
import { useGetFriendsByUserIdQuery } from "@services/friendApi";

const UserFriends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { userId } = useParams();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const { data } = useGetFriendsByUserIdQuery(userId);
  console.log(data);

  const friends = data?.friends || [];

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
            slotProps={{
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
