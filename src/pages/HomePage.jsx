import Header from "@components/Header";
import { Button } from "@mui/material";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import React from "react";
import { useDispatch } from "react-redux";

const HomePage = () => {
  const dispatch = useDispatch();

  const handleShowSnackbar = () => {
    dispatch(showSnackbar({ message: "Show", severity: "error" }));
  };

  return (
    <div>
      <Header />
      <Button variant="contained" color="primary" onClick={handleShowSnackbar}>
        Click
      </Button>
    </div>
  );
};

export default HomePage;
