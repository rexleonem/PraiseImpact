import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { ChevronLeft } from 'lucide-react-native';
import { trackEvent } from '../../utils/analytics';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function LivePlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { videoId } = route.params as { videoId: string };

  React.useEffect(() => {
    trackEvent('start_live_view', undefined, { videoId });
    return () => {
      trackEvent('end_live_view', undefined, { videoId });
    };
  }, [videoId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color="#fff" size={24} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.liveIndicator}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.playerContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0` }}
            style={styles.webview}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>Sunday Service Live</Text>
        <Text style={styles.description}>
          Join us in worship and word. We are glad you're here!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1e293b',
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  infoContainer: {
    padding: 24,
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
  },
});
