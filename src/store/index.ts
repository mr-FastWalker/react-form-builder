import { configureStore } from '@reduxjs/toolkit';
import constructorReducer from '../Pages/constructor/constructorSlice';

export const store = configureStore({
  reducer: {
    constructor: constructorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
