import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  isApproved: false,
  role: '', // default role
  id: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      const { name, email, isApproved, role, id } = action.payload;
      state.name = name;
      state.email = email;
      state.isApproved = isApproved;
      state.role = role;
      state.id = id;
    },
    clearUserInfo: (state) => {
      state.name = '';
      state.email = '';
      state.isApproved = false;
      state.role = 'guest';
      state.id = '';
    },
    updateApproval: (state, action) => {
      state.isApproved = action.payload;
    },
    updateRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setUserInfo, clearUserInfo, updateApproval, updateRole } = userSlice.actions;

export default userSlice.reducer;
