import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getBookings, Booking } from '../services/bookingService';

const OwnerBookingHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b =>
    String(b.id_booking).includes(search) ||
    String(b.id_customer).includes(search) ||
    b.status_payment.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#4CAF50';
      case 'pending': return '#d4af37';
      case 'cancelled': return '#F44336';
      default: return '#666666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  const formatPrice = (price: number) => 'Rp ' + price.toLocaleString('id-ID');

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.cardRow}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.guestName}>Customer #{item.id_customer}</Text>
          <Text style={styles.bookingId}>Booking ID: #{item.id_booking}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status_payment) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status_payment) }]}>{getStatusLabel(item.status_payment)}</Text>
        </View>
      </View>
      
      <View style={styles.cardDivider} />
      
      <View style={styles.cardBody}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardLabel}>Tanggal Menginap</Text>
          <Text style={styles.cardValue}>{formatDate(item.date_in)} - {formatDate(item.date_out)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardLabel}>Total Pembayaran</Text>
          <Text style={styles.totalPaid}>{formatPrice(item.total_payment)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking History</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ID or status..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 60 }} />
      ) : (
        <View style={styles.table}>
          <FlatList
            data={filteredBookings}
            keyExtractor={item => String(item.id_booking)}
            renderItem={renderBooking}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', padding: 30 }}>Tidak ada data booking.</Text>}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#333333' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 12, width: 250 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, color: '#333333' },
  table: { flex: 1, backgroundColor: '#f9f9f9', marginTop: 16 },
  listContent: { paddingBottom: 32 },
  cardRow: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  guestName: { fontSize: 16, fontWeight: '700', color: '#333333', marginBottom: 4 },
  bookingId: { fontSize: 12, color: '#999999' },
  totalPaid: { fontSize: 16, fontWeight: '700', color: '#4CAF50' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start' },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
});

export default OwnerBookingHistoryScreen;
