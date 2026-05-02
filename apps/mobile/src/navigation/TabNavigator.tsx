import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Play, Calendar, User, MessageSquare } from 'lucide-react-native';

import { 
  HomeScreen, 
  SermonsScreen, 
  EventsScreen, 
  ProfileScreen, 
  PrayerScreen 
} from '../screens';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: 'rgba(255,255,255,0.1)',
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTitleStyle: {
          color: '#f8fafc',
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Sermons" 
        component={SermonsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Play color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Prayer" 
        component={PrayerScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Events" 
        component={EventsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
