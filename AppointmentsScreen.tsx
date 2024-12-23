import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';



const AppointmentsScreen = () => {
  const [data, setData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date().toISOString());
  const swipeableRefs = useRef([]);


  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get('http://192.168.1.22/api/greenco/new-appointments', {
          params: { last_checked: lastChecked },
        });
  
        const newAppointments = response.data.data || [];
  
        if (newAppointments.length > 0) {
          setData(prevData => [...newAppointments, ...prevData]);
  
          // Envoyer une notification pour chaque nouveau rendez-vous
          newAppointments.forEach(appointment => {
            NotificationService.sendNotification(
              'Nouveau rendez-vous',
              `Rendez-vous pour ${appointment.Name} ${appointment.LastName} à ${appointment.Heure}`
            );
          });
  
          setLastChecked(new Date().toISOString());
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des nouveaux rendez-vous :', error);
      }
    }, 300000); // Vérifie toutes les 5 minutes
  
    return () => clearInterval(interval);
  }, [lastChecked]);

  

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.1.22/api/greenco');
      const formattedData = response.data.data.map(item => ({ ...item, validated: false }));
      setData(formattedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      Alert.alert("Erreur", "Impossible de charger les rendez-vous. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
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

  const handleDelete = async (index) => {
    const item = data[index];
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer ce rendez-vous ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await axios.delete('http://192.168.1.22/api/greenco/' + item.id);
  
              // Fermer le Swipeable après suppression
              if (swipeableRefs.current[index]) {
                swipeableRefs.current[index].close();
              }
  
              // Mettre à jour la liste
              setData(prevData => prevData.filter((_, i) => i !== index));
            } catch (error) {
              console.error("Erreur lors de la suppression :", error);
              Alert.alert("Erreur", "Impossible de supprimer le rendez-vous.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };
  
  
  

  const handleValidate = async (index) => {
    const item = data[index];
    const newValidatedState = !item.validated;
  
    try {
      await axios.patch('http://192.168.1.22/api/greenco/' + item.id, {
        validated: newValidatedState,
      });
  
      setData(prevData =>
        prevData.map((item, i) =>
          i === index ? { ...item, validated: newValidatedState } : item
        )
      );
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
      Alert.alert("Erreur", "Impossible de valider le rendez-vous.");
    }
  };
  
  const renderRightActions = (index) => (
    <TouchableOpacity
      onPress={() => handleDelete(index)}
      style={styles.deleteButton}
    >
      <Icon name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  const renderLeftActions = (index) => (
    <TouchableOpacity
      onPress={() => handleValidate(index)}
      style={styles.validateButton}
    >
      <Icon name="check" size={24} color="white" />
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => (
    <Swipeable
      key={index}
      renderRightActions={() => renderRightActions(index)}
      renderLeftActions={() => renderLeftActions(index)}
      ref={(ref) => (swipeableRefs.current[index] = ref)}
    >
      <View style={[styles.dataContainer, item.validated && styles.validated]}>
        <TouchableOpacity onPress={() => toggleExpand(index)}>
          <Text style={[styles.row, item.validated && styles.lineThrough]}>
            Nom : <Text style={[styles.value, item.validated && styles.lineThrough]}>{item.Name || "N/A"}</Text>
          </Text>
          <Text style={[styles.row, item.validated && styles.lineThrough]}>
            Prénom : <Text style={[styles.value, item.validated && styles.lineThrough]}>{item.LastName || "N/A"}</Text>
          </Text>
          <Text style={[styles.row, item.validated && styles.lineThrough]}>
            Date : <Text style={[styles.value, item.validated && styles.lineThrough]}>{formatDate(item.Date)}</Text>
          </Text>
          <Text style={[styles.row, item.validated && styles.lineThrough]}>
            Heure : <Text style={[styles.value, item.validated && styles.lineThrough]}>{item.Heure || "N/A"}</Text>
          </Text>
        </TouchableOpacity>

        {expandedId === index && (
          <View style={styles.detailsContainer}>
            <Text style={[styles.label, item.validated && styles.lineThrough]}>
              Adresse : <Text style={styles.value}>{item.Adresse || "N/A"}</Text>
            </Text>
            <Text style={[styles.label, item.validated && styles.lineThrough]}>
              Téléphone : <Text style={styles.value}>{item.Telephone || "N/A"}</Text>
            </Text>
            <Text style={[styles.label, item.validated && styles.lineThrough]}>
              Email : <Text style={styles.value}>{item.Email || "N/A"}</Text>
            </Text>
            <Text style={[styles.label, item.validated && styles.lineThrough]}>
              Superficie : <Text style={styles.value}>{item.Superficie || "N/A"}</Text>
            </Text>
            <Text style={[styles.label, item.validated && styles.lineThrough]}>
              Énergie : <Text style={styles.value}>{item.Energie || "N/A"}</Text>
            </Text>
            <Text style={[styles.label, item.validated && styles.lineThrough]}>
              Quantité : <Text style={styles.value}>{item.Quantite || "N/A"}</Text>
            </Text>
            <Text style={[styles.label, item.validated && styles.lineThrough]}>
              Status : <Text style={styles.value}>{item.status || "N/A"}</Text>
            </Text>
          </View>
        )}
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
          ListEmptyComponent={<Text>Aucune donnée disponible pour le moment.</Text>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  validated: {
    backgroundColor: '#d3ffd3',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
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
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    borderRadius: 5,
  },
  validateButton: {
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    borderRadius: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppointmentsScreen;
