import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getBookings, updateBooking, deleteBooking, Booking } from '../services/bookingService';

export default function StaffValidationScreen() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      const all = Array.isArray(data) ? data : [];
      setBookings(all.filter(b => b.status_payment === 'pending'));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => 'Rp ' + price.toLocaleString('id-ID');
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleApprove = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      await updateBooking(selectedBooking.id_booking, { status_payment: 'paid' });
      Alert.alert('Berhasil', 'Booking berhasil divalidasi');
      setSelectedBooking(null);
      fetchPending();
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Gagal memvalidasi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBooking) return;
    Alert.alert('Tolak Booking', 'Apakah Anda yakin ingin menolak booking ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Tolak',
        style: 'destructive',
        onPress: async () => {
          setActionLoading(true);
          try {
            await deleteBooking(selectedBooking.id_booking);
            Alert.alert('Berhasil', 'Booking ditolak dan dihapus');
            setSelectedBooking(null);
            fetchPending();
          } catch (error: any) {
            Alert.alert('Gagal', error.message || 'Gagal menolak');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  // --- LIST VIEW ---
  const renderListView = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Validations</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{bookings.length}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5E3C" style={{ marginTop: 60 }} />
      ) : bookings.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 60 }}>
          <Text style={{ color: '#888', fontSize: 16 }}>Tidak ada booking yang perlu divalidasi.</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.id_booking)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.listItemCard}
              onPress={() => setSelectedBooking(item)}
            >
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemRef}>#BKG-{item.id_booking}</Text>
                <Text style={styles.listItemAmount}>{formatPrice(item.total_payment)}</Text>
              </View>
              <View style={styles.listItemBody}>
                <View>
                  <Text style={styles.listItemName}>Customer #{item.id_customer}</Text>
                  <Text style={styles.listItemRoom}>Room #{item.id_room}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );

  // --- DETAIL VIEW ---
  const renderDetailView = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => setSelectedBooking(null)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Validate Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Booking Ref */}
        <View style={styles.refContainer}>
          <Text style={styles.refLabel}>Booking Reference</Text>
          <Text style={styles.refValue}>#BKG-{selectedBooking!.id_booking}</Text>
        </View>

        {/* Guest Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Guest Details</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Customer ID</Text>
              <Text style={styles.detailValue}>#{selectedBooking!.id_customer}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Room</Text>
              <Text style={styles.detailValue}>#{selectedBooking!.id_room}</Text>
            </View>
          </View>
        </View>

        {/* Stay Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Stay Details</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-in</Text>
              <Text style={styles.detailValue}>{formatDate(selectedBooking!.date_in)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-out</Text>
              <Text style={styles.detailValue}>{formatDate(selectedBooking!.date_out)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, { color: '#F57C00' }]}>{selectedBooking!.status_payment}</Text>
            </View>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment Info</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentTotal}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{formatPrice(selectedBooking!.total_payment)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, actionLoading && { opacity: 0.7 }]}
            onPress={handleApprove}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Approve & Validate</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, actionLoading && { opacity: 0.7 }]}
            onPress={handleReject}
            disabled={actionLoading}
          >
            <Text style={styles.secondaryButtonText}>Reject & Message</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  return selectedBooking ? renderDetailView() : renderListView();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F4F4F4' },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F4F4F4' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  badge: { backgroundColor: '#D9534F', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  backButton: { padding: 8 },
  listContent: { padding: 24, gap: 16 },
  listItemCard: { backgroundColor: '#F4F4F4', borderRadius: 16, padding: 16 },
  listItemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  listItemRef: { fontSize: 14, color: '#666666', fontWeight: '600' },
  listItemAmount: { fontSize: 14, color: '#1A1A1A', fontWeight: 'bold' },
  listItemBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listItemName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  listItemRoom: { fontSize: 14, color: '#666666' },
  scrollContent: { padding: 24 },
  refContainer: { marginBottom: 24, alignItems: 'center', backgroundColor: '#F4F4F4', padding: 16, borderRadius: 12 },
  refLabel: { fontSize: 12, color: '#666666', fontWeight: '500', marginBottom: 4 },
  refValue: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  card: { backgroundColor: '#F4F4F4', borderRadius: 16, padding: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  detailLabel: { fontSize: 14, color: '#666666', flex: 1 },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', flex: 2, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#EAEAEA', marginVertical: 4 },
  paymentCard: { backgroundColor: '#F4F4F4', borderRadius: 16, overflow: 'hidden' },
  paymentTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F4F4F4', borderRadius: 16 },
  totalLabel: { fontSize: 14, color: '#666666', fontWeight: '500' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  actionContainer: { gap: 16, marginTop: 8 },
  primaryButton: { backgroundColor: '#1A1A1A', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#F4F4F4', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  secondaryButtonText: { color: '#1A1A1A', fontSize: 16, fontWeight: 'bold' },
});
