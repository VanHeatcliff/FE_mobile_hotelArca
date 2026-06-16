import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getRooms, Room } from '../services/roomService';
import { createBooking } from '../services/bookingService';
import { useRole } from '../context/RoleContext';

const { width } = Dimensions.get('window');

const getBadgeColor = (typeName: string) => {
  const name = typeName.toLowerCase();
  if (name.includes('vip') || name.includes('suite') || name.includes('presidential')) return '#D4AF37';
  if (name.includes('deluxe')) return '#3498DB';
  if (name.includes('standard')) return '#27AE60';
  if (name.includes('superior')) return '#8E44AD';
  if (name.includes('family')) return '#E67E22';
  return '#8B5E3C';
};

const formatPrice = (price: number) => {
  return 'Rp ' + price.toLocaleString('id-ID');
};

export default function RoomListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useRole();
  const [selectedFilter, setSelectedFilter] = useState(route.params?.filter || 'Semua');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);

  const checkIn = route.params?.checkIn || new Date().toISOString();
  const checkOut = route.params?.checkOut || new Date(Date.now() + 86400000).toISOString();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await getRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal memuat data kamar');
    } finally {
      setLoading(false);
    }
  };

  // Build unique type names for filter
  const typeNames = ['Semua', ...Array.from(new Set(rooms.map(r => r.room_type?.name || 'Lainnya')))];

  const filteredRooms = selectedFilter === 'Semua'
    ? rooms
    : rooms.filter(room => room.room_type?.name === selectedFilter);

  const handleBookRoom = async (room: Room) => {
    if (!user) {
      Alert.alert('Error', 'Silakan login terlebih dahulu');
      return;
    }
    if (!room.availability) return;

    const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
    const totalPayment = (room.room_type?.price || 0) * nights;

    Alert.alert(
      'Konfirmasi Pemesanan',
      `Pesan ${room.room_type?.name || 'Kamar'} (No. ${room.room_number}) untuk ${nights} malam?\n\nTotal: ${formatPrice(totalPayment)}`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Pesan',
          onPress: async () => {
            setBookingLoading(room.id_room);
            try {
              const newBooking = await createBooking({
                id_customer: user.id,
                id_room: room.id_room,
                date_in: checkIn,
                date_out: checkOut,
                total_payment: totalPayment,
              });
              Alert.alert('Berhasil', 'Pemesanan berhasil dibuat! Silakan lakukan pembayaran.', [
                { text: 'OK', onPress: () => navigation.navigate('Payment', { booking: newBooking }) },
              ]);
            } catch (error: any) {
              Alert.alert('Gagal', error.message || 'Gagal membuat pemesanan');
            } finally {
              setBookingLoading(null);
            }
          },
        },
      ]
    );
  };

  const getRoomImage = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('vip') || n.includes('presidential') || n.includes('suite'))
      return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop';
    if (n.includes('deluxe'))
      return 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop';
    if (n.includes('family'))
      return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop';
    if (n.includes('superior'))
      return 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=600&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Kamar Tersedia</Text>
          <Text style={styles.headerSubtitle}>
            {new Date(checkIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(checkOut).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#8B5E3C" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {typeNames.map((filter) => (
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

      {loading ? (
        <ActivityIndicator size="large" color="#8B5E3C" style={{ marginTop: 60 }} />
      ) : (
        <>
          {/* Results Count */}
          <View style={styles.resultsBar}>
            <Text style={styles.resultsText}>
              <Text style={styles.resultsCount}>{filteredRooms.length}</Text> kamar ditemukan
            </Text>
          </View>

          {/* Room List */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {filteredRooms.map((room) => (
              <TouchableOpacity key={room.id_room} style={styles.roomCard} activeOpacity={0.92}>
                {/* Room Image */}
                <View style={styles.roomImageContainer}>
                  <Image source={{ uri: getRoomImage(room.room_type?.name || '') }} style={styles.roomImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.55)']}
                    style={styles.roomImageOverlay}
                  />
                  {/* Badge */}
                  <View style={[styles.roomBadge, { backgroundColor: getBadgeColor(room.room_type?.name || '') }]}>
                    <Text style={styles.roomBadgeText}>{(room.room_type?.name || 'ROOM').toUpperCase()}</Text>
                  </View>
                  {/* Availability overlay */}
                  {!room.availability && (
                    <View style={styles.unavailableOverlay}>
                      <Text style={styles.unavailableText}>Tidak Tersedia</Text>
                    </View>
                  )}
                </View>

                {/* Room Info */}
                <View style={styles.roomInfo}>
                  <Text style={styles.roomName}>{room.room_type?.name || 'Kamar'} — No. {room.room_number}</Text>
                  <Text style={styles.roomDesc}>{room.room_type?.description || 'Kamar nyaman dengan fasilitas lengkap.'}</Text>

                  {/* Facilities */}
                  <View style={styles.facilitiesRow}>
                    {['WiFi', 'TV', 'AC'].map((facility, index) => (
                      <View key={index} style={styles.facilityChip}>
                        <Text style={styles.facilityChipText}>{facility}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Price & Book */}
                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.roomPrice}>{formatPrice(room.room_type?.price || 0)}</Text>
                      <Text style={styles.perNight}>/malam (termasuk pajak)</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.bookButton, !room.availability && styles.bookButtonDisabled]}
                      disabled={!room.availability || bookingLoading === room.id_room}
                      activeOpacity={0.8}
                      onPress={() => handleBookRoom(room)}
                    >
                      <LinearGradient
                        colors={room.availability ? ['#8B5E3C', '#A0724E'] : ['#CCC', '#BBB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.bookButtonGradient}
                      >
                        {bookingLoading === room.id_room ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <Text style={styles.bookButtonText}>
                            {room.availability ? 'Pesan' : 'Penuh'}
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <View style={{ height: 30 }} />
          </ScrollView>
        </>
      )}
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
