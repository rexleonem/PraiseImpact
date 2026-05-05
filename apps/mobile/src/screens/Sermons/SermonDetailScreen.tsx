import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useVideoPlayer, VideoView } from 'expo-video';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Download, Share2, PlayCircle, Headphones, Trash2, CheckCircle2 } from 'lucide-react-native';
import { savePlaybackPosition, getPlaybackPosition } from '../../utils/storage';
import { downloadSermonAudio, getLocalUri, deleteDownload } from '../../utils/downloads';
import { trackEvent } from '../../utils/analytics';

const API_URL = 'https://praiseimpact.vercel.app';

export default function SermonDetailScreen({ route }: any) {
  const { sermon: initialSermon, sermonId } = route.params || {};
  const [sermon, setSermon] = useState<any>(initialSermon);
  const [loading, setLoading] = useState(!initialSermon && !!sermonId);
  const [audioOnly, setAudioOnly] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);

  // Initialize expo-video player
  const player = useVideoPlayer(localUri || sermon?.video_url || '', (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    if (!sermon && sermonId) {
      fetchSermon(sermonId);
    }
    checkDownloadStatus();
    
    if (sermon?.id) {
       trackEvent('view_sermon', sermon.id);
    }
  }, [sermonId]);

  useEffect(() => {
    if (sermon?.id) {
      getPlaybackPosition(sermon.id).then(lastPos => {
        if (lastPos > 0) {
          player.currentTime = lastPos;
        }
      });
    }
  }, [sermon, player]);

  // Track playback position
  useEffect(() => {
    const interval = setInterval(() => {
      if (player.playing && sermon?.id) {
        savePlaybackPosition(sermon.id, Math.floor(player.currentTime));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [player, sermon]);

  const checkDownloadStatus = async () => {
    if (sermon?.id) {
      const uri = await getLocalUri(sermon.id);
      setLocalUri(uri);
    }
  };

  const handleDownload = async () => {
    if (!sermon?.audio_url || downloading) return;
    setDownloading(true);
    try {
      const uri = await downloadSermonAudio(sermon.id, sermon.audio_url);
      setLocalUri(uri);
      Alert.alert('Success', 'Sermon audio downloaded for offline listening.');
    } catch (err) {
      Alert.alert('Error', 'Download failed.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteDownload = async () => {
    if (!sermon?.id) return;
    await deleteDownload(sermon.id);
    setLocalUri(null);
  };

  const fetchSermon = async (id: string) => {
    try {
      const res = await axios.get(`${API_URL}/sermons/${id}`);
      setSermon(res.data);
    } catch (err) {
      console.error('Error fetching sermon', err);
      Alert.alert('Error', 'Could not load sermon details');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return '0 mins';
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!sermon) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Sermon not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.playerContainer}>
        {sermon.source_type === 'YOUTUBE' && !audioOnly ? (
          Platform.OS === 'web' ? (
            <iframe
              src={`https://www.youtube.com/embed/${sermon.video_url}?autoplay=1&modestbranding=1`}
              style={{ width: '100%', height: 220, border: 'none' }}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <YoutubeIframe
              height={220}
              play={player.playing}
              videoId={sermon.video_url}
            />
          )
        ) : (sermon.source_type === 'CLOUDINARY' || audioOnly) ? (
           <View style={styles.nativePlayerWrapper}>
            <VideoView
              style={styles.nativePlayer}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>
        ) : null}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{sermon.title}</Text>
            <Text style={styles.speaker}>{sermon.speaker || 'Pastor'} • {formatDuration(sermon.duration)}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionButton, audioOnly && styles.actionButtonActive]}
            onPress={() => setAudioOnly(!audioOnly)}
          >
            <Headphones color={audioOnly ? '#fff' : '#94a3b8'} size={20} />
            <Text style={[styles.actionText, audioOnly && styles.actionTextActive]}>Audio</Text>
          </TouchableOpacity>
          {localUri ? (
            <TouchableOpacity style={styles.actionButton} onPress={handleDeleteDownload}>
              <Trash2 color="#ef4444" size={20} />
              <Text style={[styles.actionText, { color: '#ef4444' }]}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleDownload}
              disabled={downloading || !sermon.audio_url}
            >
              <Download color={downloading ? '#4f46e5' : "#94a3b8"} size={20} />
              <Text style={styles.actionText}>{downloading ? 'Downloading...' : 'Download'}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton}>
            <Share2 color="#94a3b8" size={20} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Series</Text>
          <View style={styles.seriesTag}>
            <Text style={styles.seriesText}>{sermon.series || 'Stand-alone Message'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{sermon.description}</Text>
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
  playerContainer: {
    width: '100%',
    backgroundColor: '#000',
    minHeight: 220,
  },
  nativePlayerWrapper: {
    height: 220,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativePlayer: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  speaker: {
    color: '#94a3b8',
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(99,102,241,0.1)',
  },
  actionText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  actionTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  seriesTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(99,102,241,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
  },
  seriesText: {
    color: '#818cf8',
    fontWeight: '600',
    fontSize: 14,
  },
  description: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 24,
  }
});
