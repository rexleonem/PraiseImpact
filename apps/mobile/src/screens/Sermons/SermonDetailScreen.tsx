import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import { useVideoPlayer, VideoView } from 'expo-video';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Download, Share2, PlayCircle, Headphones, Trash2, CheckCircle2, ChevronLeft, Bookmark, MessageCircle } from 'lucide-react-native';
import { savePlaybackPosition, getPlaybackPosition } from '../../utils/storage';
import { downloadSermonAudio, getLocalUri, deleteDownload } from '../../utils/downloads';
import { trackEvent } from '../../utils/analytics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const API_URL = 'https://praiseimpact.vercel.app';

export default function SermonDetailScreen({ route, navigation }: any) {
  const { sermon: initialSermon, sermonId } = route.params || {};
  const [sermon, setSermon] = useState<any>(initialSermon);
  const [loading, setLoading] = useState(!initialSermon && !!sermonId);
  const [audioOnly, setAudioOnly] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const player = useVideoPlayer(localUri || sermon?.video_url || '', (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    if (!sermon && sermonId) {
      fetchSermon(sermonId);
    }
    checkDownloadStatus();
    if (sermon?.id) trackEvent('view_sermon', sermon.id);
  }, [sermonId]);

  useEffect(() => {
    if (sermon?.id) {
      getPlaybackPosition(sermon.id).then(lastPos => {
        if (lastPos > 0) player.currentTime = lastPos;
      });
    }
  }, [sermon, player]);

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
      Alert.alert('Success', 'Message downloaded for offline listening.');
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
      Alert.alert('Error', 'Could not load message details');
    } finally {
      setLoading(false);
    }
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
        <Text style={{ color: '#fff' }}>Message not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.playerArea}>
        {audioOnly ? (
          <View style={styles.audioPlaceholder}>
            <LinearGradient
              colors={['#312e81', '#1e1b4b']}
              style={StyleSheet.absoluteFill}
            />
            <Headphones color="#818cf8" size={64} strokeWidth={1} />
            <Text style={styles.audioPlayingText}>Audio Only Mode Active</Text>
            {/* We still need the VideoView for native playback but we hide it */}
            <View style={{ width: 1, height: 1, opacity: 0 }}>
              <VideoView style={styles.nativePlayer} player={player} />
            </View>
          </View>
        ) : (
          <>
            {sermon.source_type === 'YOUTUBE' ? (
              <YoutubeIframe height={240} play={player.playing} videoId={sermon.video_url} />
            ) : (
              <View style={styles.nativePlayerWrapper}>
                <VideoView style={styles.nativePlayer} player={player} allowsFullscreen allowsPictureInPicture />
              </View>
            )}
          </>
        )}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
        <View style={styles.mainInfo}>
          <View style={styles.seriesLabel}>
            <Text style={styles.seriesText}>{sermon.series || 'Spiritual Growth'}</Text>
          </View>
          <Text style={styles.title}>{sermon.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.speakerText}>{sermon.speaker || 'Pastor Praise'}</Text>
            <View style={styles.dot} />
            <Text style={styles.durationText}>{Math.floor((sermon.duration || 0)/60)} mins</Text>
          </View>
        </View>

        <View style={styles.actionsPill}>
          <TouchableOpacity 
            style={[styles.pillBtn, audioOnly && styles.pillBtnActive]} 
            onPress={() => setAudioOnly(!audioOnly)}
          >
            <Headphones color={audioOnly ? '#fff' : '#94a3b8'} size={20} />
            <Text style={[styles.pillText, audioOnly && styles.pillTextActive]}>Audio Only</Text>
          </TouchableOpacity>
          
          <View style={styles.pillDivider} />
          
          {localUri ? (
            <TouchableOpacity style={styles.pillBtn} onPress={handleDeleteDownload}>
              <Trash2 color="#ef4444" size={20} />
              <Text style={[styles.pillText, { color: '#ef4444' }]}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.pillBtn} 
              onPress={handleDownload}
              disabled={downloading || !sermon.audio_url}
            >
              <Download color={downloading ? '#6366f1' : '#94a3b8'} size={20} />
              <Text style={styles.pillText}>{downloading ? 'Saving...' : 'Offline'}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.pillDivider} />

          <TouchableOpacity style={styles.pillBtn}>
            <Share2 color="#94a3b8" size={20} />
            <Text style={styles.pillText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionHeading}>About this message</Text>
          <Text style={styles.descriptionText}>{sermon.description}</Text>
        </View>

        <View style={styles.communitySection}>
          <TouchableOpacity style={styles.communityBtn}>
            <MessageCircle color="#818cf8" size={20} />
            <Text style={styles.communityBtnText}>Join the Conversation</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  playerArea: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
  },
  nativePlayerWrapper: {
    width: '100%',
    height: 240,
  },
  nativePlayer: {
    width: '100%',
    height: '100%',
  },
  audioPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1b4b',
  },
  audioPlayingText: {
    color: '#818cf8',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentArea: {
    flex: 1,
    padding: 24,
  },
  mainInfo: {
    marginBottom: 32,
  },
  seriesLabel: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  seriesText: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speakerText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
  },
  durationText: {
    color: '#64748b',
    fontSize: 14,
  },
  actionsPill: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 6,
    marginBottom: 40,
    alignItems: 'center',
  },
  pillBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 20,
  },
  pillBtnActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  pillText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  pillTextActive: {
    color: '#fff',
  },
  pillDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  descriptionSection: {
    marginBottom: 40,
  },
  sectionHeading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  descriptionText: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 26,
  },
  communitySection: {
    paddingBottom: 40,
  },
  communityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(129, 140, 248, 0.08)',
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.15)',
  },
  communityBtnText: {
    color: '#818cf8',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
