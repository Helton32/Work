import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { logout } from './userSlice';

// Composant de la page de profil
const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user.id) {
      Alert.alert('Erreur', 'Aucun utilisateur connecté.');
      navigation.replace('Login');
    }
  }, [user, navigation]);

  const handleLogout = () => {
    // Déconnexion
    dispatch(logout()); // Déconnexion de l'utilisateur dans Redux
    navigation.replace('Login'); // Rediriger vers l'écran de connexion
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileTitle}>Mon profil</Text>
      <View style={styles.profileInfo}>
        <Text style={styles.profileLabel}>Nom :</Text>
        <Text style={styles.profileValue}>{user.name || 'Non renseigné'}</Text>
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileLabel}>Email :</Text>
        <Text style={styles.profileValue}>{user.email || 'Non renseigné'}</Text>
      </View>

      <TouchableOpacity
        style={styles.rdvButton}
        onPress={() => navigation.navigate('Rendez-Vous')}
      >
        <Text style={styles.logoutButtonText}>Mes rendez-vous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e3d1e',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  profileLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#555',
  },
  profileValue: {
    fontSize: 16,
    color: '#333',
  },
  rdvButton: {
    marginTop: 30,
    backgroundColor: 'green',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff5252',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
