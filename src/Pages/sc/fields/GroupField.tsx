import { Box } from "@mui/material";
import { ReactNode } from "react";

interface GroupFieldProps {
  children: ReactNode;
}

export const GroupField = ({ children }: GroupFieldProps) => {
  return (
    <Box
      data-testId="group-field"
      sx={{
        borderRadius: '6px',
        border: '1px solid black',
        width: '100%'
      }}
    >
      {children}
    </Box>
  );
};