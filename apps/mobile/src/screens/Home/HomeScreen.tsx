import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, RefreshControl, Dimensions } from 'react-native';
import { Radio, Play, Calendar, MessageSquare, Bell, ArrowRight, Heart, Users, Share2, Bookmark } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getCachedData } from '../../utils/storage';
import { Skeleton } from '../../components/Skeleton';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://praiseimpact.vercel.app';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [liveStatus, setLiveStatus] = useState<any>(null);
  const [recentSermons, setRecentSermons] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    setLoading(true);
    try {
      await Promise.all([
        fetchLiveStatus(),
        fetchSermons(),
        fetchEvents()
      ]);
    } catch (err) {
      console.log('Error fetching home data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSermons = async () => {
    try {
      const res = await axios.get(`${API_URL}/sermons?limit=6`);
      setRecentSermons(res.data);
    } catch (err) {
      const cached = await getCachedData('sermons_list');
      if (cached) setRecentSermons(cached.slice(0, 6));
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      setUpcomingEvents(res.data);
    } catch (err) {
      console.log('Error fetching events', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const featuredSermon = recentSermons[0];
  const otherSermons = recentSermons.slice(1);

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
           <Skeleton width={120} height={28} />
           <Skeleton width={32} height={32} borderRadius={16} />
        </View>
        <View style={{ padding: 20 }}>
          <Skeleton width="100%" height={180} borderRadius={24} />
          <View style={{ marginTop: 24 }}>
            <Skeleton width="100%" height={80} borderRadius={20} />
          </View>
          <View style={{ marginTop: 24, flexDirection: 'row', gap: 12 }}>
            <Skeleton width={(width - 52) / 3} height={100} borderRadius={16} />
            <Skeleton width={(width - 52) / 3} height={100} borderRadius={16} />
            <Skeleton width={(width - 52) / 3} height={100} borderRadius={16} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#818cf8" />
      }
    >
      {/* --- ZONE 1: SPIRITUAL PULSE --- */}
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.15)', 'transparent']}
        style={styles.topGradient}
      >
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandName}>Praise Impact</Text>
            <Text style={styles.brandSub}>Faith & Community</Text>
          </View>
          <TouchableOpacity style={styles.notifIcon}>
            <Bell color="#f8fafc" size={20} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.pulseContainer}>
          {liveStatus?.is_live ? (
            <TouchableOpacity 
              style={styles.liveCardActive}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('LivePlayer', { videoId: liveStatus.video_id })}
            >
              <View style={styles.liveHeader}>
                <View style={styles.liveBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.liveLabel}>LIVE NOW</Text>
                </View>
                <Users color="rgba(255,255,255,0.7)" size={14} />
              </View>
              <Text style={styles.liveTitle}>Sunday Worship Experience</Text>
              <View style={styles.joinLiveBtn}>
                <Play color="#6366f1" size={16} fill="#6366f1" />
                <Text style={styles.joinLiveText}>Join Service</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.nextServiceHero}>
              <LinearGradient
                colors={['#4f46e5', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextServiceGradient}
              >
                <View style={styles.nextServiceContent}>
                  <View>
                    <Text style={styles.nextServiceLabel}>NEXT SERVICE</Text>
                    <Text style={styles.nextServiceTime}>Sunday • 9:00 AM</Text>
                  </View>
                  <View style={styles.countdownPill}>
                    <Text style={styles.countdownText}>2d 4h left</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* --- ZONE 2: PRIMARY ACTIONS --- */}
      <View style={styles.actionsZone}>
        <TouchableOpacity 
          style={styles.prayerHero}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Community')}
        >
          <LinearGradient
            colors={['#1e293b', '#0f172a']}
            style={styles.prayerHeroContent}
          >
            <View style={styles.prayerTextContainer}>
              <Text style={styles.prayerHeroTitle}>Need Prayer?</Text>
              <Text style={styles.prayerHeroSub}>Our community is standing with you.</Text>
              <View style={styles.prayerHeroBtn}>
                <Text style={styles.prayerHeroBtnText}>Submit Request</Text>
                <ArrowRight color="#818cf8" size={14} />
              </View>
            </View>
            <View style={styles.prayerIconCircle}>
              <Heart color="#ef4444" size={24} fill="#ef4444" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.subActions}>
          <TouchableOpacity style={styles.subActionCard} onPress={() => navigation.navigate('Watch')}>
            <View style={[styles.subActionIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Play color="#818cf8" size={22} fill="#818cf8" />
            </View>
            <Text style={styles.subActionLabel}>Watch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subActionCard} onPress={() => navigation.navigate('Events')}>
            <View style={[styles.subActionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Calendar color="#10b981" size={22} />
            </View>
            <Text style={styles.subActionLabel}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subActionCard} onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.subActionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Bookmark color="#f59e0b" size={22} />
            </View>
            <Text style={styles.subActionLabel}>Saved</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- ZONE 3: ENGAGEMENT --- */}
      
      {/* Featured/Recent Messages */}
      <View style={styles.engagementZone}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Watch')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentSermons.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {recentSermons.map((sermon) => (
              <TouchableOpacity 
                key={sermon.id} 
                style={styles.messageCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Watch', { screen: 'SermonDetail', params: { sermonId: sermon.id } })}
              >
                <Image source={{ uri: sermon.thumbnail_url }} style={styles.messageThumb} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.messageOverlay}
                >
                  <Text style={styles.messageTitle} numberOfLines={1}>{sermon.title}</Text>
                  <Text style={styles.messageMeta}>{Math.floor((sermon.duration || 0)/60)} mins</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No messages available yet.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => fetchData()}>
              <Text style={styles.emptyBtnText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Community Updates/Events */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Community Updates</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Text style={styles.seeAll}>View Calendar</Text>
          </TouchableOpacity>
        </View>

        {upcomingEvents.length > 0 ? (
          <View style={styles.eventsList}>
            {upcomingEvents.slice(0, 2).map((event) => (
              <TouchableOpacity key={event.id} style={styles.eventItem} activeOpacity={0.7}>
                <View style={styles.eventDateBox}>
                  <Text style={styles.eventDay}>{new Date(event.event_date).getDate()}</Text>
                  <Text style={styles.eventMonth}>
                    {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventMeta}>{event.location || 'Main Sanctuary'} • {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <ArrowRight color="#334155" size={16} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Calendar color="#334155" size={40} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>Stay tuned for upcoming events!</Text>
          </View>
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  topGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandContainer: {
    gap: 2,
  },
  brandName: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandSub: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#1e293b',
  },
  pulseContainer: {
    paddingHorizontal: 20,
  },
  liveCardActive: {
    backgroundColor: '#ef4444',
    padding: 24,
    borderRadius: 28,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  joinLiveBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  joinLiveText: {
    color: '#6366f1',
    fontWeight: '900',
    fontSize: 15,
  },
  nextServiceHero: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  nextServiceGradient: {
    padding: 24,
  },
  nextServiceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextServiceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  nextServiceTime: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  countdownPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  countdownText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  actionsZone: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  prayerHero: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  prayerHeroContent: {
    flexDirection: 'row',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prayerTextContainer: {
    flex: 1,
  },
  prayerHeroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  prayerHeroSub: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  prayerHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prayerHeroBtnText: {
    color: '#818cf8',
    fontWeight: 'bold',
    fontSize: 14,
  },
  prayerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  subActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  subActionCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  subActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subActionLabel: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  engagementZone: {
    paddingHorizontal: 20,
    marginTop: 32,
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
    color: '#818cf8',
    fontSize: 14,
    fontWeight: '700',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  messageCard: {
    width: 220,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#1e293b',
  },
  messageThumb: {
    width: '100%',
    height: '100%',
  },
  messageOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    justifyContent: 'flex-end',
  },
  messageTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  messageMeta: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  eventsList: {
    gap: 12,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  eventDateBox: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDay: {
    color: '#818cf8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventMonth: {
    color: '#818cf8',
    fontSize: 10,
    fontWeight: '800',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventMeta: {
    color: '#64748b',
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
    borderRadius: 12,
  },
  emptyBtnText: {
    color: '#818cf8',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
