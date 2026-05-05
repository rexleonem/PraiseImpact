import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { Send, UserCircle2, Clock, CheckCircle2, Heart } from 'lucide-react-native';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://praiseimpact.vercel.app';

export default function PrayerScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [prayers, setPrayers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  React.useEffect(() => {
    fetchMyPrayers();
  }, []);

  const fetchMyPrayers = async () => {
    setFetching(true);
    try {
      // In a real app, you'd get the token from storage
      const token = ''; 
      const res = await axios.get(`${API_URL}/prayers/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrayers(res.data);
    } catch (err) {
      console.log('Fetch error', err);
    } finally {
      setFetching(false);
    }
  };
  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a prayer request');
      return;
    }

    setLoading(true);
    try {
      const token = ''; // Get from storage
      await axios.post(`${API_URL}/prayers`, {
        content: message,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Your prayer request has been submitted.');
      setMessage('');
      fetchMyPrayers();
    } catch (err) {
      console.log('Submit error', err);
      Alert.alert('Error', 'Failed to submit prayer request.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock color="#94a3b8" size={16} />;
      case 'praying': return <Heart color="#ef4444" size={16} />;
      case 'answered': return <CheckCircle2 color="#22c55e" size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#94a3b8';
      case 'praying': return '#ef4444';
      case 'answered': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Submit a Prayer Request</Text>
        <Text style={styles.subtitle}>We are here to pray with you.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Share your prayer need..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={6}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <UserCircle2 color="#94a3b8" size={20} />
            <Text style={styles.switchLabel}>Submit Anonymously</Text>
          </View>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: '#334155', true: '#818cf8' }}
            thumbColor={isAnonymous ? '#4f46e5' : '#94a3b8'}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Send color="#fff" size={20} />
          <Text style={styles.submitText}>
            {loading ? 'Submitting...' : 'Send Request'}
          </Text>
        </TouchableOpacity>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>My Requests</Text>
          {fetching ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : prayers.length === 0 ? (
            <Text style={styles.emptyText}>No requests yet.</Text>
          ) : (
            prayers.map((item) => (
              <View key={item.id} style={styles.prayerCard}>
                <Text style={styles.prayerContent}>{item.content}</Text>
                <View style={styles.statusRow}>
                  {getStatusIcon(item.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))
          )}
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
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  textArea: {
    color: '#f8fafc',
    fontSize: 16,
    minHeight: 120,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listSection: {
    marginTop: 40,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  },
  prayerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  prayerContent: {
    color: '#f8fafc',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
