import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Action asynchrone pour récupérer les rendez-vous
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, { getState }) => {
    const state = getState();
    console.log(state.user)
    const token = state.user.token;  // Récupérer le token depuis le Redux store
    // Faire une requête GET pour récupérer les rendez-vous
    const response = await axios.get('https://www.greenconnectfrance.com/api/greenco', {
      headers: {
        Authorization: `Bearer ${token}`,  // Ajouter le token d'authentification dans les headers
      },
    });
    return response.data.data;
  }
);

// Action asynchrone pour ajouter un rendez-vous
export const addAppointment = createAsyncThunk(
  'appointments/addAppointment',
  async (appointment, { getState }) => {
    const state = getState();
    const token = state.user.token;  // Récupérer le token depuis le Redux store

    // Faire une requête POST pour ajouter un rendez-vous
    const response = await axios.post(
      'https://www.greenconnectfrance.com/api/greenco/add',
      appointment,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Ajouter le token dans les headers
        },
      }
    );
    return response.data;
  }
);

// Action asynchrone pour mettre à jour un rendez-vous
export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, appointment }, { getState }) => {
    const state = getState();
    const token = state.user.token;  // Récupérer le token depuis le Redux store

    // Faire une requête PATCH pour mettre à jour un rendez-vous
    const response = await axios.patch(
      `https://www.greenconnectfrance.com/api/greenco/${id}`,
      appointment,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Ajouter le token d'authentification dans les headers
        },
      }
    );
    return { id, ...appointment };  // Retourner les données mises à jour
  }
);

// Action asynchrone pour supprimer un rendez-vous
export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id, { getState }) => {
    const state = getState();
    const token = state.user.token;  // Récupérer le token depuis le Redux store

    // Faire une requête DELETE pour supprimer un rendez-vous
    await axios.delete(`https://www.greenconnectfrance.com/api/greenco/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Ajouter le token dans les headers
      },
    });

    return id;  // Retourner l'id du rendez-vous supprimé
  }
);

// Création du slice pour gérer l'état des rendez-vous
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: { appointments: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';  // Mettre l'état en "loading" pendant le chargement
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Mettre l'état en "succeeded" après avoir récupéré les rendez-vous
        state.appointments = action.payload;  // Mettre à jour les rendez-vous avec la réponse
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';  // Mettre l'état en "failed" si l'appel échoue
        state.error = action.error.message;  // Enregistrer l'erreur
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);  // Ajouter le nouveau rendez-vous à la liste
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(appt => appt.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;  // Mettre à jour le rendez-vous dans la liste
        }
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(appt => appt.id !== action.payload);  // Supprimer le rendez-vous
      });
  },
});

export default appointmentsSlice.reducer;
