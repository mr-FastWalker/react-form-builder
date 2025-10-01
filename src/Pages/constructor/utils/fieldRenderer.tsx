import {
  CheckBoxField,
  DescriptionField,
  GroupField,
  InputField,
  RadioField,
  SelectField,
  TitleField,
  SubtitleField,
  TextareaField,
  DatePickerField
} from "../../sc/fields";
import { Stack, Typography, Box } from "@mui/material";
import { Droppable } from "../Droppable";
import { SortableItem } from "../SortableItem";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export interface FieldData {
  id: string;
  type: string;
  children?: FieldData[];
}

const renderNestedFields = (children: FieldData[]) => {
  if (!children || children.length === 0) {
    return (
      <Box sx={{
        textAlign: 'center',
        color: 'text.secondary',
        fontStyle: 'italic',
        padding: 2
      }}>
        Drop fields here
      </Box>
    );
  }

  return (
    <SortableContext items={children.map(f => f.id)} strategy={verticalListSortingStrategy}>
      {children.map((child) => (
        <SortableItem key={child.id} id={child.id}>
          <Box sx={{
            backgroundColor: 'white',
            borderRadius: '6px',
            padding: '8px 16px',
            border: '1px solid #ddd',
            margin: '4px 0'
          }}>
            {getFieldByType(child.type, child)}
          </Box>
        </SortableItem>
      ))}
    </SortableContext>
  );
};

export const getFieldByType = (type: string, fieldData?: FieldData) => {
  switch (type) {
    case 'text':
      return <InputField />
    case 'group':
      return (
        <GroupField>
          {fieldData && (
            <Droppable id={`${fieldData.id}-content`}>
              {renderNestedFields(fieldData.children || [])}
            </Droppable>
          )}
        </GroupField>
      )
    case 'selector':
      return <SelectField />
    case 'checkbox':
      return <CheckBoxField />
    case 'radio':
      return <RadioField />
    case 'title':
      return <TitleField />
    case 'subtitle':
      return <SubtitleField />
    case 'textarea':
      return <TextareaField />
    case 'description':
      return <DescriptionField />
    case 'list':
      return <div>list</div>
    case 'complex':
      return <div>complex</div>
    case 'datetime':
      return <DatePickerField />
    case 'columnContainer':
      return (
        <Stack direction="column" gap={1} sx={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: 2,
          minHeight: 120,
          backgroundColor: '#fafafa'
        }}>
          <Typography variant="caption" color="text.secondary" sx={{mb: 1}}>
            Column Container
          </Typography>
          {fieldData && (
            <Droppable id={`${fieldData.id}-content`}>
              {renderNestedFields(fieldData.children || [])}
            </Droppable>
          )}
        </Stack>
      )
    case 'rowContainer':
      return (
        <Stack direction="row" gap={1} sx={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: 2,
          minHeight: 120,
          backgroundColor: '#fafafa',
          position: 'relative'
        }}>
          <Typography variant="caption" color="text.secondary" sx={{
            position: 'absolute',
            top: 4,
            left: 8
          }}>
            Row Container
          </Typography>
          {fieldData && (
            <Box sx={{ display: 'flex', width: '100%', gap: 1, mt: 2 }}>
              <Droppable id={`${fieldData.id}-content`}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, width: '100%' }}>
                  {fieldData.children && fieldData.children.length > 0 ? (
                    <SortableContext items={fieldData.children.map(f => f.id)} strategy={verticalListSortingStrategy}>
                      {fieldData.children.map((child) => (
                        <SortableItem key={child.id} id={child.id}>
                          <Box sx={{
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            border: '1px solid #ddd',
                            flex: 1,
                            minWidth: 0
                          }}>
                            {getFieldByType(child.type, child)}
                          </Box>
                        </SortableItem>
                      ))}
                    </SortableContext>
                  ) : (
                    <Box sx={{
                      textAlign: 'center',
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      padding: 2,
                      width: '100%'
                    }}>
                      Drop fields here
                    </Box>
                  )}
                </Box>
              </Droppable>
            </Box>
          )}
        </Stack>
      )
    default:
      return <Typography color='error.main'>{`unknown type "${type}"`}</Typography>
  }
}