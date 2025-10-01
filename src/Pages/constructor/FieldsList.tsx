import {styled} from "@mui/system";
import {Box, Divider, List, ListItem, Typography} from "@mui/material";
import {fieldTypes} from "../sc/constants.ts";
import {Draggable} from "./Draggable.tsx";

const FieldsListWrapper = styled(Box, {
  name: 'FieldsListWrapper',
  slot: 'Root',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '300px',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: '#f5f5f5',
  position: 'fixed',
  top: '16px',
  left: '276px',
});
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