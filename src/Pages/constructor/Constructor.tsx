import { DndContext, DragOverlay, pointerWithin, DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {Box, Typography, Button, Stack} from "@mui/material";
import { useState, useRef, ChangeEvent } from "react";
import { Droppable } from "./Droppable.tsx";
import { SortableItem } from "./SortableItem.tsx";
import {FieldsList} from "./FieldsList.tsx";
import { FieldData, getFieldByType } from "./utils/fieldRenderer.tsx";
import { fieldTypes } from "../sc/constants.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setFormFields as setFormFieldsAction } from "./constructorSlice";
import {
  DraggingWrapper,
  EmptyDropAria,
  FormContainerStyled,
  FormHeader,
  PlaceholderForInsert
} from "./styledWrappers.ts";
import { v4 as uuidv4 } from "uuid";

export const Constructor = () => {
  const dispatch = useAppDispatch();
  const formFields = useAppSelector(state => state.constructor.formFields ?? []);
  console.log('formFields', formFields);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedFieldType, setDraggedFieldType] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<FieldData | null>(null);
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
  const [lastOverId, setLastOverId] = useState<string | null>(null);
  const [disableDropAnimation, setDisableDropAnimation] = useState<boolean>(false);

  // File save/load
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    // Плейсхолдер только для новых элементов из списка (id начинается с 'field-')
    if (!active.id.toString().startsWith('field-') || !over) {
      setInsertionIndex(null);
      setLastOverId(null);
      return;
    }

    // Если форма пустая — вставляем в начало
    if (formFields.length === 0) {
      setInsertionIndex(0);
      setLastOverId(over.id.toString());
      return;
    }

    // Если над главным контейнером — вставляем в конец ТОЛЬКО если до этого были над последним item
    if (over.id === 'form-constructor') {
      const lastId = formFields[formFields.length - 1]?.id;
      // Разрешаем «в конец» только при уходе курсора с последнего элемента вниз
      if (lastOverId === lastId) {
        setInsertionIndex(formFields.length);
      }
      // Не обновляем lastOverId на контейнер, чтобы сохранить контекст последнего item
      return;
    }

    // Стабилизация: не пересчитываем, если over не поменялся
    if (over.id === lastOverId) return;

    // Если над конкретным элементом — вставляем ПЕРЕД ним
    setLastOverId(over.id.toString());

    const overIndex = formFields.findIndex(field => field.id === over.id);
    if (overIndex !== -1) {
      setInsertionIndex(overIndex);
    } else {
      // Фолбэк на случай, если over не совпал ни с одним id (редко)
      setInsertionIndex(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    let addedFromPalette = false;

    if (!over) {
      // If dragging existing field from form constructor and dropping outside, delete it
      if (!active.id.toString().startsWith('field-')) {
        dispatch(setFormFieldsAction(removeFieldById(formFields, active.id.toString())));
      }
      setActiveId(null);
      setDraggedFieldType(null);
      setActiveField(null);
      setInsertionIndex(null);
      setLastOverId(null);
      return;
    }

    // If dragging from field list (adding new field)
    if (active.id.toString().startsWith('field-')) {
      const fieldType = active.id.toString().replace('field-', '');

      if (fieldTypes.includes(fieldType)) {
        const newField: FieldData = {
          id: generateId(),
          type: fieldType,
          recordId: uuidv4(),
          children: ['group', 'columnContainer', 'rowContainer'].includes(fieldType) ? [] : undefined
        };

        if (over.id === 'form-constructor') {
          // Add to the end of the form
          dispatch(setFormFieldsAction([...(formFields || []), newField]));
          addedFromPalette = true;
        } else if (typeof over.id === 'string' && over.id.endsWith('-content')) {
          // Handle dropping into nested containers
          const containerId = over.id.replace('-content', '');
          dispatch(setFormFieldsAction(addFieldToContainer(formFields, containerId, newField)));
          addedFromPalette = true;
        } else {
          // Use insertionIndex for precise positioning
          if (insertionIndex !== null) {
            const newFields = [...(formFields || [])];
            newFields.splice(insertionIndex, 0, newField);
            dispatch(setFormFieldsAction(newFields));
            addedFromPalette = true;
          } else {
            // Fallback: Handle dropping near existing fields
            const targetPath = findFieldPath(formFields, over.id.toString());
            if (targetPath) {
              dispatch(setFormFieldsAction(addFieldToPath(formFields, targetPath, newField)));
              addedFromPalette = true;
            }
          }
        }
      }
    } else {
      // Handle reordering/moving existing fields
      if (typeof over.id === 'string' && over.id.endsWith('-content')) {
        const containerId = over.id.replace('-content', '');
        dispatch(setFormFieldsAction(moveFieldToContainer(formFields, active.id.toString(), containerId)));
      } else if (active.id !== over.id) {
        // Check if it's a simple top-level reorder
        const activeIndex = formFields.findIndex(field => field.id === active.id);
        const overIndex = formFields.findIndex(field => field.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
          // Both are top-level fields
          dispatch(setFormFieldsAction(arrayMove(formFields, activeIndex, overIndex)));
        } else {
          // Handle complex hierarchy movement
          dispatch(setFormFieldsAction(moveFieldWithinHierarchy(formFields, active.id.toString(), over.id.toString())));
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
    // Reset drop animation control at the start of each drag
    setDisableDropAnimation(false);

    if (event.active.id.toString().startsWith('field-')) {
      // Dragging from field list
      setDraggedFieldType(event.active.id.toString().replace('field-', ''));
      setActiveField(null);
    } else {
      // Dragging existing field in form
      const field = findFieldById(formFields, event.active.id.toString());
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

  const removeFieldById = (fields: FieldData[], fieldId: string): FieldData[] =>
    fields.reduce<FieldData[]>((acc, field) => {
      if (field.id === fieldId) return acc;
      if (field.children) {
        const nextChildren = removeFieldById(field.children, fieldId);
        acc.push(nextChildren === field.children ? field : { ...field, children: nextChildren });
      } else {
        acc.push(field);
      }
      return acc;
    }, []);

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
            return null;
          }
          if (node.children && node.children?.length > 0) {
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

  const handleSaveToFile = () => {
    const data = JSON.stringify(formFields ?? [], null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0,19).replace(/[:T]/g, '-');
    const a = document.createElement('a');
    a.href = url;
    a.download = `formFields-${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadFromFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          dispatch(setFormFieldsAction(parsed));
        } else {
          alert('Invalid file format. Expected a JSON array of fields.');
        }
      } catch (err) {
        console.error('Failed to parse JSON file', err);
        alert('Failed to parse JSON file.');
      } finally {
        // reset the input so the same file can be picked again
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <Box sx={{position: 'relative'}}>
        <FieldsList/>

        <FormContainerStyled>
          <FormHeader>
            <Typography variant="h5">Form Constructor</Typography>

            <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
              <Button variant="contained" size='small' onClick={handleSaveToFile} disabled={!formFields || formFields.length === 0}>Save to file</Button>
              <Button variant="outlined" size='small' onClick={handleLoadFromFileClick}>Load from file</Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Stack>
          </FormHeader>

          <Droppable
            id='form-constructor'
            showBorder={formFields.length === 0}
            minHeight='600px'
          >
            {formFields.length === 0 ? (
              <EmptyDropAria>
                Drag fields from the list to start building your form
              </EmptyDropAria>
            ) : (
              <SortableContext id='sortable-context' items={formFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                {formFields.map((field, index) => (
                  <div key={field.id} id={`field-wrapper-${field.id}`} >
                    {insertionIndex === index && (
                      <PlaceholderForInsert />
                    )}
                    <SortableItem id={field.id}>
                      {getFieldByType(field.type, field)}
                    </SortableItem>
                  </div>
                ))}
                {insertionIndex === formFields.length && (
                  <PlaceholderForInsert />
                )}
              </SortableContext>
            )}
          </Droppable>
        </FormContainerStyled>

        <DragOverlay dropAnimation={disableDropAnimation ? null : undefined}>
          {activeId ? (
            <DraggingWrapper activeField={Boolean(activeField)}>
              {activeField && activeField.type
                ? getFieldByType(activeField.type, activeField)
                : (draggedFieldType
                    ? getFieldByType(draggedFieldType)
                    : <Box>Dragging...</Box>
                )
              }
            </DraggingWrapper>
          ) : null}
        </DragOverlay>
      </Box>
    </DndContext>
  );
};
