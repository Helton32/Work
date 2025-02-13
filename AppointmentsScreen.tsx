// AppointmentCalendar.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Swipeable } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, addAppointment, updateAppointment, deleteAppointment } from './appointmentSlice';

import moment from 'moment';

const AppointmentCalendar = () => {
  const dispatch = useDispatch();
  const { appointments, status } = useSelector((state) => state.appointments);
  
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    LastName: '',
    Adresse: '',
    Telephone: '',
    Heure: '',
    Email: '',
    Quantite: '',
    Energie: '',
    Superficie: '',
  });

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  useEffect(() => {
    mapAppointmentsToCalendar(appointments);
  }, [appointments]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchAppointments()).finally(() => setRefreshing(false));
  };

  const mapAppointmentsToCalendar = (data) => {
    const marked = {};
    data.forEach((appointment) => {
      if (!marked[appointment.Date]) {
        marked[appointment.Date] = { marked: true, dotColor: '#6ddb6d' };
      }
    });
    setMarkedDates(marked);
  };

  const handleSaveAppointment = () => {
    if (!formData.Name || !formData.LastName || !formData.Adresse || !formData.Heure || !formData.Email) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
    dispatch(addAppointment({ ...formData, Date: selectedDate })).then(() => {
      setModalVisible(false);
      resetFormData();
    });
  };

  const handleUpdateAppointment = () => {
    if (!formData.Name || !formData.LastName || !formData.Adresse || !formData.Heure || !formData.Email) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
    dispatch(updateAppointment({ id: selectedAppointmentId, appointment: { ...formData, Date: selectedDate } })).then(() => {
      setModalVisible(false);
      resetFormData();
    });
  };

  const handleDeleteAppointment = (id) => {
    Alert.alert('Confirmation', 'Voulez-vous supprimer ce rendez-vous ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        onPress: () => dispatch(deleteAppointment(id)),
      },
    ]);
  };

  const resetFormData = () => {
    setFormData({
      Name: '',
      LastName: '',
      Adresse: '',
      Telephone: '',
      Heure: '',
      Email: '',
      Quantite: '',
      Energie: '',
      Superficie: '',
    });
    setSelectedAppointmentId(null);
  };

  const renderAppointment = ({ item }) => {
    const isSelected = item.id === selectedAppointmentId;
  
    return (
      <Swipeable renderRightActions={() => (
        <View style={styles.swipeActions}>
          <TouchableOpacity onPress={() => handleDeleteAppointment(item.id)} style={styles.actionButton}>
            <Icon name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}>
        <TouchableOpacity
          style={[styles.appointmentCard, isSelected && styles.selectedCard]}
          onPress={() => setSelectedAppointmentId(isSelected ? null : item.id)} // Toggle selection
        >
          <Text style={styles.appointmentText}>Nom: {item.Name} {item.LastName}</Text>
          <Text style={styles.appointmentText}>Adresse: {item.Adresse}</Text>
          <Text style={styles.appointmentText}>Téléphone: {item.Telephone}</Text>
          <Text style={styles.appointmentText}>Heure: {item.Heure}</Text>
          <Text style={styles.appointmentText}>Énergie: {item.Energie}</Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      {status === 'loading' ? (
        <ActivityIndicator size="large" color="#6ddb6d" />
      ) : (
        <>
          <Calendar
            markedDates={{ ...markedDates, [selectedDate]: { selected: true, selectedColor: '#81c784' } }}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              backgroundColor: '#1e3d1e',
              calendarBackground: '#1e3d1e',
              todayTextColor: '#ffffff',
              dayTextColor: '#ffffff',
              arrowColor: '#6ddb6d',
              monthTextColor: '#ffffff',
              textDisabledColor: '#757575',
              dotColor: '#6ddb6d',
              selectedDayBackgroundColor: '#81c784',
              selectedDayTextColor: '#ffffff',
            }}
          />
          <FlatList
            data={appointments.filter((appt) => appt.Date === selectedDate)}
            keyExtractor={(item) => item.id}
            renderItem={renderAppointment}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Icon name="add" size={28} color="#fff" />
          </TouchableOpacity>

          {selectedAppointmentId && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                const selectedAppointment = appointments.find((appt) => appt.id === selectedAppointmentId);
                if (selectedAppointment) {
                  setFormData(selectedAppointment);
                  setModalVisible(true);
                }
              }}
            >
              <Icon name="edit" size={28} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedAppointmentId ? 'Modifier' : 'Ajouter'} un rendez-vous</Text>
            <TextInput placeholder="Nom" value={formData.Name} onChangeText={(text) => setFormData({ ...formData, Name: text })} style={styles.textInput} />
            <TextInput placeholder="Prénom" value={formData.LastName} onChangeText={(text) => setFormData({ ...formData, LastName: text })} style={styles.textInput} />
            <TextInput placeholder="Adresse" value={formData.Adresse} onChangeText={(text) => setFormData({ ...formData, Adresse: text })} style={styles.textInput} />
            <TextInput placeholder="Téléphone" value={formData.Telephone} onChangeText={(text) => setFormData({ ...formData, Telephone: text })} style={styles.textInput} />
            <TextInput placeholder="Heure" value={formData.Heure} onChangeText={(text) => setFormData({ ...formData, Heure: text })} style={styles.textInput} />
            <TextInput placeholder="Email" value={formData.Email} onChangeText={(text) => setFormData({ ...formData, Email: text })} style={styles.textInput} />
            <TextInput placeholder="Quantité" value={formData.Quantite} onChangeText={(text) => setFormData({ ...formData, Quantite: text })} style={styles.textInput} />
            <TextInput placeholder="Énergie" value={formData.Energie} onChangeText={(text) => setFormData({ ...formData, Energie: text })} style={styles.textInput} />
            <TextInput placeholder="Superficie" value={formData.Superficie} onChangeText={(text) => setFormData({ ...formData, Superficie: text })} style={styles.textInput} />
            <TouchableOpacity onPress={selectedAppointmentId ? handleUpdateAppointment : handleSaveAppointment} style={styles.button}>
              <Text style={styles.buttonText}>Sauvegarder</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles améliorés
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#183D18',
    padding: 15,
  },
  appointmentCard: {
    backgroundColor: '#256D25',
    padding: 12, // Réduction du padding
    borderRadius: 10, // Réduction de la bordure arrondie
    marginBottom: 10, // Moins d'espace entre les cartes
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: '#A1E6A1',
    borderWidth: 2,
    shadowColor: '#A1E6A1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  appointmentText: {
    color: '#F0F0F0',
    fontSize: 16,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#4CAF50',
    borderRadius: 45,
    padding: 16,
    elevation: 4,
  },
  editButton: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    backgroundColor: '#FFA726',
    borderRadius: 45,
    padding: 16,
    elevation: 4,
  },
  swipeActions: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    width: 90,
    height: '100%',
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#256D25',
    padding: 20,
    borderRadius: 12,
    width: 300,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#FFF',
    textAlign: 'center',
  },
  textInput: {
    borderColor: '#A1E6A1',
    borderWidth: 1.2,
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    fontSize: 16,
    color: '#FFF',
    backgroundColor: '#2E482E',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



export default AppointmentCalendar;
