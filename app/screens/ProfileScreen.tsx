import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../context/RoleContext';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useRole();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header Area (Clickable to Edit) */}
        <TouchableOpacity 
          style={styles.profileHeader}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarLetter}>A</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alexandra Chen</Text>
            <Text style={styles.profileEmail}>alexandra@email.com</Text>
            <View style={styles.badge}>
              <Ionicons name="star" size={12} color="#D4AF37" />
              <Text style={styles.badgeText}>Gold Member</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* SETTINGS Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.cardGroup}>
            <TouchableOpacity style={styles.cardItem}>
              <View style={[styles.iconBox, { backgroundColor: '#2C2C2C' }]}>
                <Ionicons name="settings-outline" size={20} color="#D4AF37" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>App Settings</Text>
                <Text style={styles.cardSubtitle}>Notifications, Language</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SUPPORT Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          <View style={styles.cardGroup}>
            <TouchableOpacity style={[styles.cardItem, styles.cardItemBorder]}>
              <View style={[styles.iconBox, { backgroundColor: '#1A2F25' }]}>
                <Ionicons name="chatbubble-outline" size={20} color="#34C759" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Live Chat</Text>
                <Text style={styles.cardSubtitle}>Talk to our staff</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cardItem} onPress={logout}>
              <View style={[styles.iconBox, { backgroundColor: '#3A1E1E' }]}>
                <Ionicons name="log-out-outline" size={20} color="#FF453A" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: '#FF453A' }]}>Log Out</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C59B63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111111',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2418',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#4A3B22',
  },
  badgeText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888888',
  },
});
