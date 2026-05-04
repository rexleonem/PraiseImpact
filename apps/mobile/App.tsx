import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './src/navigation/TabNavigator';
import SermonDetailScreen from './src/screens/Sermons/SermonDetailScreen';
import LivePlayerScreen from './src/screens/Live/LivePlayerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
