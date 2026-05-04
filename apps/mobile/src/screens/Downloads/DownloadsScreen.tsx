import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Download, Trash2, PlayCircle, Music } from 'lucide-react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getDownloads, deleteDownload } from '../../utils/downloads';
import { getCachedData } from '../../utils/storage';

export default function DownloadsScreen() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (isFocused) {
      loadDownloads();
    }
  }, [isFocused]);

  const loadDownloads = async () => {
    const localDownloads = await getDownloads();
    const sermonMetadata = await getCachedData('sermons_list') || [];
    
    // Map downloaded IDs to their metadata
    const downloadedSermons = Object.keys(localDownloads).map(id => {
      const meta = sermonMetadata.find((s: any) => s.id === id);
      return {
        id,
        uri: localDownloads[id],
        title: meta?.title || 'Unknown Message',
        thumbnail: meta?.thumbnail_url,
      };
    });
    
    setDownloads(downloadedSermons);
  };

  const handleRemove = async (id: string) => {
    await deleteDownload(id);
    loadDownloads();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.downloadCard}>
      <View style={styles.thumbnailContainer}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholder]}>
            <Music color="#4f46e5" size={24} />
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.subtitle}>Audio Download Available Offline</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={() => navigation.navigate('SermonDetail', { sermonId: item.id })}
        >
          <PlayCircle color="#818cf8" size={28} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
          <Trash2 color="#94a3b8" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offline Library</Text>
        <Text style={styles.headerSubtitle}>{downloads.length} messages saved on this device.</Text>
      </View>

      <FlatList
        data={downloads}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Download color="#334155" size={64} />
            <Text style={styles.emptyTitle}>No Downloads</Text>
            <Text style={styles.emptySubtitle}>
              Sermons you download for offline listening will appear here.
            </Text>
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
  header: {
    padding: 24,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  downloadCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    padding: 4,
  },
  removeButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  }
});
