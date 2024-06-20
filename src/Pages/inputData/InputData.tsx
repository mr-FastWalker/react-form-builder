import React from "react";
import {makeFieldsList} from "./utility.ts";
import {mockupInputData} from "./constants.ts";
import {Box, Button, TextField, Typography} from "@mui/material";
import {InputField} from "./types.ts";

interface InputDataProps {
  fieldsList: InputField[];
  setFieldsList: React.Dispatch<React.SetStateAction<InputField[]>>;
}

export const InputData = ({fieldsList, setFieldsList}: InputDataProps) => {
  const mockupList = makeFieldsList(mockupInputData);
  const [rawInputData, setRawInputData] = React.useState<string>(mockupInputData);

  return (
    <Box sx={{padding: '16px'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 0 16px 0'}}>
        <TextField
          label="Input data"
          multiline
          variant="outlined"
          value={rawInputData}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setRawInputData(value);
            setFieldsList(makeFieldsList(value));
          }}
          fullWidth
        />
        <Button onClick={() => {
          setFieldsList(mockupList);
          setRawInputData(mockupInputData);
        }}>Reset</Button>
      </Box>

      {fieldsList.map(el => <Typography key={el.id} fontSize="12px">{el.type} ; {el.title}</Typography>)}
    </Box>
  );
};