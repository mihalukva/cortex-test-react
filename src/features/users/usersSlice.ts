import { createSlice } from "@reduxjs/toolkit";
import { UserInfo, TableData } from "../../services/users-api.service";
interface IUserSlice {
  table: TableData<UserInfo>;
  status: "loading" | "idle" | "done" | "error";
  page: number;
}

const initialState: IUserSlice = { table: { data: [], isHasMore: true }, status: "idle", page: 1 };

export const userReducer = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage: (state, action) => {
      if (action.payload <= state.page) state.table = initialState.table;
      state.page = action.payload;
    },
    add: (state, action) => {
      state.table.data = state.table.data.concat(action.payload.data);
      state.table.isHasMore = action.payload.isHasMore;
      state.status = "done";
    },
    loading: (state) => {
      state.status = "loading";
    },
    error: (state) => {
      state.status = "error";
    },
  },
});

export const { add, loading, error, setPage } = userReducer.actions;
export default userReducer.reducer;
