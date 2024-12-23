import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const AppointmentTable = () => {
  const initialAppointments = [
    { id: '1', name: 'John Doe', adresse: '123 rue Exemple', numero: '12', date: '2023-10-21T10:30:00', completed: false },
    { id: '2', name: 'Jane Smith', adresse: '456 rue Exemple', numero: '13', date: '2023-10-22T14:00:00', completed: false },
    { id: '3', name: 'Sam Brown', adresse: '789 rue Exemple', numero: '14', date: '2023-10-23T09:00:00', completed: false },
    { id: '4', name: 'Alice Johnson', adresse: '321 rue Exemple', numero: '15', date: '2023-10-24T11:00:00', completed: false },
  ];

  const [appointments, setAppointments] = useState(initialAppointments);

  const toggleComplete = (id) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === id ? { ...appointment, completed: !appointment.completed } : appointment
      )
    );
  };

  const deleteAppointment = (id) => {
    Alert.alert(
      "Supprimer le rendez-vous",
      "Êtes-vous sûr de vouloir supprimer ce rendez-vous ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: () => {
            setAppointments(prevAppointments =>
              prevAppointments.filter(appointment => appointment.id !== id)
            );
          }
        }
      ]
    );
  };

  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAppointment(id)}>
      <Icon name="trash" size={30} color="#fff" />
    </TouchableOpacity>
  );

  const renderRow = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.card}>
        <View style={[styles.row, item.completed && styles.completedRow]}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.adresse}</Text>
          <Text style={styles.cell}>{item.numero}</Text>
          <Text style={styles.cell}>{new Date(item.date).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.cell, styles.headerText]}>Information client</Text>
      </View>
      <FlatList
        data={appointments}
        keyExtractor={item => item.id.toString()}
        renderItem={renderRow}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'red',
    marginBottom: 5,
    paddingBottom: 5,
    marginHorizontal: 100,
  },
  headerText: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedRow: {
    backgroundColor: '#d3ffd3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 10,
  },
});

export default AppointmentTable;
