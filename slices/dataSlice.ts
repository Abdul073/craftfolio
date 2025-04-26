import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PortfolioState {
  portfolioData: any;
}
const initialState: PortfolioState = {
  portfolioData: null,
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setPortfolioData: (state, action) => {
      state.portfolioData = action.payload;
    },

    updatePortfolioData: (
      state,
      action: PayloadAction<{ sectionType: string; newData: any }>
    ) => {
      if (!state.portfolioData) return;

      const { sectionType, newData } = action.payload;
      state.portfolioData = state.portfolioData.map((section : any)=> section.type === sectionType ? {...section,data: newData} : section)
    },
  },
});

export const { setPortfolioData,updatePortfolioData } = dataSlice.actions;
export default dataSlice.reducer;
