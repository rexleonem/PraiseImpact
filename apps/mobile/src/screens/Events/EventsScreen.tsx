import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Platform } from 'react-native';
import { Calendar, MapPin, Check, ChevronRight, Clock } from 'lucide-react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://praiseimpact.vercel.app';

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRsvps, setMyRsvps] = useState<string[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const [eventsRes, myEventsRes] = await Promise.all([
        axios.get(`${API_URL}/events`),
        token ? axios.get(`${API_URL}/events/me`, { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve({ data: [] })
      ]);
      setEvents(eventsRes.data);
      setMyRsvps(myEventsRes.data.map((e: any) => e.id));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('Please login to RSVP');
        return;
      }
      await axios.post(`${API_URL}/events/${eventId}/rsvp`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyRsvps([...myRsvps, eventId]);
    } catch (err) {
      console.log(err);
    }
  };

  const renderEvent = ({ item, index }: { item: any, index: number }) => (
    <Animated.View style={[styles.eventCardContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity 
        style={styles.eventCard}
        activeOpacity={0.9}
        onPress={() => !myRsvps.includes(item.id) && handleRSVP(item.id)}
      >
        <View style={styles.dateSide}>
          <View style={styles.dateCircle}>
            <Text style={styles.dateDay}>{new Date(item.event_date).getDate()}</Text>
            <Text style={styles.dateMonth}>
              {new Date(item.event_date).toLocaleString('default', { month: 'short' }).toUpperCase()}
            </Text>
          </View>
          <View style={styles.dateLine} />
        </View>

        <View style={styles.contentSide}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={styles.metaGroup}>
            <View style={styles.metaItem}>
              <Clock color="#64748b" size={14} />
              <Text style={styles.metaText}>
                {new Date(item.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin color="#64748b" size={14} />
              <Text style={styles.metaText} numberOfLines={1}>{item.location || 'Main Sanctuary'}</Text>
            </View>
          </View>
          
          <View style={[styles.statusBadge, myRsvps.includes(item.id) && styles.statusBadgeActive]}>
            {myRsvps.includes(item.id) ? (
              <>
                <Check color="#fff" size={12} strokeWidth={3} />
                <Text style={styles.statusTextActive}>I'm attending</Text>
              </>
            ) : (
              <Text style={styles.statusText}>Interested? Tap to RSVP</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSub}>Upcoming Fellowship & Service</Text>
      </LinearGradient>

      <FlatList
        data={events}
        keyExtractor={(item: any) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => !loading ? (
          <View style={styles.emptyContainer}>
            <Calendar color="#334155" size={60} strokeWidth={1} />
            <Text style={styles.emptyText}>No upcoming events scheduled</Text>
          </View>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerSub: {
    color: '#818cf8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listContent: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 120,
  },
  eventCardContainer: {
    marginBottom: 24,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 32,
    padding: 20,
    gap: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  dateSide: {
    alignItems: 'center',
    gap: 12,
  },
  dateCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  dateDay: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },
  dateMonth: {
    color: '#818cf8',
    fontSize: 10,
    fontWeight: '900',
  },
  dateLine: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 1,
  },
  contentSide: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 24,
  },
  metaGroup: {
    gap: 8,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statusBadgeActive: {
    backgroundColor: '#10b98120',
    borderColor: '#10b98140',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextActive: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 16,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  }
});
