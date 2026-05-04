import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { User, Bell, Shield, Download, LogOut, ChevronRight, Moon } from 'lucide-react-native';

export default function ProfileScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out of Praise Impact?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => console.log("Logout pressed") }
      ]
    );
  };

  const SettingItem = ({ icon: Icon, title, value, onToggle, isLink }: any) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      activeOpacity={isLink ? 0.7 : 1}
      disabled={!isLink}
    >
      <View style={styles.settingIcon}>
        <Icon color="#818cf8" size={20} />
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
      
      {onToggle ? (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: '#334155', true: '#4f46e5' }}
          thumbColor="#f8fafc"
        />
      ) : isLink ? (
        <ChevronRight color="#475569" size={20} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User color="#fff" size={40} />
        </View>
        <Text style={styles.userName}>Brother John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <SettingItem 
            icon={Bell} 
            title="Push Notifications" 
            value={notifications} 
            onToggle={setNotifications} 
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={Moon} 
            title="Dark Appearance" 
            value={darkMode} 
            onToggle={setDarkMode} 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content</Text>
        <View style={styles.card}>
          <SettingItem icon={Download} title="Manage Downloads" isLink />
          <View style={styles.divider} />
          <SettingItem icon={Shield} title="Privacy Policy" isLink />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color="#ef4444" size={20} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Praise Impact v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 60,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  userName: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 40,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    color: '#334155',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  }
});
