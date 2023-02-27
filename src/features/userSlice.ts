import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthenticatedUser, IUserInitialState } from "../types/user";


const initialState: IUserInitialState = {
  user: {
    infos: {
      id: null,
      username: "",
      email: "",
      roles: []
    },
    isLogged: false
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IAuthenticatedUser>) => {
      state.user = { 
        infos: action.payload,
        isLogged: true
       }
    },
    logout: state => {
      return initialState;
    }
  },
});


export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;