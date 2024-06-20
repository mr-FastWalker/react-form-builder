import {Typography} from "@mui/material";

interface TitleFieldProps {
  label?: string;
}

export const TitleField = ({label = 'Title Field'}: TitleFieldProps) => {
  return (
    <Typography sx={{fontSize: '26px', color: 'grey.900'}}>
      {label}
    </Typography>
  );
};