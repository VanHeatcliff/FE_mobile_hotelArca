import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../context/RoleContext';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useRole();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/logo_full_arca.png')} 
            style={styles.headerLogo} 
          />
          <View>
            <Text style={styles.headerTitle}>Profil Saya</Text>
            <Text style={styles.headerSubtitle}>Hotel Arca Member</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card (Clickable to Edit) */}
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.9}
        >
          <View style={styles.goldAccentLine} />
          <View style={styles.profileHeader}>
            <View style={styles.avatarRing}>
              <Image 
                source={require('../../assets/avatar_rina.png')} 
                style={styles.profilePhoto} 
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Alexandra Chen</Text>
              <Text style={styles.profileEmail}>alexandra@email.com</Text>
              <View style={styles.badge}>
                <Ionicons name="star" size={12} color="#C49B30" />
                <Text style={styles.badgeText}>Gold Member</Text>
              </View>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#8B5E3C" />
            </View>
          </View>
        </TouchableOpacity>

        {/* SETTINGS Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PENGATURAN</Text>
          <View style={styles.cardGroup}>
            <TouchableOpacity style={styles.cardItem} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: '#FBF5ED' }]}>
                <Ionicons name="settings-outline" size={20} color="#8B5E3C" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Pengaturan Aplikasi</Text>
                <Text style={styles.cardSubtitle}>Notifikasi, Bahasa, & Tampilan</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#B08968" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SUPPORT Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BANTUAN & AKUN</Text>
          <View style={styles.cardGroup}>
            <TouchableOpacity style={[styles.cardItem, styles.cardItemBorder]} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: '#EBF7EE' }]}>
                <Ionicons name="chatbubble-outline" size={20} color="#2E7D32" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Live Chat</Text>
                <Text style={styles.cardSubtitle}>Hubungi staf pelayanan kami</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#B08968" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cardItem} onPress={logout} activeOpacity={0.7}>
              <View style={[styles.iconBox, { backgroundColor: '#FDF2F2' }]}>
                <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={[styles.cardTitle, { color: '#D32F2F' }]}>Keluar Akun</Text>
                <Text style={styles.cardSubtitle}>Keluar dari sesi saat ini</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D32F2F" style={{ opacity: 0.7 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF8F4',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5C3D2E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#B08968',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5EDE4',
    position: 'relative',
    overflow: 'hidden',
  },
  goldAccentLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#D4AF37',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    marginRight: 16,
  },
  profilePhoto: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D2B1F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: '#8C7B6B',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#F0E3C4',
  },
  badgeText: {
    color: '#C49B30',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  editBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBF5ED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5EDE4',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B08968',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F5EDE4',
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5EDE4',
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
    fontSize: 15,
    fontWeight: '700',
    color: '#3D2B1F',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#8C7B6B',
  },
});
