import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getConfig from "../../utils/getConfig";

//slice usuario controla el estado global del usuario en sesion
export const UserSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      return user;
    },
  },
});

export const getUserThunk = (data) => (dispatch) => {
  return axios
    .post(`${process.env.REACT_APP_HOST}/usuarios/login`, data)
    .then((res) => dispatch(setUser(res.data.data.user)));
};

export const getUserInSessionThunk = (id) => (dispatch) => {
  return axios
    .get(`${process.env.REACT_APP_HOST}/usuarios/${id}`, getConfig())
    .then((res) => dispatch(setUser(res.data.data.userid)));
};

export const editUserThunk = (id, userEdit) => (dispatch) => {
  return axios
    .patch(
      `${process.env.REACT_APP_HOST}/usuarios/${id}`,
      userEdit,
      getConfig()
    )
    .then((res) => dispatch(setUser(res.data.data.user)));
};
export const { setUser } = UserSlice.actions;

export default UserSlice.reducer;
