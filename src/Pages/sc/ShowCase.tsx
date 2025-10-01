import {fieldTypes} from "./constants.ts";
import {Box, Grid, Stack, Typography} from "@mui/material";
// import Grid from '@mui/material/Unstable_Grid2';
import {
  CheckBoxField,
  DescriptionField,
  GroupField,
  InputField,
  RadioField,
  SelectField,
  TitleField,
  SubtitleField, TextareaField, DatePickerField
} from "./fields";
import React from "react";

export const ShowCase = () => {


  const getFieldByType = ({type, label}) => {
    switch (type) {
      case 'text':
        return <InputField/>
      case 'group':
        return <GroupField/>
      case 'selector':
        return <SelectField/>
      case 'checkbox':
        return <CheckBoxField/>
      case 'radio':
        return <RadioField/>
      case 'title':
        return <TitleField/>
      case 'subtitle':
        return <SubtitleField/>
      case 'textarea':
        return <TextareaField />
      case 'description':
        return <DescriptionField/>
      case 'list':
        return <div>list</div>
      case 'complex':
        return <div>complex</div>
      case 'datetime':
        return <DatePickerField />
      case 'columnContainer':
        return <Stack direction="column" gap={2}/>
      case 'rowContainer':
        return <Stack direction="row" gap={2}/>
      default:
        return <Typography color='error.main'>{`unknown type "${type}"`}</Typography>
    }
  }

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1024px', margin: '0 auto'}}>
      <Typography variant='h6'>Show Case - list field types:</Typography>
      <Stack direction='column' gap="8px" data-testId='FieldsWrapper' sx={{width: '800px'}}>
        {fieldTypes.map(el =>
          <Stack direction='row' gap={2} key={el}>
            <Box sx={{width: '30%'}}>
              <Typography>{`field: ${el}`}</Typography>
            </Box>
            <Box sx={{width: '100%'}}>
              {getFieldByType({type: el, label: el})}
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  )
};