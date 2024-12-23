import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const { appointment, toggleValidation } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details du Rendez-vous</Text>
      <Text style={styles.label}>Nom: <Text style={styles.value}>{appointment.Name || "N/A"}</Text></Text>
      <Text style={styles.label}>Prénom: <Text style={styles.value}>{appointment.LastName || "N/A"}</Text></Text>
      <Text style={styles.label}>Adresse: <Text style={styles.value}>{appointment.Adresse || "N/A"}</Text></Text>
      <Text style={styles.label}>Téléphone: <Text style={styles.value}>{appointment.Telephone || "N/A"}</Text></Text>
      <Text style={styles.label}>Email: <Text style={styles.value}>{appointment.Email || "N/A"}</Text></Text>

      <TouchableOpacity
        style={styles.validateButton}
        onPress={() => toggleValidation(appointment.id)}
      >
        <Icon name="check" size={24} color="white" />
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontWeight: 'normal',
    color: '#333',
  },
  validateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default AppointmentDetailsScreen;
