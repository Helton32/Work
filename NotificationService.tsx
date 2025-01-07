import PushNotification from "react-native-push-notification";

class NotificationService {
  configure = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log("Notification Received: ", notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  showNotification = (title, message) => {
    PushNotification.localNotification({
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
    });
  };
}

export const notificationService = new NotificationService();
