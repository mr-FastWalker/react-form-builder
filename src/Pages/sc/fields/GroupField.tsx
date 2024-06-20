import {Box} from "@mui/material";


export const GroupField = ({children}: any) => {
  return (
    <Box sx={{padding: '16px', borderRadius: '6px', border: '1px solid black', width: '100%'}}>
      {children}
    </Box>
  );
};