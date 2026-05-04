import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import TabNavigator from './src/navigation/TabNavigator';
import SermonDetailScreen from './src/screens/Sermons/SermonDetailScreen';
import LivePlayerScreen from './src/screens/Live/LivePlayerScreen';
import { registerForPushNotificationsAsync } from './src/utils/notifications';
import { navigationRef, navigate } from './src/navigation/RootNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  const [notification, setNotification] = React.useState<any>(false);
  const notificationListener = React.useRef<any>();
  const responseListener = React.useRef<any>();

  React.useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log('Push Token:', token);
      // In a real app, save this token when the user logs in
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data.type === 'live') {
        navigate('LivePlayer', { videoId: data.videoId });
      }

      if (data.type === 'sermon') {
        navigate('SermonDetail', { sermonId: data.id });
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0f172a' } }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen 
          name="SermonDetail" 
          component={SermonDetailScreen} 
          options={{ 
            headerShown: true, 
            title: 'Sermon Details',
            headerStyle: { backgroundColor: '#0f172a' },
            headerTintColor: '#f8fafc'
          }} 
        />
        <Stack.Screen name="LivePlayer" component={LivePlayerScreen} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
