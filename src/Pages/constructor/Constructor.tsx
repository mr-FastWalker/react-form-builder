import { styled } from "@mui/system";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {Box, Typography} from "@mui/material";
import { useState } from "react";
import { Droppable } from "./Droppable.tsx";
import { SortableItem } from "./SortableItem.tsx";
import {FieldsList} from "./FieldsList.tsx";
import { FieldData, getFieldByType } from "./utils/fieldRenderer.tsx";
import { fieldTypes } from "../sc/constants.ts";

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
  margin: '0 auto',
  minHeight: '300px',
});

export const Constructor = () => {
  const [formFields, setFormFields] = useState<FieldData[]>([]);
  console.log('formFields', formFields);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<FieldData | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const [lastOverId, setLastOverId] = useState<string | null>(null);
  const [disableDropAnimation, setDisableDropAnimation] = useState<boolean>(false);

  const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const findFieldById = (fields: FieldData[], id: string): FieldData | null => {
    for (const field of fields) {
      if (field.id === id) {
        return field;
      }
      if (field.children) {
        const found = findFieldById(field.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;

    // Показываем плейсхолдер только для новых элементов из списка (начинаются с 'field-')
    if (!active.id.startsWith('field-') || !over) {
      setInsertionIndex(null);
      setLastOverId(null);
      return;
    }

    // Если нет элементов в форме, вставляем в начало
    if (formFields.length === 0) {
      setInsertionIndex(0);
      setLastOverId(over.id);
      return;
    }

    // Стабилизация: меняем позицию только если over.id действительно изменился
    if (over.id === lastOverId) {
      return; // Не обновляем позицию если over тот же
    }

    setLastOverId(over.id);

    // Если над главным контейнером - вставляем в конец
    if (over.id === 'form-constructor') {
      setInsertionIndex(formFields.length);
      return;
    }

    // Если над конкретным элементом - вставляем перед ним
    const overIndex = formFields.findIndex(field => field.id === over.id);
    if (overIndex !== -1) {
      setInsertionIndex(overIndex);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    let addedFromPalette = false;

    if (!over) {
      // If dragging existing field from form constructor and dropping outside, delete it
      if (!active.id.startsWith('field-')) {
        setFormFields(prev => removeFieldById(prev, active.id));
      }
      setActiveId(null);
      setDraggedFieldType(null);
      setActiveField(null);
      setInsertionIndex(null);
      setLastOverId(null);
      return;
    }

    // If dragging from field list (adding new field)
    if (active.id.startsWith('field-')) {
      const fieldType = active.id.replace('field-', '');

      if (fieldTypes.includes(fieldType)) {
        const newField: FieldData = {
          id: generateId(),
          type: fieldType,
          children: ['group', 'columnContainer', 'rowContainer'].includes(fieldType) ? [] : undefined
        };

        if (over.id === 'form-constructor') {
          // Add to the end of the form
          setFormFields(prev => [...prev, newField]);
          addedFromPalette = true;
        } else if (typeof over.id === 'string' && over.id.endsWith('-content')) {
          // Handle dropping into nested containers
          const containerId = over.id.replace('-content', '');
          setFormFields(prev => addFieldToContainer(prev, containerId, newField));
          addedFromPalette = true;
        } else {
          // Use insertionIndex for precise positioning
          if (insertionIndex !== null) {
            setFormFields(prev => {
              const newFields = [...prev];
              newFields.splice(insertionIndex, 0, newField);
              return newFields;
            });
            addedFromPalette = true;
          } else {
            // Fallback: Handle dropping near existing fields
            const targetPath = findFieldPath(formFields, over.id);
            if (targetPath) {
              setFormFields(prev => addFieldToPath(prev, targetPath, newField));
              addedFromPalette = true;
            }
          }
        }
      }
    } else {
      // Handle reordering/moving existing fields
      if (typeof over.id === 'string' && over.id.endsWith('-content')) {
        const containerId = over.id.replace('-content', '');
        setFormFields(prev => moveFieldToContainer(prev, active.id, containerId));
      } else if (active.id !== over.id) {
        // Check if it's a simple top-level reorder
        const activeIndex = formFields.findIndex(field => field.id === active.id);
        const overIndex = formFields.findIndex(field => field.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
          // Both are top-level fields
          setFormFields(prev => arrayMove(prev, activeIndex, overIndex));
        } else {
          // Handle complex hierarchy movement
          setFormFields(prev => moveFieldWithinHierarchy(prev, active.id, over.id));
        }
      }
    }

    if (addedFromPalette) {
      // Disable return animation when a new element from the Fields List was successfully added
      setDisableDropAnimation(true);
    }

    setActiveId(null);
    setDraggedFieldType(null);
    setActiveField(null);
    setInsertionIndex(null);
    setLastOverId(null);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    // Reset drop animation control at the start of each drag
    setDisableDropAnimation(false);

    if (event.active.id.startsWith('field-')) {
      // Dragging from field list
      setDraggedFieldType(event.active.id.replace('field-', ''));
      setActiveField(null);
    } else {
      // Dragging existing field in form
      const field = findFieldById(formFields, event.active.id);
      setActiveField(field);
      setDraggedFieldType(field?.type || null);
    }
  };

  const findFieldPath = (fields: FieldData[], targetId: string): number[] | null => {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].id === targetId) {
        return [i];
      }
      if (fields[i].children) {
        const childPath = findFieldPath(fields[i].children!, targetId);
        if (childPath) {
          return [i, ...childPath];
        }
      }
    }
    return null;
  };

  const addFieldToPath = (fields: FieldData[], path: number[], newField: FieldData): FieldData[] => {
    const newFields = [...fields];
    let current = newFields;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].children!;
    }

    current.splice(path[path.length - 1] + 1, 0, newField);
    return newFields;
  };

  const addFieldToContainer = (fields: FieldData[], containerId: string, newField: FieldData): FieldData[] => {
    const updateField = (field: FieldData): FieldData => {
      if (field.id === containerId) {
        return {
          ...field,
          children: [...(field.children || []), newField]
        };
      }

      if (field.children) {
        return {
          ...field,
          children: field.children.map(updateField)
        };
      }

      return field;
    };

    return fields.map(updateField);
  };

  const removeFieldById = (fields: FieldData[], fieldId: string): FieldData[] => {
    return fields.filter(field => {
      if (field.id === fieldId) {
        return false;
      }

      if (field.children) {
        field.children = removeFieldById(field.children, fieldId);
      }

      return true;
    });
  };

  const moveFieldWithinHierarchy = (fields: FieldData[], activeId: string, overId: string): FieldData[] => {
    const findFieldAndParent = (fields: FieldData[], targetId: string, parent: FieldData | null = null): { field: FieldData; parent: FieldData | null; index: number } | null => {
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].id === targetId) {
          return { field: fields[i], parent, index: i };
        }
        if (fields[i].children) {
          const result = findFieldAndParent(fields[i].children!, targetId, fields[i]);
          if (result) return result;
        }
      }
      return null;
    };

    const activeData = findFieldAndParent(fields, activeId);
    const overData = findFieldAndParent(fields, overId);

    if (!activeData || !overData) return fields;

    let newFields = removeFieldById(fields, activeId);

    if (!overData.parent) {
      const overIndex = newFields.findIndex(f => f.id === overId);
      newFields.splice(overIndex + 1, 0, activeData.field);
    } else {
      const updateParent = (field: FieldData): FieldData => {
        if (field.id === overData.parent!.id) {
          const children = [...(field.children || [])];
          const overIndex = children.findIndex(f => f.id === overId);
          children.splice(overIndex + 1, 0, activeData.field);
          return { ...field, children };
        }

        if (field.children) {
          return { ...field, children: field.children.map(updateParent) };
        }

        return field;
      };

      newFields = newFields.map(updateParent);
    }

    return newFields;
  };

  const moveFieldToContainer = (fields: FieldData[], activeId: string, containerId: string): FieldData[] => {
    // Remove the active field from its current location and return it
    const removeAndGet = (nodes: FieldData[]): { updated: FieldData[]; removed: FieldData | null } => {
      let removed: FieldData | null = null;
      const updated = nodes
        .map(node => {
          if (node.id === activeId) {
            removed = node;
            return null as any;
          }
          if (node.children && node.children.length > 0) {
            const res = removeAndGet(node.children);
            if (res.removed) removed = res.removed;
            return { ...node, children: res.updated };
          }
          return node;
        })
        .filter(Boolean) as FieldData[];
      return { updated, removed };
    };

    const { updated, removed } = removeAndGet(fields);
    if (!removed) return fields; // nothing to move

    const appendToContainer = (node: FieldData): FieldData => {
      if (node.id === containerId) {
        const children = [...(node.children || []), removed!];
        return { ...node, children };
      }
      if (node.children && node.children.length > 0) {
        return { ...node, children: node.children.map(appendToContainer) };
      }
      return node;
    };

    return updated.map(appendToContainer);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <Box sx={{position: 'relative'}}>
        <FieldsList/>

        <FormContainerStyled>
          <Typography variant="h5">Form Constructor</Typography>

          <Droppable
            id='form-constructor'
            showBorder={formFields.length === 0}
            minHeight='600px'
          >
            {formFields.length === 0 ? (
              <Box sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: '1.1rem',
                padding: 4,
              }}>
                Drag fields from the list to start building your form
              </Box>
            ) : (
              <SortableContext items={formFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                {formFields.map((field, index) => (
                  <div key={field.id}>
                    {/* Плейсхолдер вставки перед элементом */}
                    {insertionIndex === index && (
                      <Box sx={{
                        height: '4px',
                        backgroundColor: '#2196f3',
                        borderRadius: '2px',
                        margin: '4px 0',
                        opacity: 0.8,
                        boxShadow: '0 0 8px rgba(33, 150, 243, 0.3)'
                      }} />
                    )}
                    <SortableItem id={field.id}>
                      <Box sx={{
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        border: '1px solid #ddd'
                      }}>
                        {getFieldByType(field.type, field)}
                      </Box>
                    </SortableItem>
                  </div>
                ))}
                {/* Плейсхолдер вставки в конец списка */}
                {insertionIndex === formFields.length && (
                  <Box sx={{
                    height: '4px',
                    backgroundColor: '#2196f3',
                    borderRadius: '2px',
                    margin: '4px 0',
                    opacity: 0.8,
                    boxShadow: '0 0 8px rgba(33, 150, 243, 0.3)'
                  }} />
                )}
              </SortableContext>
            )}
          </Droppable>
        </FormContainerStyled>

        <DragOverlay dropAnimation={disableDropAnimation ? null : undefined}>
          {activeId ? (
            <Box sx={{
              backgroundColor: 'white',
              borderRadius: '6px',
              padding: '8px 16px',
              border: '2px solid #2196f3',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
              opacity: 0.95,
              pointerEvents: 'none',
              zIndex: 1000,
              minHeight: 'auto',
              // Если перетаскиваем новый элемент из списка - компактная ширина
              // Если перетаскиваем существующий элемент - полная ширина формы
              ...(activeField ? {
                maxWidth: '768px',
                width: '768px'
              } : {
                maxWidth: '300px',
                width: 'fit-content'
              })
            }}>
              {activeField && activeField.type ?
                getFieldByType(activeField.type, activeField) :
                (draggedFieldType ? getFieldByType(draggedFieldType) :
                  <Box>Dragging...</Box>
                )
              }
            </Box>
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};
