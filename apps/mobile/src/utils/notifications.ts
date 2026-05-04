import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import axios from 'axios';

const API_URL = 'https://praiseimpact.vercel.app';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id' // Replace with your actual project ID from app.json
    })).data;
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

export async function savePushToken(token: string, jwt: string) {
  try {
    await axios.post(`${API_URL}/users/push-token`, { token }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  } catch (error) {
    console.error('Error saving push token to backend', error);
  }
}
