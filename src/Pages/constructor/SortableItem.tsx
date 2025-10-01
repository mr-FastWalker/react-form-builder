import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { ReactNode, CSSProperties } from 'react';

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
    <div
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </div>
  );
}