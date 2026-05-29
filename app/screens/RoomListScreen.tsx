import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DUMMY_ROOMS = [
  {
    id: '1',
    name: 'Suite Presidential',
    type: 'VIP',
    price: 5500000,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
    facilities: ['WiFi', 'Bathtub', 'Minibar', 'Balkon'],
    size: '75 m²',
    bed: 'King Size',
    capacity: '2 Dewasa',
    available: true,
    description: 'Suite mewah dengan pemandangan kota, ruang tamu terpisah, dan akses eksklusif ke Executive Lounge.',
  },
  {
    id: '2',
    name: 'Kamar VIP (Suite)',
    type: 'VIP',
    price: 3500000,
    rating: 4.8,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop',
    facilities: ['WiFi', 'TV', 'Minibar', 'Lounge'],
    size: '55 m²',
    bed: 'King Size',
    capacity: '2 Dewasa',
    available: true,
    description: 'Fasilitas premium, pemandangan kota, akses lounge eksklusif.',
  },
  {
    id: '3',
    name: 'Deluxe Ocean View',
    type: 'DELUXE',
    price: 2200000,
    rating: 4.7,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop',
    facilities: ['WiFi', 'TV', 'AC', 'Balkon'],
    size: '42 m²',
    bed: 'Queen Size',
    capacity: '2 Dewasa',
    available: true,
    description: 'Kamar deluxe dengan pemandangan laut yang menakjubkan dan balkon pribadi.',
  },
  {
    id: '4',
    name: 'Kamar Reguler (Deluxe)',
    type: 'POPULER',
    price: 1200000,
    rating: 4.7,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop',
    facilities: ['WiFi', 'TV', 'AC'],
    size: '32 m²',
    bed: 'Queen Size',
    capacity: '2 Dewasa',
    available: true,
    description: 'Nyaman dan luas, cocok untuk istirahat. Pilihan favorit para tamu.',
  },
  {
    id: '5',
    name: 'Superior Twin Room',
    type: 'SUPERIOR',
    price: 1500000,
    rating: 4.5,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=600&auto=format&fit=crop',
    facilities: ['WiFi', 'TV', 'AC', 'Meja Kerja'],
    size: '36 m²',
    bed: 'Twin Bed',
    capacity: '2 Dewasa',
    available: true,
    description: 'Ideal untuk perjalanan bisnis atau bersama rekan, dilengkapi dua tempat tidur terpisah.',
  },
  {
    id: '6',
    name: 'Family Room',
    type: 'FAMILY',
    price: 2800000,
    rating: 4.6,
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
    facilities: ['WiFi', 'TV', 'AC', 'Minibar', 'Sofa Bed'],
    size: '60 m²',
    bed: 'King + Sofa Bed',
    capacity: '2 Dewasa, 2 Anak',
    available: false,
    description: 'Ruangan luas dengan tempat tidur tambahan, cocok untuk liburan keluarga.',
  },
];

const getBadgeColor = (type: string) => {
  switch (type) {
    case 'VIP': return '#D4AF37';
    case 'DELUXE': return '#3498DB';
    case 'POPULER': return '#27AE60';
    case 'SUPERIOR': return '#8E44AD';
    case 'FAMILY': return '#E67E22';
    default: return '#8B5E3C';
  }
};

const formatPrice = (price: number) => {
  return 'Rp ' + price.toLocaleString('id-ID');
};

