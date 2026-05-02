import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Radio, Play } from 'lucide-react-native';
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update with local IP for real device

export default function HomeScreen() {
  const [liveStatus, setLiveStatus] = useState<any>(null);

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/live`);
        setLiveStatus(res.data);
      } catch (err) {
        console.log('Error fetching live status', err);
      }
    };
    fetchLiveStatus();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to</Text>
        <Text style={styles.brand}>Praise Impact</Text>
      </View>

      {liveStatus?.is_live && (
        <TouchableOpacity style={styles.liveBanner}>
          <View style={styles.liveIndicator}>
            <Radio color="#ef4444" size={16} />
            <Text style={styles.liveText}>LIVE NOW</Text>
          </View>
          <Text style={styles.liveTitle}>Join our Sunday Service</Text>
          <TouchableOpacity style={styles.watchButton}>
            <Play color="#fff" size={16} fill="#fff" />
            <Text style={styles.watchText}>Watch Now</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Sermon</Text>
        <View style={styles.featuredCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1470&auto=format&fit=crop' }} 
            style={styles.featuredImage} 
          />
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>The Power of Faith</Text>
            <Text style={styles.featuredSpeaker}>Pastor John Doe</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionLabel}>Submit Prayer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionLabel}>View Events</Text>
          </TouchableOpacity>
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
  header: {
    padding: 24,
    paddingTop: 40,
  },
  greeting: {
    color: '#94a3b8',
    fontSize: 16,
  },
  brand: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: 'bold',
  },
  liveBanner: {
    margin: 20,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ef444433',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  liveText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  liveTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  watchButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  watchText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuredSpeaker: {
    color: '#94a3b8',
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionLabel: {
    color: '#f8fafc',
    fontWeight: '600',
  }
});
