import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { ActivityIndicator, View, Platform } from 'react-native';

import TabNavigator from './src/navigation/TabNavigator';
import SermonDetailScreen from './src/screens/Sermons/SermonDetailScreen';
import LivePlayerScreen from './src/screens/Live/LivePlayerScreen';
import AuthNavigator from './src/navigation/AuthNavigator';

import { registerForPushNotificationsAsync } from './src/utils/notifications';
import { navigationRef, navigate } from './src/navigation/RootNavigation';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0f172a' } }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      registerForPushNotificationsAsync();

      const notificationListener = Notifications.addNotificationReceivedListener(() => {});
      const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        if (data.type === 'live') navigate('LivePlayer', { videoId: data.videoId });
        if (data.type === 'sermon') navigate('SermonDetail', { sermonId: data.id });
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      };
    }
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </AuthProvider>
  );
}
