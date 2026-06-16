import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getBookings, deleteBooking, Booking } from '../services/bookingService';
import { useRole } from '../context/RoleContext';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('Aktif');
  const navigation = useNavigation<any>();
  const { user } = useRole();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      const all = Array.isArray(data) ? data : [];
      // Filter bookings for current customer
      const myBookings = user ? all.filter(b => b.id_customer === user.id) : all;
      setBookings(myBookings);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal memuat data pemesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Batalkan Pesanan',
      'Apakah Anda yakin ingin membatalkan pesanan ini?',
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            setCancellingId(booking.id_booking);
            try {
              await deleteBooking(booking.id_booking);
              Alert.alert('Berhasil', 'Pesanan berhasil dibatalkan');
              fetchBookings();
            } catch (error: any) {
              Alert.alert('Gagal', error.message || 'Gagal membatalkan pesanan');
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatPrice = (price: number) => 'Rp ' + price.toLocaleString('id-ID');

  const activeBookings = bookings.filter(b => b.status_payment === 'pending');
  const historyBookings = bookings.filter(b => b.status_payment !== 'pending');

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Pembayaran';
      case 'paid': return 'Lunas';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return { bg: '#E8F8EF', color: '#27AE60' };
      case 'cancelled': return { bg: '#FDECEC', color: '#E74C3C' };
      default: return { bg: '#FFF3E0', color: '#F57C00' };
    }
  };

  const displayBookings = activeTab === 'Aktif' ? activeBookings : historyBookings;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pemesanan Saya</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Aktif' && styles.activeTabButton]}
          onPress={() => setActiveTab('Aktif')}
        >
          <Text style={[styles.tabText, activeTab === 'Aktif' && styles.activeTabText]}>Aktif</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Riwayat' && styles.activeTabButton]}
          onPress={() => setActiveTab('Riwayat')}
        >
          <Text style={[styles.tabText, activeTab === 'Riwayat' && styles.activeTabText]}>Riwayat</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5E3C" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {displayBookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'Aktif' ? 'Tidak ada pemesanan aktif.' : 'Belum ada riwayat pesanan.'}
              </Text>
            </View>
          ) : (
            displayBookings.map((booking) => {
              const statusStyle = getStatusStyle(booking.status_payment);
              return (
                <View key={booking.id_booking} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.roomType}>Kamar #{booking.id_room}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.color }]}>{getStatusLabel(booking.status_payment)}</Text>
                    </View>
                  </View>
                  <Text style={styles.dateText}>
                    {formatDate(booking.date_in)} - {formatDate(booking.date_out)}
                  </Text>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Total Harga</Text>
                    <Text style={styles.priceValue}>{formatPrice(booking.total_payment)}</Text>
                  </View>

                  {booking.status_payment === 'pending' && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.payButton} onPress={() => navigation.navigate('Payment', { booking })}>
                        <Text style={styles.payButtonText}>Bayar Sekarang</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={() => handleCancel(booking)}
                        disabled={cancellingId === booking.id_booking}
                      >
                        {cancellingId === booking.id_booking ? (
                          <ActivityIndicator size="small" color="#D32F2F" />
                        ) : (
                          <Text style={styles.cancelButtonText}>Batalkan Pesanan</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}

                  {booking.status_payment === 'paid' && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.travelButton} 
                        onPress={() => navigation.navigate('TravelPlan', { booking })}
                      >
                        <Text style={styles.travelButtonText}>🗺️ Rencana Wisata Lombok</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B5E3C',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#8B5E3C',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#F57C00',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#888',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5E3C',
  },
  actionButtons: {
    gap: 12,
  },
  payButton: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFEBEE',
    backgroundColor: '#FFF5F5',
  },
  cancelButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  travelButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  travelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
