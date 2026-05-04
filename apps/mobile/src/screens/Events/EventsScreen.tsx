import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar, MapPin, Check } from 'lucide-react-native';
import axios from 'axios';

const API_URL = 'https://praiseimpact.vercel.app';

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRsvps, setMyRsvps] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = ''; // Get from storage
      const [eventsRes, myEventsRes] = await Promise.all([
        axios.get(`${API_URL}/events`),
        axios.get(`${API_URL}/events/me`, { headers: { Authorization: `Bearer ${token}` } })
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
      const token = ''; // Get from storage
      await axios.post(`${API_URL}/events/${eventId}/rsvp`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyRsvps([...myRsvps, eventId]);
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderEvent = ({ item }: { item: any }) => (
    <View style={styles.eventCard}>
      <View style={styles.dateBox}>
        <Text style={styles.dateDay}>{new Date(item.event_date).getDate()}</Text>
        <Text style={styles.dateMonth}>{new Date(item.event_date).toLocaleString('default', { month: 'short' })}</Text>
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventMeta}>
          <View style={styles.metaRow}>
            <Calendar color="#94a3b8" size={14} />
            <Text style={styles.metaText}>{formatDate(item.event_date)}</Text>
          </View>
          {item.location && (
            <View style={styles.metaRow}>
              <MapPin color="#94a3b8" size={14} />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.rsvpButton, myRsvps.includes(item.id) && styles.rsvpButtonActive]}
          onPress={() => !myRsvps.includes(item.id) && handleRSVP(item.id)}
          disabled={myRsvps.includes(item.id)}
        >
          {myRsvps.includes(item.id) && <Check color="#fff" size={14} style={{ marginRight: 4 }} />}
          <Text style={[styles.rsvpText, myRsvps.includes(item.id) && styles.rsvpTextActive]}>
            {myRsvps.includes(item.id) ? 'RSVP Confirmed' : 'I\'m Interested'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item: any) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Calendar color="#334155" size={48} />
            <Text style={styles.emptyText}>No upcoming events</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  eventCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dateBox: {
    backgroundColor: 'rgba(99,102,241,0.1)',
    borderRadius: 12,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
  },
  dateDay: {
    color: '#818cf8',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateMonth: {
    color: '#818cf8',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventMeta: {
    gap: 6,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  rsvpButton: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rsvpButtonActive: {
    backgroundColor: '#4f46e5',
  },
  rsvpText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rsvpTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 16,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  }
});
