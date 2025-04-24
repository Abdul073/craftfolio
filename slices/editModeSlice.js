import { createSlice } from "@reduxjs/toolkit";

export const editModeSlice = createSlice({
  name: "editMode",
  initialState: { isEditMode: true, currentlyEditing: "hero" },
  reducers: {
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },
    setCurrentEdit: (state, action) => {
      state.currentlyEditing = action.payload;
    },
  },
});

export const { toggleEditMode, setCurrentEdit } = editModeSlice.actions;

export default editModeSlice.reducer;
