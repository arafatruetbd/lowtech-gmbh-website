import { createSlice } from "@reduxjs/toolkit";

const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error parsing userInfo from localStorage:", error);
    return null;
  }
};

const initialState = {
  userInfo: getUserInfo(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload.userInfo;
      localStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo"); 
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
