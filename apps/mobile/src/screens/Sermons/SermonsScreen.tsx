import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, Platform, Dimensions, Animated } from 'react-native';
import { Search, Filter, Play, WifiOff, Clock, User, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { cacheData, getCachedData } from '../../utils/storage';
import { Skeleton } from '../../components/Skeleton';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://praiseimpact.vercel.app';

export default function SermonsScreen() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigation = useNavigation<any>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    loadInitialData();
    return () => unsubscribe();
  }, []);

  const loadInitialData = async () => {
    const cached = await getCachedData('sermons_list');
    if (cached) setSermons(cached);
    fetchSermons(1);
  };

  const fetchSermons = async (pageNum: number) => {
    if (loading || (!hasMore && pageNum > 1)) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/sermons?page=${pageNum}&limit=10`);
      if (res.data.length < 10) setHasMore(false);
      if (pageNum === 1) {
        setSermons(res.data);
        await cacheData('sermons_list', res.data);
      } else {
        setSermons(prev => [...prev, ...res.data]);
      }
      setPage(pageNum);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchSermons(page + 1);
    }
  };

  const renderSermon = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity 
      style={styles.premiumCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('SermonDetail', { sermonId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.4)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.playIconOverlay}>
          <Play color="#fff" size={20} fill="#fff" />
        </View>
        {item.duration && (
          <View style={styles.durationTag}>
            <Text style={styles.durationTagText}>{Math.floor(item.duration/60)}:{(item.duration%60).toString().padStart(2, '0')}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <User color="#64748b" size={12} />
          <Text style={styles.cardSpeaker} numberOfLines={1}>{item.speaker || 'Pastor Praise'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.headerArea}>
        <View style={styles.topRow}>
          <Text style={styles.pageTitle}>Teachings</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#94a3b8" size={18} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for messages, speakers..." 
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['All', 'Teaching', 'Worship', 'Healing', 'Series'].map((chip) => (
            <TouchableOpacity 
              key={chip} 
              style={[styles.chip, activeFilter === chip && styles.chipActive]}
              onPress={() => setActiveFilter(chip)}
            >
              <Text style={[styles.chipText, activeFilter === chip && styles.chipTextActive]}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <WifiOff color="#fff" size={14} />
          <Text style={styles.offlineText}>Offline Mode • Viewing Cached Content</Text>
        </View>
      )}

      <FlatList
        data={sermons}
        keyExtractor={(item: any) => item.id}
        renderItem={renderSermon}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={loading && sermons.length === 0 ? (
          <View style={styles.skeletonGrid}>
            {[1,2,3,4].map(i => (
              <View key={i} style={styles.skeletonCard}>
                <Skeleton width="100%" height={160} borderRadius={24} />
                <View style={{ marginTop: 12 }}>
                  <Skeleton width="90%" height={18} borderRadius={4} />
                  <View style={{ marginTop: 8 }}>
                    <Skeleton width="50%" height={12} borderRadius={4} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : null}
        ListFooterComponent={loading && sermons.length > 0 ? (
          <View style={styles.footerLoader}>
            <View style={styles.loaderDot} />
            <Text style={styles.loaderText}>Loading more messages...</Text>
          </View>
        ) : <View style={{ height: 100 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerArea: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  pageTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    height: 54,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  filterScroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  chipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#818cf8',
  },
  chipText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 20,
    paddingTop: 24,
    gap: 20,
  },
  premiumCard: {
    backgroundColor: '#1e293b',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 180,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  durationTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  cardInfo: {
    padding: 20,
    gap: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardSpeaker: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  footerLoader: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  loaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#818cf8',
  },
  loaderText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  offlineBanner: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  offlineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  skeletonGrid: {
    gap: 24,
  },
  skeletonCard: {
    width: '100%',
  }
});
