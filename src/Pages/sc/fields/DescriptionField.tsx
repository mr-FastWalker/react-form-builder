import {Typography} from "@mui/material";

interface DescriptionFieldProps {
  label?: string;
}

export const DescriptionField = ({label = 'description field'}: DescriptionFieldProps) => {
  return (
    <Typography sx={{fontSize: '14px', color: 'grey.700'}}>
      {label}
    </Typography>
  );
};