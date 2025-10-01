import {useDroppable} from '@dnd-kit/core';
import {Box} from "@mui/material";
import {styled} from "@mui/system";
import {useId} from "react";

const DroppableStyled = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isOver' && prop !== 'showBorder',
    name: 'DroppableStyled',
    slot: 'Root',
})<{isOver: boolean, showBorder?: boolean}>(({ theme, isOver, showBorder = true }) => ({
    width: '100%',
    border: '2px solid',
    borderRadius: '6px',
    borderColor: (isOver && showBorder) ? 'green' : 'transparent',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px',
    margin: '8px 0',
    backgroundColor: theme.palette.grey[100],
    minHeight: '60px'
}));

interface DroppableProps {
    id?: string;
    children: React.ReactNode;
    showBorder?: boolean;
    minHeight?: string;
}
export const Droppable = (props: DroppableProps) => {
  const randomId = useId();
  const { isOver, setNodeRef } = useDroppable({
    id: props.id || randomId,
  });
  return (
    <DroppableStyled
      isOver={isOver}
      showBorder={props.showBorder}
      sx={{ minHeight: props.minHeight || '60px' }}
      className="droppableColumn"
      ref={setNodeRef}
    >
      {props.children}
    </DroppableStyled>
  );
};

// export const DroppableRow = (props) => {
//   const { isOver, setNodeRef } = useDroppable({
//     id: props.id,
//   });
//   return (
//     <Box
//       className="droppableRow"
//       ref={setNodeRef}
//       sx={{
//         width: '100%',
//         border: '2px solid',
//         borderRadius: '6px',
//         borderColor: isOver ? 'green' : 'transparent',
//         display: 'flex',
//         flexDirection: 'row',
//         gap: '8px',
//         padding: '8px',
//         margin: '8px 0',
//         backgroundColor: 'grey.100',
//         minHeight: '60px',
//         '& > *': {
//           flex: '1 1 0',
//         },
//       }}
//     >
//       {props.children}
//     </Box>
//   );
// };
//
// export const MultipleDroppables = () => {
//   const droppables = ['1', '2', '3', '4'];
//
//   return (
//     <section>
//       {droppables.map((id) => (
//         <Droppable id={id} key={id}>
//           Droppable container id: ${id}
//         </Droppable>
//       ))}
//     </section>
//   );
// };

