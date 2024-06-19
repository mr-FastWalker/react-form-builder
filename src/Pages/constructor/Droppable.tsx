import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import {Box} from "@mui/material";

export const Droppable = (props) => {
  const {isOver, setNodeRef} = useDroppable({
    id: 'droppable',
  });
  const style = {

  };


  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{ width: '100%', color: isOver ? 'green' : undefined, }}
    >
      {props.children}
    </Box>
  );
}