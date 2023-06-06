import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: ['petersonguo', '16BitNarwhal', 'ChaSiu']
} 

const usernames = createSlice({
  name: 'usernames',
  initialState,
  reducers: {
    addUsername: (state, action) => {
      state.value.push(action.payload);
    },

    removeUsername: (state, action) => {
      state.value.pop(action.payload);
    }
  }
});

export const {addUsername, removeUsername} = usernames.actions;

export default usernames.reducer;
