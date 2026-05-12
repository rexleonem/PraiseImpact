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

  const bottomOffset = Platform.OS === 'android'
    ? Math.max(insets.bottom, 28)
    : Math.max(insets.bottom, 16);
  const barHeight = 68;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: bottomOffset,
          backgroundColor: 'rgba(15, 23, 42, 0.96)',
          borderColor: 'rgba(148, 163, 184, 0.14)',
          height: barHeight,
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 8,
          elevation: 18,
          borderWidth: 1,
          borderTopWidth: 1,
          borderRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 18,
        },
        tabBarActiveTintColor: '#818cf8',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          marginTop: 1,
          textTransform: 'uppercase',
          letterSpacing: 0,
        },
        tabBarItemStyle: {
          height: 52,
          borderRadius: 18,
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
