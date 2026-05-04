import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Radio, Play, Calendar, MessageSquare, Bell, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getCachedData } from '../../utils/storage';

const API_URL = 'https://praiseimpact.vercel.app';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [liveStatus, setLiveStatus] = useState<any>(null);
  const [recentSermons, setRecentSermons] = useState<any[]>([]);
  const [nextEvent, setNextEvent] = useState<any>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchLiveStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/live`);
      setLiveStatus(res.data);
    } catch (err) {
      console.log('Error fetching live status', err);
    }
  };

  const fetchData = async () => {
    try {
      fetchLiveStatus();
      
      const [sermonsRes, eventsRes] = await Promise.all([
        axios.get(`${API_URL}/sermons?limit=5`),
        axios.get(`${API_URL}/events`)
      ]);
      
      setRecentSermons(sermonsRes.data);
      if (eventsRes.data.length > 0) {
        setNextEvent(eventsRes.data[0]);
      }
    } catch (err) {
      console.log('Error fetching home data', err);
      // Fallback to cache
      const cached = await getCachedData('sermons_list');
      if (cached) setRecentSermons(cached.slice(0, 5));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.brand}>Praise Impact</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Bell color="#94a3b8" size={24} />
        </TouchableOpacity>
      </View>

      {liveStatus?.is_live && (
        <TouchableOpacity 
          style={styles.liveBanner}
          onPress={() => navigation.navigate('LivePlayer', { videoId: liveStatus.video_id })}
        >
          <View style={styles.liveIndicator}>
            <Radio color="#ef4444" size={16} />
            <Text style={styles.liveText}>LIVE NOW</Text>
          </View>
          <Text style={styles.liveTitle}>Join our Sunday Service</Text>
          <View style={styles.watchButton}>
            <Play color="#fff" size={16} fill="#fff" />
            <Text style={styles.watchText}>Watch Now</Text>
          </View>
        </TouchableOpacity>
      )}

      {nextEvent && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Upcoming Event</Text>
          <TouchableOpacity 
            style={styles.eventCard}
            onPress={() => navigation.navigate('Events')}
          >
            <View style={styles.eventDateBox}>
              <Calendar color="#818cf8" size={24} />
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{nextEvent.title}</Text>
              <Text style={styles.eventDate}>
                {new Date(nextEvent.event_date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Sermons</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Sermons')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {recentSermons.map((sermon) => (
            <TouchableOpacity 
              key={sermon.id} 
              style={styles.sermonCard}
              onPress={() => navigation.navigate('Sermons', { screen: 'SermonDetail', params: { sermonId: sermon.id } })}
            >
              <Image source={{ uri: sermon.thumbnail_url || 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe' }} style={styles.sermonThumb} />
              <Text style={styles.sermonTitle} numberOfLines={1}>{sermon.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Prayer')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <MessageSquare color="#ef4444" size={20} />
            </View>
            <Text style={styles.actionLabel}>Submit Prayer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Events')}
          >
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Calendar color="#6366f1" size={20} />
            </View>
            <Text style={styles.actionLabel}>View Events</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
  },
  headerAction: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  greeting: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  brand: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
  },
  liveBanner: {
    margin: 24,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  liveText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  liveTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  watchButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  watchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  eventDateBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  horizontalScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  sermonCard: {
    width: 200,
    marginRight: 16,
  },
  sermonThumb: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    marginBottom: 8,
  },
  sermonTitle: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 14,
  }
});
