import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";

interface RadioFieldProps {
  label?: string;
}

export const RadioField = ({label = 'Radio Field'}: RadioFieldProps) => {
  return (
    <FormControl disabled>
      <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={'one'}
      >
        <FormControlLabel value="one" control={<Radio />} label="Option one" />
        <FormControlLabel value="two" control={<Radio />} label="Option two" />
        <FormControlLabel value="three" control={<Radio />} label="Option three" />
      </RadioGroup>
    </FormControl>
  );
};