import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getConfig from "../../utils/getConfig";

export const ToDoSlice = createSlice({
  name: "toDo",
  initialState: [],
  reducers: {
    setToDo: (state, action) => {
      const ToDo = action.payload;
      return ToDo;
    },
  },
});

export const getToDoThunk = () => (dispatch) => {
  return axios
    .get(`${process.env.REACT_APP_HOST}/usuarios/task`, getConfig())
    .then((res) => dispatch(setToDo(res.data.data.taskUser)));
};

export const { setToDo } = ToDoSlice.actions;

export default ToDoSlice.reducer;
