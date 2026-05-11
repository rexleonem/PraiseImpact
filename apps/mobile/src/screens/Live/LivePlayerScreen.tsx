import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform, ScrollView, Animated, ActivityIndicator, Dimensions } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { ChevronLeft, Share2, Users, Info, MessageSquare, ExternalLink } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LivePlayerScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { videoId } = route.params as { videoId: string };
  
  const [playing, setPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing animation for the Live indicator
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e1b4b', '#0f172a']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <View style={styles.backIconCircle}>
              <ChevronLeft color="#fff" size={24} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.liveBadge}>
            <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
            <Text style={styles.liveText}>LIVE NOW</Text>
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <Share2 color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* --- PLAYER SECTION --- */}
          <View style={styles.playerWrapper}>
            {loading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator color="#6366f1" size="large" />
              </View>
            )}
            <View style={styles.playerInner}>
              <YoutubePlayer
                height={width * 0.5625}
                play={playing}
                videoId={videoId}
                onChangeState={onStateChange}
                onReady={() => setLoading(false)}
                webViewProps={{
                  allowsFullscreenVideo: true,
                }}
              />
            </View>
          </View>

          {/* --- CONTENT SECTION --- */}
          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.category}>SUNDAY SERVICE EXPERIENCE</Text>
                <Text style={styles.title}>Worship & The Word: Living in Praise</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Users size={14} color="#818cf8" />
                <Text style={styles.statText}>1,240 Watching</Text>
              </View>
              <View style={styles.statPill}>
                <MessageSquare size={14} color="#818cf8" />
                <Text style={styles.statText}>48 Comments</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <View style={styles.infoLabelContainer}>
                <Info size={16} color="#64748b" />
                <Text style={styles.infoLabel}>ABOUT THIS SERVICE</Text>
              </View>
              <Text style={styles.description}>
                Welcome to Praise Impact Missions! Join our global family for an immersive encounter with the Holy Spirit. Today's message focuses on the transformative power of a grateful heart and how praise opens doors of breakthrough in every season of life.
              </Text>
            </View>

            {/* --- ENGAGEMENT CARDS --- */}
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient
                  colors={['#4f46e520', '#4f46e510']}
                  style={styles.cardGradient}
                >
                  <MessageSquare color="#818cf8" size={24} />
                  <Text style={styles.cardTitle}>Live Chat</Text>
                  <Text style={styles.cardSub}>Engage with family</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient
                  colors={['#10b98120', '#10b98110']}
                  style={styles.cardGradient}
                >
                  <ExternalLink color="#34d399" size={24} />
                  <Text style={styles.cardTitle}>Give Online</Text>
                  <Text style={styles.cardSub}>Support the mission</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.prayerRequestBtn}>
              <Text style={styles.prayerBtnText}>Submit Prayer Request</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  backIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  liveText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  playerInner: {
    flex: 1,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  contentContainer: {
    padding: 24,
  },
  titleRow: {
    marginBottom: 20,
  },
  titleContainer: {
    gap: 4,
  },
  category: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(129, 140, 248, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 32,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  description: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 4,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSub: {
    color: '#64748b',
    fontSize: 12,
  },
  prayerRequestBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  prayerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
