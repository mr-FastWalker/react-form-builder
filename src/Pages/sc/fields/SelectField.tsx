import {FormControl, InputLabel, MenuItem, Select as MuiSelect} from "@mui/material";

interface SelectFieldProps {
  label?: string;
}

export const SelectField = ({label = 'Select field'}: SelectFieldProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <MuiSelect
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label={label}
        value='none'
        disabled
      >
        <MenuItem value='none'>None</MenuItem>
      </MuiSelect>
    </FormControl>
  );
};