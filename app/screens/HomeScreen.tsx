import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [aiQuery, setAiQuery] = useState('');
  const navigation = useNavigation<any>();

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
            <Text style={styles.headerTitle}>Hotel Arca</Text>
            <Text style={styles.headerSubtitle}>Luxury Experience</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications-outline" size={22} color="#5C3D2E" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <View style={styles.avatarRing}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' }} 
              style={styles.profilePhoto} 
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Welcome Banner */}
        <View style={styles.heroBanner}>
          <LinearGradient
            colors={['#8B5E3C', '#C4956A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextArea}>
                <Text style={styles.heroGreeting}>Selamat Datang! 🌟</Text>
                <Text style={styles.heroMessage}>Temukan pengalaman menginap terbaik di Hotel Arca</Text>
              </View>
              <View style={styles.heroDecor}>
                <Ionicons name="diamond-outline" size={48} color="rgba(255,255,255,0.2)" />
              </View>
            </View>
            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </View>

        {/* Booking Form */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="search" size={18} color="#8B5E3C" />
            <Text style={styles.sectionTitle}>Cari Kamar</Text>
          </View>
          <View style={styles.bookingCard}>
            <View style={styles.goldAccentLine} />
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="calendar-outline" size={14} color="#B08968" />
                  <Text style={styles.inputLabel}>Check-in</Text>
                </View>
                <Text style={styles.inputValue}>12 Mei 2026</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="calendar-outline" size={14} color="#B08968" />
                  <Text style={styles.inputLabel}>Check-out</Text>
                </View>
                <Text style={styles.inputValue}>14 Mei 2026</Text>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="people-outline" size={14} color="#B08968" />
                  <Text style={styles.inputLabel}>Tamu & Kamar</Text>
                </View>
                <Text style={styles.inputValue}>2 Dewasa, 1 Kamar</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.searchButton} activeOpacity={0.85} onPress={() => navigation.navigate('RoomList')}>
              <LinearGradient
                colors={['#8B5E3C', '#A0724E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.searchButtonGradient}
              >
                <Ionicons name="search" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.searchButtonText}>Cari Kamar Tersedia</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Recommendation */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={18} color="#D4AF37" />
            <Text style={styles.sectionTitle}>Rekomendasi Cerdas AI</Text>
          </View>
          <View style={styles.aiCard}>
            <View style={styles.aiIconCircle}>
              <Ionicons name="sparkles" size={20} color="#D4AF37" />
            </View>
            <View style={styles.aiInputArea}>
              <TextInput 
                style={styles.aiInput}
                placeholder="'Kamar yang cocok untuk keluarga?'"
                placeholderTextColor="#B5A897"
                value={aiQuery}
                onChangeText={setAiQuery}
                multiline
              />
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>Powered by AI</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.aiButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#D4AF37', '#C49B30']}
                style={styles.aiButtonGradient}
              >
                <Ionicons name="send" size={14} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Room Types */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bed-outline" size={18} color="#8B5E3C" />
            <Text style={styles.sectionTitle}>Pilihan Kamar</Text>
          </View>
          
          {/* VIP Room */}
          <View style={styles.roomCard}>
            <View style={styles.roomImageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop' }} 
                style={styles.roomImage} 
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={styles.roomImageOverlay}
              />
              <View style={styles.roomBadge}>
                <Ionicons name="diamond" size={10} color="#FFF" />
                <Text style={styles.roomBadgeText}>VIP</Text>
              </View>
              <View style={styles.roomRatingBadge}>
                <Ionicons name="star" size={10} color="#FFD700" />
                <Text style={styles.roomRatingText}>4.9</Text>
              </View>
            </View>
            <View style={styles.roomInfo}>
              <View>
                <Text style={styles.roomTitle}>Kamar VIP (Suite)</Text>
                <Text style={styles.roomDesc}>Fasilitas premium, pemandangan kota, akses lounge.</Text>
                <View style={styles.roomFacilities}>
                  <View style={styles.facilityItem}>
                    <Ionicons name="wifi" size={12} color="#B08968" />
                    <Text style={styles.facilityText}>WiFi</Text>
                  </View>
                  <View style={styles.facilityItem}>
                    <Ionicons name="tv" size={12} color="#B08968" />
                    <Text style={styles.facilityText}>TV</Text>
                  </View>
                  <View style={styles.facilityItem}>
                    <Ionicons name="cafe" size={12} color="#B08968" />
                    <Text style={styles.facilityText}>Minibar</Text>
                  </View>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.roomPrice}>Rp 3.500.000</Text>
                <Text style={styles.perNight}>/malam</Text>
              </View>
            </View>
          </View>

          {/* Regular Room */}
          <View style={styles.roomCard}>
            <View style={styles.roomImageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop' }} 
                style={styles.roomImage} 
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={styles.roomImageOverlay}
              />
              <View style={[styles.roomBadge, { backgroundColor: '#5CB85C' }]}>
                <Ionicons name="flame" size={10} color="#FFF" />
                <Text style={styles.roomBadgeText}>POPULER</Text>
              </View>
              <View style={styles.roomRatingBadge}>
                <Ionicons name="star" size={10} color="#FFD700" />
                <Text style={styles.roomRatingText}>4.7</Text>
              </View>
            </View>
            <View style={styles.roomInfo}>
              <View>
                <Text style={styles.roomTitle}>Kamar Reguler (Deluxe)</Text>
                <Text style={styles.roomDesc}>Nyaman dan luas, cocok untuk istirahat.</Text>
                <View style={styles.roomFacilities}>
                  <View style={styles.facilityItem}>
                    <Ionicons name="wifi" size={12} color="#B08968" />
                    <Text style={styles.facilityText}>WiFi</Text>
                  </View>
                  <View style={styles.facilityItem}>
                    <Ionicons name="tv" size={12} color="#B08968" />
                    <Text style={styles.facilityText}>TV</Text>
                  </View>
                  <View style={styles.facilityItem}>
                    <Ionicons name="snow" size={12} color="#B08968" />
                    <Text style={styles.facilityText}>AC</Text>
                  </View>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.roomPrice}>Rp 1.200.000</Text>
                <Text style={styles.perNight}>/malam</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#8B5E3C" />
            <Text style={styles.sectionTitle}>Ulasan Tamu</Text>
            <View style={styles.ratingOverall}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingOverallText}>4.8</Text>
            </View>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.quoteDecor}>
              <Text style={styles.quoteIcon}>❝</Text>
            </View>
            <View style={styles.reviewHeader}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' }} 
                style={styles.reviewerAvatar} 
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>Budi Santoso</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={12} color="#FFD700" />
                  ))}
                  <Text style={styles.reviewDate}>2 hari lalu</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>"Pengalaman menginap di kamar VIP sangat luar biasa. Pelayanan sangat cepat dan ramah. AI rekomendasinya juga sangat membantu!"</Text>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.quoteDecor}>
              <Text style={styles.quoteIcon}>❝</Text>
            </View>
            <View style={styles.reviewHeader}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' }} 
                style={styles.reviewerAvatar} 
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>Siti Aminah</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4].map((star) => (
                    <Ionicons key={star} name="star" size={12} color="#FFD700" />
                  ))}
                  <Ionicons name="star-half" size={12} color="#FFD700" />
                  <Text style={styles.reviewDate}>5 hari lalu</Text>
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>"Kamar regulernya sangat bersih dan nyaman. Lokasi hotel strategis, sangat direkomendasikan untuk liburan keluarga."</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
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
    paddingBottom: 20,
  },

  // ── Header ──
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifButton: {
    marginRight: 14,
    position: 'relative',
    padding: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  avatarRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  profilePhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  // ── Hero Banner ──
  heroBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  heroGradient: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  heroTextArea: {
    flex: 1,
    marginRight: 16,
  },
  heroGreeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    marginBottom: 6,
  },
  heroMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  heroDecor: {
    opacity: 0.6,
  },
  heroCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -30,
    right: -20,
  },
  heroCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -20,
    left: 40,
  },

  // ── Section ──
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2B1F',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    flex: 1,
  },

  // ── Booking Card ──
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
    paddingTop: 24,
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
    left: 24,
    right: 24,
    height: 3,
    backgroundColor: '#D4AF37',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  divider: {
    width: 1,
    backgroundColor: '#F0EBE3',
    marginHorizontal: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#B08968',
    marginLeft: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputValue: {
    fontSize: 16,
    color: '#3D2B1F',
    fontWeight: '600',
  },
  searchButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 4,
  },
  searchButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },

  // ── AI Card ──
  aiCard: {
    backgroundColor: '#FFFBF5',
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#F5EBD6',
  },
  aiIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F0E3C4',
  },
  aiInputArea: {
    flex: 1,
  },
  aiInput: {
    fontSize: 14,
    color: '#3D2B1F',
    maxHeight: 60,
    paddingVertical: 2,
  },
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3DB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  aiBadgeText: {
    fontSize: 9,
    color: '#C49B30',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  aiButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 8,
  },
  aiButtonGradient: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Room Cards ──
  roomCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5EDE4',
  },
  roomImageContainer: {
    position: 'relative',
  },
  roomImage: {
    width: '100%',
    height: 190,
  },
  roomImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  roomBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  roomBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  roomRatingBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 3,
  },
  roomRatingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  roomInfo: {
    padding: 18,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D2B1F',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  roomDesc: {
    fontSize: 13,
    color: '#8C7B6B',
    marginBottom: 10,
    lineHeight: 18,
  },
  roomFacilities: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF5ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  facilityText: {
    fontSize: 11,
    color: '#8B5E3C',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  roomPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5E3C',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  perNight: {
    fontSize: 12,
    color: '#B08968',
    fontWeight: 'normal',
    marginLeft: 4,
  },

  // ── Reviews ──
  ratingOverall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#F0E3C4',
  },
  ratingOverallText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C49B30',
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
    position: 'relative',
    overflow: 'hidden',
  },
  quoteDecor: {
    position: 'absolute',
    top: 6,
    right: 14,
    opacity: 0.08,
  },
  quoteIcon: {
    fontSize: 48,
    color: '#8B5E3C',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#F5EDE4',
  },
  reviewerInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D2B1F',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  reviewDate: {
    fontSize: 11,
    color: '#B5A897',
    marginLeft: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#6B5D50',
    lineHeight: 22,
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Italic' : 'serif',
  },
});
