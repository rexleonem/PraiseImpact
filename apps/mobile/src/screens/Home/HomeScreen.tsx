import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, RefreshControl, Dimensions, Animated } from 'react-native';
import { Play, Calendar, Bell, ArrowRight, Heart, Users, Bookmark, Search, Headphones, BookOpen, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { io } from 'socket.io-client';
import { getCachedData } from '../../utils/storage';
import { Skeleton } from '../../components/Skeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { getEventMonth, getEventDay, getEventTime } from '../../utils/dateUtils';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://praiseimpact.vercel.app';
const SOCKET_URL = API_URL.replace('/api', '').replace('https://', 'wss://').replace('http://', 'ws://');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [liveStatus, setLiveStatus] = useState<any>(null);
  const [recentSermons, setRecentSermons] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const socketRef = useRef<any>(null);

  const nextService = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const time = now.getHours() * 60 + now.getMinutes();
    const sundayTime = 570; // 9:30 AM
    const midweekTime = 1080; // 6:00 PM

    const getNextOccurrence = (targetDay: number, targetMins: number) => {
      const d = new Date(now);
      d.setDate(now.getDate() + (targetDay - day + 7) % 7);
      d.setHours(Math.floor(targetMins / 60), targetMins % 60, 0, 0);
      if (d <= now) d.setDate(d.getDate() + 7);
      return d;
    };

    const nextSun = getNextOccurrence(0, sundayTime);
    const nextWed = getNextOccurrence(3, midweekTime);

    return nextSun < nextWed 
      ? { name: 'Sunday Service', day: 'Sunday', time: '9:30 AM', date: nextSun }
      : { name: 'Midweek Service', day: 'Wednesday', time: '6:00 PM', date: nextWed };
  }, [refreshing]);

  useEffect(() => {
    fetchData();
    const statusInterval = setInterval(fetchLiveStatus, 60000);
    
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const dist = nextService.date.getTime() - now;
      setCountdown({
        days: Math.floor(dist / (1000 * 60 * 60 * 24)),
        hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((dist % (1000 * 60)) / 1000),
      });
    }, 1000);

    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    return () => {
      clearInterval(statusInterval);
      clearInterval(countdownInterval);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [nextService]);

  useEffect(() => {
    if (liveStatus?.is_live && liveStatus?.video_id) {
      if (!socketRef.current) {
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('join-live', liveStatus.video_id);
        socketRef.current.on('viewer-count', (count: number) => setViewerCount(count));
      }
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setViewerCount(0);
      }
    }
  }, [liveStatus]);

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
      await Promise.all([fetchLiveStatus(), fetchSermons(), fetchEvents()]);
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
      setUpcomingEvents(res.data.slice(0, 3));
    } catch (err) {
      console.log('Error fetching events', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
           <Skeleton width={120} height={28} />
           <Skeleton width={32} height={32} borderRadius={16} />
        </View>
        <View style={{ padding: 20 }}>
          <Skeleton width="100%" height={240} borderRadius={32} />
          <View style={{ marginTop: 32, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Skeleton width="45%" height={80} borderRadius={20} />
            <Skeleton width="45%" height={80} borderRadius={20} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        <Text style={styles.floatingTitle}>Praise Impact</Text>
      </Animated.View>

      <Animated.ScrollView 
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#818cf8" />}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.heroSection}>
            <View style={styles.header}>
              <View>
                <Text style={styles.welcomeText}>Welcome home,</Text>
                <Text style={styles.brandName}>Praise Impact</Text>
              </View>
              <TouchableOpacity style={styles.avatarBtn}>
                <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=praise' }} style={styles.avatar} />
              </TouchableOpacity>
            </View>

            <View style={styles.pulseContainer}>
              {liveStatus?.is_live ? (
                <TouchableOpacity 
                  style={styles.liveHero}
                  activeOpacity={0.95}
                  onPress={() => navigation.navigate('LivePlayer', { videoId: liveStatus.video_id })}
                >
                  <Image source={{ uri: recentSermons[0]?.thumbnail_url || 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1470' }} style={StyleSheet.absoluteFill} />
                  <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(79, 70, 229, 0.9)']} style={StyleSheet.absoluteFill} />
                  <View style={styles.liveContent}>
                    <View style={styles.liveBadge}>
                      <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
                      <Text style={styles.liveLabel}>LIVE NOW</Text>
                    </View>
                    <Text style={styles.liveTitle}>Join our Live Worship Experience</Text>
                    <View style={styles.liveFooter}>
                      <View style={styles.viewerPill}>
                        <Users color="#fff" size={12} />
                        <Text style={styles.viewerText}>{viewerCount || 0} Watching</Text>
                      </View>
                      <View style={styles.playBtnCircle}>
                        <Play color="#6366f1" size={20} fill="#6366f1" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.nextServiceHero}>
                  <Image source={{ uri: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1473&auto=format&fit=crop' }} style={StyleSheet.absoluteFill} />
                  <LinearGradient colors={['rgba(15, 23, 42, 0.4)', 'rgba(15, 23, 42, 0.95)']} style={StyleSheet.absoluteFill} />
                  <View style={styles.nextServiceContent}>
                    <Text style={styles.nextLabel}>NEXT SERVICE</Text>
                    <Text style={styles.nextTime}>{nextService.name} • {nextService.day}, {nextService.time}</Text>
                    <View style={styles.countdownRow}>
                      <View style={styles.timePill}>
                        <Text style={styles.timeValue}>{String(countdown.days).padStart(2, '0')}</Text>
                        <Text style={styles.timeUnit}>DAYS</Text>
                      </View>
                      <View style={styles.timeDivider} />
                      <View style={styles.timePill}>
                        <Text style={styles.timeValue}>{String(countdown.hours).padStart(2, '0')}</Text>
                        <Text style={styles.timeUnit}>HRS</Text>
                      </View>
                      <View style={styles.timeDivider} />
                      <View style={styles.timePill}>
                        <Text style={styles.timeValue}>{String(countdown.minutes).padStart(2, '0')}</Text>
                        <Text style={styles.timeUnit}>MINS</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.quickLinks}>
            <TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate('Watch')}>
              <View style={[styles.linkIcon, { backgroundColor: '#818cf820' }]}><Headphones color="#818cf8" size={24} /></View>
              <Text style={styles.linkLabel}>Sermons</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate('Community')}>
              <View style={[styles.linkIcon, { backgroundColor: '#f43f5e20' }]}><Heart color="#f43f5e" size={24} fill="#f43f5e" /></View>
              <Text style={styles.linkLabel}>Prayers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate('Events')}>
              <View style={[styles.linkIcon, { backgroundColor: '#10b98120' }]}><Calendar color="#10b981" size={24} /></View>
              <Text style={styles.linkLabel}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkCard}>
              <View style={[styles.linkIcon, { backgroundColor: '#f59e0b20' }]}><BookOpen color="#f59e0b" size={24} /></View>
              <Text style={styles.linkLabel}>Bible</Text>
            </TouchableOpacity>
          </View>

          {/* --- UPCOMING EVENTS SECTION --- */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Events')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.eventsContainer}>
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => navigation.navigate('Events')}>
                  <View style={styles.eventDateBadge}>
                    <Text style={styles.eventMonth}>{getEventMonth(event.event_date)}</Text>
                    <Text style={styles.eventDay}>{getEventDay(event.event_date)}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                    <View style={styles.eventMeta}>
                      <Clock size={12} color="#64748b" />
                      <Text style={styles.eventTime}>{getEventTime(event.event_date)}</Text>
                    </View>
                  </View>
                  <ArrowRight size={18} color="#475569" />
                </TouchableOpacity>
              )) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No upcoming events scheduled.</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Teachings</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Watch')}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {recentSermons.map((sermon, idx) => (
                <TouchableOpacity 
                  key={sermon.id} 
                  style={[styles.premiumMessageCard, idx === 0 && { marginLeft: 20 }]}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('Watch', { screen: 'SermonDetail', params: { sermonId: sermon.id } })}
                >
                  <Image source={{ uri: sermon.thumbnail_url }} style={styles.messageImage} />
                  <LinearGradient colors={['transparent', 'rgba(15, 23, 42, 0.9)']} style={styles.messageOverlay}>
                    <View style={styles.messageContent}>
                      <Text style={styles.messageTitle} numberOfLines={1}>{sermon.title}</Text>
                      <View style={styles.messageFooter}>
                        <Text style={styles.messageSpeaker}>{sermon.speaker || 'Pastor Praise'}</Text>
                        <View style={styles.durationPill}><Text style={styles.durationText}>{Math.floor((sermon.duration || 0)/60)}m</Text></View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.prayerBannerContainer}>
            <TouchableOpacity style={styles.prayerBanner} onPress={() => navigation.navigate('Community')}>
              <LinearGradient colors={['#1e293b', '#0f172a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.prayerBannerGradient}>
                <View style={styles.prayerBannerText}>
                  <Text style={styles.prayerTitle}>Need Spiritual Support?</Text>
                  <Text style={styles.prayerSub}>Our prayer warriors are here for you 24/7.</Text>
                </View>
                <View style={styles.prayerAction}><ArrowRight color="#fff" size={20} /></View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const BlurView = ({ style, intensity, tint }: any) => (
  <View style={[style, { backgroundColor: tint === 'dark' ? `rgba(15, 23, 42, ${intensity/100})` : `rgba(255,255,255, ${intensity/100})` }]} />
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: Platform.OS === 'ios' ? 100 : 70, zIndex: 10, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 12 },
  floatingTitle: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  heroSection: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20 },
  header: { paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  welcomeText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  brandName: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -1 },
  avatarBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#334155', overflow: 'hidden', backgroundColor: '#1e293b' },
  avatar: { width: '100%', height: '100%' },
  pulseContainer: { paddingHorizontal: 20 },
  liveHero: { height: 240, borderRadius: 32, overflow: 'hidden', shadowColor: '#6366f1', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12 },
  liveContent: { flex: 1, padding: 24, justifyContent: 'flex-end' },
  liveBadge: { position: 'absolute', top: 20, left: 20, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveLabel: { color: '#fff', fontSize: 10, fontWeight: '900' },
  liveTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 16, lineHeight: 34 },
  liveFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  viewerPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  viewerText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  playBtnCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  nextServiceHero: { height: 200, borderRadius: 32, overflow: 'hidden' },
  nextServiceContent: { flex: 1, padding: 24, justifyContent: 'center' },
  nextLabel: { color: '#818cf8', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  nextTime: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  countdownRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  timePill: { alignItems: 'center' },
  timeValue: { color: '#fff', fontSize: 24, fontWeight: '900' },
  timeUnit: { color: '#64748b', fontSize: 10, fontWeight: '800', marginTop: 2 },
  timeDivider: { width: 1, height: 30, backgroundColor: '#334155' },
  quickLinks: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 32 },
  linkCard: { alignItems: 'center', gap: 8 },
  linkIcon: { width: 60, height: 60, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  linkLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  contentSection: { marginTop: 40 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 20 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  seeAll: { color: '#818cf8', fontSize: 14, fontWeight: '700' },
  horizontalScroll: { paddingBottom: 10 },
  eventsContainer: { paddingHorizontal: 24, gap: 12 },
  eventCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 12, borderRadius: 20, gap: 16 },
  eventDateBadge: { width: 50, height: 50, backgroundColor: '#334155', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  eventMonth: { color: '#818cf8', fontSize: 10, fontWeight: '800' },
  eventDay: { color: '#fff', fontSize: 18, fontWeight: '900' },
  eventInfo: { flex: 1, gap: 4 },
  eventTitle: { color: '#f1f5f9', fontSize: 16, fontWeight: 'bold' },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eventTime: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 14 },
  premiumMessageCard: { width: 260, height: 160, borderRadius: 28, overflow: 'hidden', marginRight: 16, backgroundColor: '#1e293b', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  messageImage: { width: '100%', height: '100%' },
  messageOverlay: { ...StyleSheet.absoluteFillObject, padding: 16, justifyContent: 'flex-end' },
  messageContent: { gap: 4 },
  messageTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  messageFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  messageSpeaker: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  durationPill: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  durationText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  prayerBannerContainer: { paddingHorizontal: 20, marginTop: 40 },
  prayerBanner: { borderRadius: 32, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  prayerBannerGradient: { flexDirection: 'row', padding: 24, alignItems: 'center', justifyContent: 'space-between' },
  prayerBannerText: { flex: 1, gap: 4 },
  prayerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  prayerSub: { color: '#94a3b8', fontSize: 13 },
  prayerAction: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  spacer: { height: 120 }
});
