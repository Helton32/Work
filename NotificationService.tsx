import PushNotification from 'react-native-push-notification';

class NotificationService {
  constructor() {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification received:', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });
  }

  sendNotification(title, message) {
    PushNotification.localNotification({
      title,
      message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
    });
  }
}

export default new NotificationService();
