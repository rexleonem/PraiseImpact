import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Play, Calendar, User, MessageSquare } from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { 
  HomeScreen, 
  SermonsScreen, 
  EventsScreen, 
  ProfileScreen, 
  PrayerScreen
} from '../screens';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 30 : 12);
  const barHeight = Platform.OS === 'ios' ? 92 : 72;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: 'rgba(255,255,255,0.05)',
          height: barHeight,
          paddingBottom: bottomPadding,
          paddingTop: 12,
          elevation: 0,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#475569',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          marginTop: 2,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg]}>
              <Home color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen 
        name="Watch" 
        component={SermonsScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg]}>
              <Play color={color} size={20} strokeWidth={focused ? 2.5 : 2} fill={focused ? color : 'transparent'} />
            </View>
          ),
          tabBarLabel: 'Watch'
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={PrayerScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg]}>
              <MessageSquare color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
          tabBarLabel: 'Family'
        }}
      />
      <Tab.Screen 
        name="Events" 
        component={EventsScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg]}>
              <Calendar color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
          tabBarLabel: 'Events'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg]}>
              <User color={color} size={20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBg: {
    backgroundColor: 'rgba(129, 140, 248, 0.12)',
  }
});
