import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  category?: string;
  priority?: string;
  team?: string;
  createdAt: string;
  updatedAt: string;
}

interface IssuesState {
  issues: Issue[];
  currentIssue: Issue | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: IssuesState = {
  issues: [],
  currentIssue: null,
  status: "idle",
  error: null,
};

export const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setCurrentIssue: (state, action: PayloadAction<Issue | null>) => {
      state.currentIssue = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Async thunk actions will be added here when API integration is implemented
  },
});

export const { setCurrentIssue } = issuesSlice.actions;

export default issuesSlice.reducer;
