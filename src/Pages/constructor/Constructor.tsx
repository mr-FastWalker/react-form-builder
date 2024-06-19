import React from 'react';
import {styled} from "@mui/system";
import {DndContext} from "@dnd-kit/core";
import {Draggable} from "./Draggable.tsx";
import {Droppable} from "./Droppable.tsx";
import {Box} from "@mui/material";

const FormContainerStyled = styled('div', {
  name: 'FormContainerStyled',
  slot: 'Root',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  maxWidth: '800px',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: '#efefef',
  margin: '36px auto',
  minHeight: '300px',
});

export const Constructor = () => {
  return (
    <FormContainerStyled>
      Form Constructor
      <DndContext>
        <Draggable>
          <Box sx={{ width: '100px', height: '32px', backgroundColor: 'primary.main' }} >Draggable</Box>
        </Draggable>
        <Droppable>
          <Box sx={{ width: '500px', height: '200px', backgroundColor: 'secondary.main' }} >Droppable</Box>
        </Droppable>
      </DndContext>
    </FormContainerStyled>
  );
};