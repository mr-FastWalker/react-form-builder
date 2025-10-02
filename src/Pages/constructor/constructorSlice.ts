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
    setFormFields(state, action: PayloadAction<FieldData[] | null | undefined>) {
      const next = Array.isArray(action.payload) ? action.payload : [];
      return { ...state, formFields: next }; // ✅ Явно возвращаем новое состояние
    },
  },
});

export const { setFormFields } = constructorSlice.actions;
export default constructorSlice.reducer;
