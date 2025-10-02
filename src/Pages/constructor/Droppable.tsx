import {useDroppable} from '@dnd-kit/core';
import {useId} from "react";
import {DroppableStyled} from "./styledWrappers.ts";

interface DroppableProps {
    id?: string;
    children: React.ReactNode;
    showBorder?: boolean;
    minHeight?: string;
    sx?: object;
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
      sx={{ minHeight: props.minHeight || '60px', ...props.sx }}
      data-testId="droppableItem"
      ref={setNodeRef}
    >
      {props.children}
    </DroppableStyled>
  );
};

