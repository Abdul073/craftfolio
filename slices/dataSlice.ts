import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PortfolioState {
  portfolioData: any[];
  themeName: string;
}

const initialState: PortfolioState = {
  portfolioData: [],
  themeName: "",
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setPortfolioData: (state, action: PayloadAction<any[]>) => {
      state.portfolioData = action.payload;
    },
    
    setThemeName: (state, action: PayloadAction<string>) => {
      state.themeName = action.payload;
    },

    updatePortfolioData: (
      state,
      action: PayloadAction<{ sectionType: string; newData: any }>
    ) => {
      if (!state.portfolioData) return;

      const { sectionType, newData } = action.payload;
      state.portfolioData = state.portfolioData.map((section: any) => 
        section.type === sectionType ? {...section, data: newData} : section
      );
    },
    
    newPortfolioData: (state, action: PayloadAction<any[]>) => {
      // Replace the entire portfolio data array with the new one
      state.portfolioData = action.payload;
    }
  },
});

export const { 
  setPortfolioData, 
  setThemeName, 
  updatePortfolioData, 
  newPortfolioData 
} = dataSlice.actions;

export default dataSlice.reducer;