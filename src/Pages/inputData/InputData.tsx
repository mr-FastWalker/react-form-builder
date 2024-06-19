import React from 'react';
import {makeFieldsList} from "./utility.ts";
import {mockupInputData} from "./constants.ts";
import {Typography} from "@mui/material";

export const InputData = () => {
  console.log(makeFieldsList(mockupInputData));

  return (
    <div>
      <Typography mb={2}>InputData:</Typography>
      {makeFieldsList(mockupInputData).map(el => <Typography fontSize="12px">{el.type} ; {el.title}</Typography>)}
    </div>
  );
};