/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// Tâche d'arrière-plan Firebase Messaging
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message reçu en arrière-plan :', remoteMessage);
});

// Enregistrez l'application principale
AppRegistry.registerComponent(appName, () => App);
