import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

interface DatePickerFieldProps {
  label?: string;
}

export const DatePickerField = ({label = 'DatePicker Field'}: DatePickerFieldProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker disabled label={label} sx={{width: '100%'}}/>
    </LocalizationProvider>
  );
};