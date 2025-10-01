import {useDraggable} from '@dnd-kit/core';
import {useId} from "react";

interface DraggableProps {
  id?: string;
  children: React.ReactNode;
}

export const Draggable = (props: DraggableProps) => {
  const randomId = useId();

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id || randomId,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}