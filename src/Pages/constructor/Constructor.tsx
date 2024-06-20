import { styled } from "@mui/system";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { useState } from "react";
import { Droppable, DroppableRow } from "./Droppable.tsx";
import { SortableItem } from "./SortableItem.tsx";

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
  const [items1, setItems1] = useState(['1', '2', '3']);
  const [items2, setItems2] = useState(['4', '5', '6']);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = items1.includes(active.id) ? 'items1' : 'items2';
    const overContainer = items1.includes(over.id) ? 'items1' : 'items2';

    if (activeContainer === overContainer) {
      const items = activeContainer === 'items1' ? items1 : items2;
      const setItems = activeContainer === 'items1' ? setItems1 : setItems2;
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);

      setItems(arrayMove(items, oldIndex, newIndex));
    } else {
      const activeItems = activeContainer === 'items1' ? items1 : items2;
      const setActiveItems = activeContainer === 'items1' ? setItems1 : setItems2;
      const overItems = overContainer === 'items1' ? items1 : items2;
      const setOverItems = overContainer === 'items1' ? setItems1 : setItems2;

      const oldIndex = activeItems.indexOf(active.id);
      const newIndex = overItems.indexOf(over.id);

      setActiveItems((items) => {
        const newItems = [...items];
        newItems.splice(oldIndex, 1);
        return newItems;
      });

      setOverItems((items) => {
        const newItems = [...items];
        newItems.splice(newIndex, 0, active.id);
        return newItems;
      });
    }
  };

  return (
    <FormContainerStyled>
      Form Constructor
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <Droppable id='001'>
          <SortableContext items={items1} strategy={rectSortingStrategy}>
            {items1.map((item) => (
              <SortableItem key={item} id={item}>
                <Box sx={{ backgroundColor: 'white', borderRadius: '6px', padding: '8px 16px' }}>
                  Item {item}
                </Box>
              </SortableItem>
            ))}
          </SortableContext>
        </Droppable>
        <DroppableRow id='002'>
          <SortableContext items={items2} strategy={rectSortingStrategy}>
            {items2.map((item) => (
              <SortableItem key={item} id={item}>
                <Box sx={{ backgroundColor: 'white', borderRadius: '6px', padding: '8px 16px' }}>
                  Item {item}
                </Box>
              </SortableItem>
            ))}
          </SortableContext>
        </DroppableRow>
      </DndContext>
    </FormContainerStyled>
  );
};
