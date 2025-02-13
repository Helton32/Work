import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
  email: '',
  token: '', // Ajout du champ pour le token
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { id, name, email, token } = action.payload; // Inclure le token dans la déstructuration
      state.id = id;
      state.name = name;
      state.email = email;
      state.token = token; // Ajouter le token dans l'état
    },
    setToken: (state, action) => {
      state.token = action.payload;
    }, 
    logout(state) {
      state.id = null;
      state.name = '';
      state.email = '';
      state.token = ''; // Effacer le token lors de la déconnexion
    },
  },
});

export const { setUser, logout , setToken } = userSlice.actions;
export default userSlice.reducer;
