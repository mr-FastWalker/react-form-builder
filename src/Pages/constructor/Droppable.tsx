import {useDroppable} from '@dnd-kit/core';
import {Box} from "@mui/material";

export const Droppable = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  return (
    <Box
      className="droppableColumn"
      ref={setNodeRef}
      sx={{
        width: '100%',
        border: '2px solid',
        borderRadius: '6px',
        borderColor: isOver ? 'green' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px',
        margin: '8px 0',
        backgroundColor: 'grey.100',
        minHeight: '60px'
      }}
    >
      {props.children}
    </Box>
  );
};

export const DroppableRow = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  return (
    <Box
      className="droppableRow"
      ref={setNodeRef}
      sx={{
        width: '100%',
        border: '2px solid',
        borderRadius: '6px',
        borderColor: isOver ? 'green' : 'transparent',
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        padding: '8px',
        margin: '8px 0',
        backgroundColor: 'grey.100',
        minHeight: '60px',
        '& > *': {
          flex: '1 1 0',
        },
      }}
    >
      {props.children}
    </Box>
  );
};

export const MultipleDroppables = () => {
  const droppables = ['1', '2', '3', '4'];

  return (
    <section>
      {droppables.map((id) => (
        <Droppable id={id} key={id}>
          Droppable container id: ${id}
        </Droppable>
      ))}
    </section>
  );
};

