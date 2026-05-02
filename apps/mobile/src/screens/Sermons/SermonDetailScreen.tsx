import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Download, Share2, PlayCircle, Headphones } from 'lucide-react-native';

export default function SermonDetailScreen({ route }: any) {
  const { sermon } = route.params || { 
    sermon: {
      title: 'The Power of Faith',
      speaker: 'Pastor John Doe',
      series: 'Faith Foundations',
      description: 'Join us as we explore what it means to truly walk by faith in our everyday lives. This powerful message will equip you to face challenges with unwavering trust in God.',
      source_type: 'youtube', // 'youtube' or 'cloudinary'
      video_url: 'dQw4w9WgXcQ', // Youtube ID or Cloudinary URL
      duration: '45 mins'
    }
  };

  const [playing, setPlaying] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('Sermon Finished');
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.playerContainer}>
        {sermon.source_type === 'youtube' && !audioOnly ? (
          <YoutubeIframe
            height={220}
            play={playing}
            videoId={sermon.video_url}
            onChangeState={onStateChange}
          />
        ) : sermon.source_type === 'cloudinary' || audioOnly ? (
           <View style={styles.nativePlayerWrapper}>
            <Video
              style={styles.nativePlayer}
              source={{
                uri: sermon.video_url, // For audioOnly, this should point to an audio track or use the video as audio
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping={false}
              onPlaybackStatusUpdate={status => {
                // @ts-ignore
                if(status.didJustFinish) {
                  setPlaying(false);
                }
              }}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{sermon.title}</Text>
            <Text style={styles.speaker}>{sermon.speaker} • {sermon.duration}</Text>
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
          <TouchableOpacity style={styles.actionButton}>
            <Download color="#94a3b8" size={20} />
            <Text style={styles.actionText}>Download</Text>
          </TouchableOpacity>
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
