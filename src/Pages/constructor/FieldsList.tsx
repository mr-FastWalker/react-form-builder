import {Box, Divider, List, ListItem, Typography} from "@mui/material";
import {fieldTypes} from "../sc/constants.ts";
import {Draggable} from "./Draggable.tsx";
import {FieldsListWrapper} from "./styledWrappers.ts";
export const FieldsList = () => {
  return (
    <FieldsListWrapper>
      <Typography variant="h5">List of Fields</Typography>
      <Divider/>
      <List>
        {fieldTypes.map((fieldType) => (
          <ListItem key={fieldType} sx={{ padding: 0, marginBottom: 1 }}>
            <Draggable id={`field-${fieldType}`}>
              <Box sx={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#fff',
                borderRadius: '6px',
                cursor: 'grab',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
                '&:active': {
                  cursor: 'grabbing',
                }
              }}>
                <Typography variant="body2" fontWeight="medium">
                  {fieldType}
                </Typography>
              </Box>
            </Draggable>
          </ListItem>
        ))}
      </List>
    </FieldsListWrapper>
  );
};