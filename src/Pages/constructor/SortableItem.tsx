import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { ReactNode, CSSProperties } from 'react';
import {Box} from "@mui/material";

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

export const SortableItem = (props: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: props.id});

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as const,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging}
      {...attributes}
      {...listeners}
      sx={{
        backgroundColor: 'white',
        borderRadius: '6px',
        padding: '8px 16px',
        border: '1px solid #ddd',
        width: '100%',
      }}
    >
      {props.children}
    </Box>
  );
}