export default function RoomListScreen() {
  const navigation = useNavigation<any>();
  const [selectedFilter, setSelectedFilter] = useState('Semua');

  const filters = ['Semua', 'VIP', 'DELUXE', 'SUPERIOR', 'FAMILY'];

  const filteredRooms = selectedFilter === 'Semua'
    ? DUMMY_ROOMS
    : DUMMY_ROOMS.filter(room => room.type === selectedFilter);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Kamar Tersedia</Text>
          <Text style={styles.headerSubtitle}>12-14 Mei 2026 · 2 Dewasa · 1 Kamar</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#8B5E3C" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive,
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          <Text style={styles.resultsCount}>{filteredRooms.length}</Text> kamar ditemukan
        </Text>
      </View>

      {/* Room List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredRooms.map((room) => (
          <TouchableOpacity key={room.id} style={styles.roomCard} activeOpacity={0.92}>
            {/* Room Image */}
            <View style={styles.roomImageContainer}>
              <Image source={{ uri: room.image }} style={styles.roomImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.55)']}
                style={styles.roomImageOverlay}
              />
              {/* Badge */}
              <View style={[styles.roomBadge, { backgroundColor: getBadgeColor(room.type) }]}>
                {room.type === 'VIP' && <Ionicons name="diamond" size={10} color="#FFF" />}
                {room.type === 'POPULER' && <Ionicons name="flame" size={10} color="#FFF" />}
                {room.type === 'FAMILY' && <Ionicons name="people" size={10} color="#FFF" />}
                <Text style={styles.roomBadgeText}>{room.type}</Text>
              </View>
              {/* Rating */}
              <View style={styles.roomRatingBadge}>
                <Ionicons name="star" size={10} color="#FFD700" />
                <Text style={styles.roomRatingText}>{room.rating}</Text>
                <Text style={styles.roomReviewCount}>({room.reviews})</Text>
              </View>
              {/* Availability overlay */}
              {!room.available && (
                <View style={styles.unavailableOverlay}>
                  <Text style={styles.unavailableText}>Tidak Tersedia</Text>
                </View>
              )}
            </View>

            {/* Room Info */}
            <View style={styles.roomInfo}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomDesc}>{room.description}</Text>

              {/* Room Details */}
              <View style={styles.roomDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="resize-outline" size={13} color="#B08968" />
                  <Text style={styles.detailText}>{room.size}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="bed-outline" size={13} color="#B08968" />
                  <Text style={styles.detailText}>{room.bed}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="people-outline" size={13} color="#B08968" />
                  <Text style={styles.detailText}>{room.capacity}</Text>
                </View>
              </View>

              {/* Facilities */}
              <View style={styles.facilitiesRow}>
                {room.facilities.map((facility, index) => (
                  <View key={index} style={styles.facilityChip}>
                    <Text style={styles.facilityChipText}>{facility}</Text>
                  </View>
                ))}
              </View>

              {/* Price & Book */}
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.roomPrice}>{formatPrice(room.price)}</Text>
                  <Text style={styles.perNight}>/malam (termasuk pajak)</Text>
                </View>
                <TouchableOpacity
                  style={[styles.bookButton, !room.available && styles.bookButtonDisabled]}
                  disabled={!room.available}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={room.available ? ['#8B5E3C', '#A0724E'] : ['#CCC', '#BBB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.bookButtonGradient}
                  >
                    <Text style={styles.bookButtonText}>
                      {room.available ? 'Pesan' : 'Penuh'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

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

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F4EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D2B1F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8C7B6B',
    marginTop: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F4EF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EBE3',
  },

  // ── Filters ──
  filterContainer: {
    backgroundColor: '#FFF',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F4EF',
    borderWidth: 1,
    borderColor: '#F0EBE3',
  },
  filterChipActive: {
    backgroundColor: '#3D2B1F',
    borderColor: '#3D2B1F',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8C7B6B',
  },
  filterChipTextActive: {
    color: '#FFF',
  },

  // ── Results Bar ──
  resultsBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#8C7B6B',
  },
  resultsCount: {
    fontWeight: '700',
    color: '#3D2B1F',
  },

  scrollContent: {
    paddingHorizontal: 20,
  },

  // ── Room Card ──
  roomCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 18,
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
    height: 200,
  },
  roomImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  roomBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
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
  roomReviewCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: 'rgba(231,76,60,0.85)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },

  // ── Room Info ──
  roomInfo: {
    padding: 18,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D2B1F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    marginBottom: 4,
  },
  roomDesc: {
    fontSize: 13,
    color: '#8C7B6B',
    lineHeight: 19,
    marginBottom: 12,
  },
  roomDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#8C7B6B',
    fontWeight: '500',
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  facilityChip: {
    backgroundColor: '#FBF5ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0E6D6',
  },
  facilityChipText: {
    fontSize: 11,
    color: '#8B5E3C',
    fontWeight: '500',
  },

  // ── Price & Book ──
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5EDE4',
    paddingTop: 14,
  },
  roomPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5E3C',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  perNight: {
    fontSize: 11,
    color: '#B08968',
    marginTop: 2,
  },
  bookButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 16,
  },
  bookButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
