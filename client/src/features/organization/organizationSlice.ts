import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

interface OrgState {
  orgId: number;
}

const initialState: OrgState = {
  orgId: 0,
};

const orgSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrgId: (state, action) => {
      state.orgId = action.payload;
    },
  },
});

export const { setOrgId } = orgSlice.actions;

export default orgSlice.reducer;

export const selectOrgId = (state: RootState) => state.organization.orgId;
