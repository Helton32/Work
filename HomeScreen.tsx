import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('./assets/researchers-looking-alternative-energy-souces.webp')} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image 
          source={require('./assets/lignes-cycle-feuille.png')} 
          style={styles.logo} 
        />
        <Text style={styles.header}>Bienvenue sur Green Connect</Text>
        <Button
          title="Voir les rendez-vous"
          onPress={() => navigation.navigate('Rendez-Vous')}
          color="#007AFF"
        />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  logo: {
    width: 100,  // Ajuste la taille selon tes préférences
    height: 100,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
