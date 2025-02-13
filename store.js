import { configureStore } from '@reduxjs/toolkit';
import appointmentsReducer from './appointmentSlice';
import userReducer from './userSlice'; // Assurez-vous d'importer le bon chemin

const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
    user: userReducer,

  },
});

export default store;
