import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import axios from 'axios';
import moment from 'moment';


const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Fonction pour charger les données depuis Google Sheets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://docs.google.com/spreadsheets/d/e/2PACX-1vRrGO3DdCe23Hv8ZQDmBtPbJlOhI2-YeUcm391Q7QdlDS3PH5nUwphsqvslw1O7rGm-Ke8sEMz6aPkg/pub?output=csv'
        );

        const csvData = response.data;
        const parsedData = parseCSV(csvData);
        setAppointments(parsedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      }
    };

    fetchData();
  }, []);

  // Fonction pour convertir les données CSV en tableau d'objets
  const parseCSV = (csv) => {
    const rows = csv.split('\n');
    const headers = rows[0].split(',');
    const data = rows.slice(1).map((row) => {
      //console.log(row)
      
      const values = row.split(',');
      return headers.reduce((acc, header, index) => {

        
        acc[header.trim()] = values[index].trim();
        console.log(header)
        return acc;
      }, {});
    });
    console.log(data)
    data.map((item,index)=>{
      console.log( moment(item.DateInstallation, 'DD/MM/YYYY').format('DD/MM/YYYY'))

    })
    

    return data.map((item, index) => ({
      id: index.toString(),
      nom: item['Nom'] || 'Inconnu',
      prenom: item['Prenom'] || 'Inconnu',
      adresse: item['Adresse'] || 'Non spécifié',
      Codepostal: item['Codepostal'] || 'Non spécifié',
      telephone: item['NumeroTelephone'] || 'N/A',
      dateInstallation:moment(item.DateInstallation, 'DD/MM/YYYY').format('DD/MM/YYYY'),
      HeureInstallation: item['HeureInstallation'] || '00:00',
      completed: item['Completed'] === 'true',
    }));
  };

  const toggleComplete = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id ? { ...appointment, completed: !appointment.completed } : appointment
      )
    );
  };

  const deleteAppointment = (id) => {
    Alert.alert(
      "Supprimer le rendez-vous",
      "Êtes-vous sûr de vouloir supprimer ce rendez-vous ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: () => {
            setAppointments((prevAppointments) =>
              prevAppointments.filter((appointment) => appointment.id !== id)
            );
          },
        },
      ]
    );
  };

  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAppointment(id)}>
      <Icon name="trash" size={30} color="#fff" />
    </TouchableOpacity>
  );

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.nom.toLowerCase().includes(search.toLowerCase()) ||
        appointment.prenom.toLowerCase().includes(search.toLowerCase()) ||
        appointment.adresse.toLowerCase().includes(search.toLowerCase()) ||
        appointment.telephone.includes(search);

      if (filter === 'completed') {
        return appointment.completed && matchesSearch;
      }
      if (filter === 'pending') {
        return !appointment.completed && matchesSearch;
      }
      return matchesSearch;
    });
  }, [appointments, filter, search]);

  const renderRow = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.card}>
        <View style={[styles.row, item.completed && styles.completedRow]}>
          <Text style={styles.cell}>{item.nom}</Text>
          <Text style={styles.cell}>{item.prenom}</Text>
          <Text style={styles.cell}>{item.adresse}</Text>
          <Text style={styles.cell}>{item.Codepostal}</Text>
          <Text style={styles.cell}>{item.telephone}</Text>
          <Text style={styles.cell}>{item.dateInstallation}</Text>
          <Text style={styles.cell}>{item.HeureInstallation}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
  

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.cell, styles.headerText]}>Information client</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un rendez-vous"
        value={search}
        onChangeText={setSearch}
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setFilter('all')}
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
        >
          <Text style={styles.filterText}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('completed')}
          style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
        >
          <Text style={styles.filterText}>Complétés</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter('pending')}
          style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
        >
          <Text style={styles.filterText}>En attente</Text>
        </TouchableOpacity>
      </View>

      {/* Appointment List */}
      {filteredAppointments.length === 0 ? (
        <Text style={styles.emptyState}>Aucun rendez-vous disponible</Text>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRow}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
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
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20, // Augmenter le padding pour ajouter de la longueur
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minHeight: 120, // Définir une hauteur minimum pour la ligne
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedRow: {
    backgroundColor: '#d3ffd3',
    borderRadius: 10,
    padding: 20, // Augmenter le padding pour une ligne plus longue
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minHeight: 120, // Hauteur minimum
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    fontSize: 10,
    borderRadius : 1 ,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeFilter: {
    backgroundColor: '#d3ffd3',
  },
  filterText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
});


export default AppointmentTable;
