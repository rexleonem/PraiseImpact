import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { Send, UserCircle2 } from 'lucide-react-native';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export default function PrayerScreen() {
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a prayer request');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/prayer`, {
        message,
        is_anonymous: isAnonymous,
      });
      Alert.alert('Success', 'Your prayer request has been submitted.');
      setMessage('');
      setIsAnonymous(false);
    } catch (err) {
      console.log('Submit error', err);
      Alert.alert('Error', 'Failed to submit prayer request. Please try again.');
    } finally {
      setLoading(false);
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
});
