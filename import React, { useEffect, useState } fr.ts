import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ImageBackground  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const AppointmentsScreen = () => {
  const [data, setData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.22/api/greenco');
        const formattedData = response.data.data.map(item => ({ ...item, validated: false }));
        setData(formattedData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données :', err);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer ce rendez-vous ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.1.22/api/greenco/${id}`);
              setData(data.filter((_, index) => index !== id));
            } catch (error) {
              console.error("Erreur lors de la suppression :", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleValidate = (index) => {
    setData(prevData =>
      prevData.map((item, i) =>
        i === index ? { ...item, validated: !item.validated } : item
      )
    );
  };

  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(id)}
        style={styles.deleteButton}
      >
        <Icon name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Voici les rendez-vous :</Text>
        {data.length > 0 ? (
          data.map((item, index) => (
            <Swipeable key={index} renderRightActions={() => renderRightActions(index)}>
              <View style={[styles.dataContainer, item.validated && styles.validated]}>
                <TouchableOpacity onPress={() => toggleExpand(index)}>
                  <Text style={styles.row}>Nom : <Text style={styles.value}>{item.Name || "N/A"}</Text></Text>
                  <Text style={styles.row}>Prénom : <Text style={styles.value}>{item.LastName || "N/A"}</Text></Text>
                  <Text style={styles.row}>Date : <Text style={styles.value}>{formatDate(item.Date)}</Text></Text>
                  <Text style={styles.row}>Heure : <Text style={styles.value}>{item.Heure || "N/A"}</Text></Text>
                </TouchableOpacity>

                <View style={styles.actionsContainer}>
                  <TouchableOpacity onPress={() => handleValidate(index)} style={styles.iconButton}>
                    <Icon name="check" size={24} color="green" /> 
                  </TouchableOpacity>
                </View>

                {expandedId === index && (
                  <View style={styles.detailsContainer}>
                    <Text style={styles.label}>Adresse : <Text style={styles.value}>{item.Adresse || "N/A"}</Text></Text>
                    <Text style={styles.label}>Téléphone : <Text style={styles.value}>{item.Telephone || "N/A"}</Text></Text>
                    <Text style={styles.label}>Email : <Text style={styles.value}>{item.Email || "N/A"}</Text></Text>
                    <Text style={styles.label}>Superficie : <Text style={styles.value}>{item.Superficie || "N/A"}</Text></Text>
                    <Text style={styles.label}>Énergie : <Text style={styles.value}>{item.Energie || "N/A"}</Text></Text>
                    <Text style={styles.label}>Quantité : <Text style={styles.value}>{item.Quantite || "N/A"}</Text></Text>
                    <Text style={styles.label}>Status : <Text style={styles.value}>{item.status || "N/A"}</Text></Text>
                  </View>
                )}
              </View>
            </Swipeable>
          ))
        ) : (
          <Text>Aucune donnée disponible pour le moment.</Text>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  validated: {
    backgroundColor: '#d3ffd3', // Change la couleur de fond pour les éléments validés
  },
  detailsContainer: {
    marginTop: 10,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    borderRadius: 5,
  },
});

export default AppointmentsScreen;
