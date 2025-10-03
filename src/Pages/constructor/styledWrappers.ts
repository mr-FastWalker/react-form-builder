import {styled} from "@mui/system";
import {Box} from "@mui/material";

export const FormContainerStyled = styled('div', {
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

export const EmptyDropAria = styled('div', {
  name: 'EmptyDropAria',
  slot: 'Root',
})({
  textAlign: 'center',
  color: 'text.secondary',
  fontSize: '1.1rem',
  padding: 4,
});

export const PlaceholderForInsert = styled('div', {
  name: 'PlaceholderForInsert',
  slot: 'Root',
})({
  height: '4px',
  backgroundColor: '#2196f3',
  borderRadius: '2px',
  margin: '4px 0',
  opacity: 0.8,
  boxShadow: '0 0 8px rgba(33, 150, 243, 0.3)'
});

export const DraggingWrapper = styled('div', {
  name: 'DraggingWrapper',
  slot: 'Root',
})<{activeField: boolean}>((activeField) => ({
  backgroundColor: 'white',
  borderRadius: '6px',
  padding: '8px 16px',
  border: '2px solid #2196f3',
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
  opacity: 0.95,
  pointerEvents: 'none',
  zIndex: 1000,
  minHeight: 'auto',
  maxWidth: activeField ? '768px' : '300px',
  width: activeField ? '768px' : 'fit-content',
}));

export const FieldsListWrapper = styled(Box, {
  name: 'FieldsListWrapper',
  slot: 'Root',
})({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '300px',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: '#f5f5f5',
  position: 'fixed',
  top: '16px',
  left: '276px',
});

export const DroppableStyled = styled(Box, {
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
  gap: '4px',
  padding: '8px',
  margin: '8px 0',
  backgroundColor: theme.palette.grey[100],
  minHeight: '60px'
}));

export const FormHeader = styled('div', {
  name: 'FormHeader',
  slot: 'Root',
})({
  display: 'flex',

  // fontSize: '1.1rem',
  // padding: 4,
});