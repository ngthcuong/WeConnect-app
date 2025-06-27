import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";

export const useDisplayLayout = () => {
  const theme = useTheme();
  const isMoble = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return { isMoble, isTablet };
};
