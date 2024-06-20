import {TextField} from "@mui/material";

interface InputFieldProps {
  label?: string;
}

export const TextareaField = ({label = "Input Field"}: InputFieldProps) => {
  return (
    <TextField label={label} variant="outlined" disabled fullWidth multiline rows={2}/>
  );
};