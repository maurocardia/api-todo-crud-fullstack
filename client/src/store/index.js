import { configureStore } from "@reduxjs/toolkit";
import ToDoSlice from "./slices/ToDo.slice";
import UserSlice from "./slices/User.slice";
import ViewSlice from "./slices/View.slice";

export default configureStore({
  reducer: {
    user: UserSlice,
    ToDo: ToDoSlice,
    view: ViewSlice,
  },
});
