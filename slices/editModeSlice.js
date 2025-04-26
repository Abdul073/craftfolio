import { createSlice } from "@reduxjs/toolkit";

export const editModeSlice = createSlice({
  name: "editMode",
  initialState: { currentlyEditing: "" },
  reducers: {
    
    setCurrentEdit: (state, action) => {
      state.currentlyEditing = action.payload;
    },
  },
});

export const { setCurrentEdit } = editModeSlice.actions;

export default editModeSlice.reducer;
