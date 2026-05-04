import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { Search, Filter, Play } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_URL = 'https://praiseimpact.vercel.app';

export default function SermonsScreen() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchSermons(1);
  }, []);

  const fetchSermons = async (pageNum: number) => {
    if (loading || (!hasMore && pageNum > 1)) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/sermons?page=${pageNum}&limit=10`);
      if (res.data.length < 10) setHasMore(false);
      
      if (pageNum === 1) {
        setSermons(res.data);
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

  const renderSermon = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.sermonCard}
      onPress={() => navigation.navigate('SermonDetail', { sermon: item })}
    >
      <Image source={{ uri: item.thumbnail_url || 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1470&auto=format&fit=crop' }} style={styles.thumbnail} />
      <View style={styles.cardOverlay}>
        <View style={styles.playIcon}>
          <Play color="#fff" size={24} fill="#fff" />
        </View>
      </View>
      <View style={styles.sermonInfo}>
        <Text style={styles.sermonTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.sermonMeta}>{item.speaker} • {item.series || 'Single'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search color="#94a3b8" size={20} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search sermons..." 
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity>
          <Filter color="#94a3b8" size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sermons}
        keyExtractor={(item: any) => item.id}
        renderItem={renderSermon}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text style={styles.loadingText}>Loading...</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  sermonCard: {
    flex: 0.48,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 120,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99,102,241,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sermonInfo: {
    padding: 12,
  },
  sermonTitle: {
    color: '#f8fafc',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sermonMeta: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  loadingText: {
    color: '#94a3b8',
    textAlign: 'center',
    padding: 16,
  }
});
