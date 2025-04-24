import { configureStore } from '@reduxjs/toolkit';
import editModeReducer from '../slices/editModeSlice';
import dataReducer from '../slices/dataSlice';

export const store = configureStore({
  reducer: {
    editMode: editModeReducer,
    data : dataReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
