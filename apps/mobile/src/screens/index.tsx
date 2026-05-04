import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from './Home/HomeScreen';
import SermonsScreen from './Sermons/SermonsScreen';
import PrayerScreen from './Prayer/PrayerScreen';
import EventsScreen from './Events/EventsScreen';
import ProfileScreen from './Profile/ProfileScreen';
import DownloadsScreen from './Downloads/DownloadsScreen';

const placeholder = (name: string) => () => (
  <View style={styles.container}>
    <Text style={styles.text}>{name} Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export { HomeScreen, SermonsScreen, PrayerScreen, EventsScreen, ProfileScreen, DownloadsScreen };
