import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import HomeScreen from './HomeScreen';
import AppointmentsScreen from './AppointmentsScreen';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ProfileScreen from './ProfileScreen';
import axios from 'axios';
import { setUser, setToken, logout } from './userSlice';

const Stack = createNativeStackNavigator();

const LogoTitle = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>Green Connect</Text>
  </View>
);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const login = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      console.log('Tentative de connexion avec:', email, password);
      const response = await axios.post('https://www.greenconnectfrance.com/api/login', {
        email,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Réponse du serveur:', response.data);

      if (!response.data || !response.data.token) {
        throw new Error('Réponse invalide du serveur');
      }

      dispatch(setToken(response.data.token));
      dispatch(setUser({ ...response.data.user, token: response.data.token }));
      navigation.replace('Green Connect');
    } catch (error) {
      setLoading(false);
      console.error('Erreur de connexion:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Échec de la connexion.");
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
      <TouchableOpacity style={styles.loginButton} onPress={login} disabled={loading}>
        <Text style={styles.loginButtonText}>{loading ? "Connexion..." : "Connexion"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const handleLogout = async (navigation, dispatch) => {
  try {
    console.log('Déconnexion en cours...');
    await axios.post(
      'https://www.greenconnectfrance.com/api/logout',
      {},
      {
        headers: { 'Authorization': `Bearer ${store.getState().user.token}` },
      }
    );
    dispatch(logout());
    navigation.replace('Login');
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
  }
};

const App = () => {
  useEffect(() => {
    messaging().requestPermission();
    messaging().getToken().then(token => console.log('Token Firebase :', token));
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Green Connect"
              component={HomeScreen}
              options={({ navigation }) => ({
                headerTitle: () => <LogoTitle />,
                headerRight: () => (
                  <Button title="Déconnexion" onPress={() => handleLogout(navigation, store.dispatch)} color="#4CAF50" />
                ),
              })}
            />
            <Stack.Screen name="Rendez-Vous" component={AppointmentsScreen} />
            <Stack.Screen name="Profil" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'black' },
  input: { width: '100%', padding: 10, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 15 },
  loginButton: { backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  loginButtonText: { color: 'white', fontWeight: 'bold' },
  headerContainer: { flexDirection: 'row', alignItems: 'center' },
  headerText: { fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
});

export default App;