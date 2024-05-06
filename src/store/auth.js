import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { isLoggedIn: false, profile: null},
  reducers: {
    logIn(state) {
      state.isLoggedIn = true;
    },
    logOut(state) {
        state.isLoggedIn = false;
      },
    setProfile(state, action) {
      state.notification = {
        username: action.payload.username,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName
      };
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;
