import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import HomeScreen from './HomeScreen';
import AppointmentsScreen from './AppointmentsScreen';
import AppointmentDetailsScreen from './AppointmentDetailsScreen';

const Stack = createNativeStackNavigator();

// Fonction personnalisée pour le titre avec logo
const LogoTitle = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Green Connect</Text>
    </View>
  );
};

// Écran de connexion
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    console.log(email,password)
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.replace('Green Connect');
    } catch (error) {
      console.log(error); // Affiche l'erreur dans la console
      if (error.code === 'auth/invalid-email') {
        setErrorMessage("L'adresse e-mail est invalide.");
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage("Aucun utilisateur trouvé avec cet e-mail.");
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Mot de passe incorrect.');
      } else {
        setErrorMessage(`Une erreur est survenue: ${error.message}`);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Green Connect</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Adresse e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

// Fonction de déconnexion commune
const handleLogout = async (navigation) => {
  try {
    await auth().signOut();
    navigation.replace('Login');
  } catch (error) {
    Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
  }
};

// Assurez-vous que l'utilisateur est connecté avant d'afficher l'écran principal
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setIsAuthenticated(!!user); // Si un utilisateur est connecté
    });
    return unsubscribe;
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <Component {...rest} />;
};

const App = () => {
  // Fonctionnalité de gestion des notifications Firebase
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('Token Firebase :', token);
  };

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Green Connect"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerTitle: () => <LogoTitle />,
            headerRight: () => (
              <Button
                title="Déconnexion"
                onPress={() => handleLogout(navigation)}
                color="#4CAF50"
              />
            ),
          })}
        />
        <Stack.Screen
          name="Rendez-Vous"
          component={AppointmentsScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                title="Déconnexion"
                onPress={() => handleLogout(navigation)}
                color="#4CAF50"
              />
            ),
          })}
        />
        <Stack.Screen
          name="AppointmentDetails"
          component={AppointmentDetailsScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                title="Déconnexion"
                onPress={() => handleLogout(navigation)}
                color="#4CAF50"
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default App;
