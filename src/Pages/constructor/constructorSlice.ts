import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FieldData } from './utils/fieldRenderer';

interface ConstructorState {
  formFields: FieldData[];
}

const initialState: ConstructorState = {
  formFields: [],
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    setFormFields(state, action: PayloadAction<FieldData[] | undefined | null>) {
      // Ensure we never set an undefined value that could break Immer expectations
      state.formFields = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { setFormFields } = constructorSlice.actions;
export default constructorSlice.reducer;
