import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('./assets/researchers-looking-alternative-energy-souces.webp')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        

        <Text style={styles.header}>Bienvenue sur Green Connect</Text>

        <Text style={styles.subHeader}>
          Connectez-vous aux solutions durables pour un avenir plus vert.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Rendez-Vous')}
        >
          <Text style={styles.buttonText}>Voir les rendez-vous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Profil')}
        >
          <Text style={styles.buttonText}>Mon profil</Text>
        </TouchableOpacity>

        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
