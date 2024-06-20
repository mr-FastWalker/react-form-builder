import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";

interface CheckBoxFieldProps {
  label?: string;
}

export const CheckBoxField = ({label = 'CheckBox Field'}: CheckBoxFieldProps) => {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label={label} disabled />
    </FormGroup>
  );
};