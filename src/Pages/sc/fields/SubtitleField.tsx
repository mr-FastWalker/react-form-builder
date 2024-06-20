import {Typography} from "@mui/material";

interface SubtitleFieldProps {
  label?: string;
}

export const SubtitleField = ({label = 'Subtitle Field'}: SubtitleFieldProps) => {
  return (
    <Typography sx={{fontSize: '22px', color: 'grey.900'}}>
      {label}
    </Typography>
  );
};