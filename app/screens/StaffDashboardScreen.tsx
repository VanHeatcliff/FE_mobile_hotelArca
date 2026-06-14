import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { LinearGradient } from 'expo-linear-gradient';
import { getRooms, Room } from '../services/roomService';
import { getBookings, Booking } from '../services/bookingService';

export default function StaffDashboardScreen() {
  const { logout } = useRole();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const timeGreeting = today.getHours() < 12 ? 'Selamat Pagi' : today.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomData, bookingData] = await Promise.all([
        getRooms().catch(() => []),
        getBookings().catch(() => []),
      ]);
      setRooms(Array.isArray(roomData) ? roomData : []);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => !r.availability).length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const pendingBookings = bookings.filter(b => b.status_payment === 'pending');

  // Get today's bookings for check-in/out timeline
  const todayStr = today.toISOString().split('T')[0];
  const todayCheckIns = bookings.filter(b => b.date_in.startsWith(todayStr));
  const todayCheckOuts = bookings.filter(b => b.date_out.startsWith(todayStr));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>{timeGreeting} 👋</Text>
          <Text style={styles.headerTitle}>Current Operations</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color="#3D2B1F" />
            {pendingBookings.length > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Shift Badge */}
      <View style={styles.shiftBadgeContainer}>
        <View style={styles.shiftBadge}>
          <Ionicons name="time-outline" size={14} color="#8B5E3C" />
          <Text style={styles.shiftText}>Shift Pagi — 07:00 - 15:00</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5E3C" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Widget Cards */}
          <View style={styles.widgetsContainer}>
            <View style={[styles.widgetCard, { borderLeftColor: '#27AE60' }]}>
              <View style={styles.widgetHeader}>
                <View style={[styles.widgetIconCircle, { backgroundColor: '#E8F8EF' }]}>
                  <Ionicons name="stats-chart" size={18} color="#27AE60" />
                </View>
              </View>
              <Text style={styles.widgetValue}>{occupancyRate}%</Text>
              <Text style={styles.widgetTitle}>Occupancy Rate</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${occupancyRate}%`, backgroundColor: '#27AE60' }]} />
              </View>
            </View>

            <View style={[styles.widgetCard, { borderLeftColor: '#F39C12' }]}>
              <View style={styles.widgetHeader}>
                <View style={[styles.widgetIconCircle, { backgroundColor: '#FFF6E6' }]}>
                  <Ionicons name="clipboard-outline" size={18} color="#F39C12" />
                </View>
                {pendingBookings.length > 0 && (
                  <View style={[styles.widgetTrendBadge, { backgroundColor: '#FFF6E6' }]}>
                    <Ionicons name="alert-circle" size={10} color="#F39C12" />
                    <Text style={[styles.widgetTrendText, { color: '#F39C12' }]}>Urgent</Text>
                  </View>
                )}
              </View>
              <Text style={styles.widgetValue}>{pendingBookings.length}</Text>
              <Text style={styles.widgetTitle}>Pending Tasks</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(100, pendingBookings.length * 10)}%`, backgroundColor: '#F39C12' }]} />
              </View>
            </View>
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="swap-vertical" size={18} color="#8B5E3C" />
              <Text style={styles.sectionTitle}>Today's Check-ins & Check-outs</Text>
            </View>
          </View>

          {/* Operation Cards with Timeline */}
          <View style={styles.listContainer}>
            <View style={styles.timelineLine} />

            {bookings.length === 0 && (
              <Text style={{ color: '#888', textAlign: 'center', marginVertical: 20 }}>Tidak ada data booking.</Text>
            )}

            {bookings.filter(b => b.status_payment === 'paid').slice(0, 3).map((booking) => (
              <View key={`ci-${booking.id_booking}`} style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#27AE60' }]}>
                  <Ionicons name="checkmark" size={10} color="#FFF" />
                </View>
                <View style={styles.operationCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: '#E8F8EF' }]}>
                      <View style={[styles.statusDotSmall, { backgroundColor: '#27AE60' }]} />
                      <Text style={[styles.statusText, { color: '#27AE60' }]}>Paid</Text>
                    </View>
                    <Text style={styles.timeText}>{new Date(booking.date_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.guestInfo}>
                      <Text style={styles.guestName}>Customer #{booking.id_customer}</Text>
                      <View style={styles.roomTypeRow}>
                        <Ionicons name="bed-outline" size={12} color="#8C7B6B" />
                        <Text style={styles.roomType}>Room #{booking.id_room}</Text>
                      </View>
                    </View>
                    <View style={[styles.roomNumberContainer, { backgroundColor: '#E8F8EF' }]}>
                      <Text style={[styles.roomNumberText, { color: '#27AE60' }]}>{booking.id_room}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {pendingBookings.slice(0, 3).map((booking) => (
              <View key={`pend-${booking.id_booking}`} style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#F39C12' }]}>
                  <Ionicons name="time" size={10} color="#FFF" />
                </View>
                <View style={styles.operationCard}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: '#FFF6E6' }]}>
                      <View style={[styles.statusDotSmall, { backgroundColor: '#F39C12' }]} />
                      <Text style={[styles.statusText, { color: '#E67E22' }]}>Pending</Text>
                    </View>
                    <Text style={styles.timeText}>{new Date(booking.date_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.guestInfo}>
                      <Text style={styles.guestName}>Customer #{booking.id_customer}</Text>
                      <View style={styles.roomTypeRow}>
                        <Ionicons name="bed-outline" size={12} color="#8C7B6B" />
                        <Text style={styles.roomType}>Room #{booking.id_room}</Text>
                      </View>
                    </View>
                    <View style={[styles.roomNumberContainer, { backgroundColor: '#FFF6E6' }]}>
                      <Text style={[styles.roomNumberText, { color: '#E67E22' }]}>{booking.id_room}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF8F4' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 },
  headerGreeting: { fontSize: 14, color: '#B08968', marginBottom: 2 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#3D2B1F', fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: { position: 'relative', width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0EBE3' },
  notifDot: { position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#E74C3C', borderWidth: 1.5, borderColor: '#FFF' },
  logoutBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0EBE3' },
  shiftBadgeContainer: { paddingHorizontal: 24, marginBottom: 8 },
  shiftBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF8F0', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, borderWidth: 1, borderColor: '#F5EBD6' },
  shiftText: { fontSize: 12, color: '#8B5E3C', fontWeight: '600' },
  scrollContent: { padding: 24, paddingTop: 16, paddingBottom: 40 },
  widgetsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28, gap: 12 },
  widgetCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 16, borderLeftWidth: 3, shadowColor: '#8B5E3C', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F5EDE4' },
  widgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  widgetIconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  widgetTrendBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#E8F8EF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  widgetTrendText: { fontSize: 10, fontWeight: '700' },
  widgetValue: { fontSize: 30, fontWeight: '800', color: '#3D2B1F', marginBottom: 2, fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif' },
  widgetTitle: { fontSize: 12, color: '#8C7B6B', fontWeight: '500', marginBottom: 10 },
  progressBarBg: { height: 4, backgroundColor: '#F0EBE3', borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#3D2B1F', fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif' },
  listContainer: { position: 'relative', paddingLeft: 20 },
  timelineLine: { position: 'absolute', left: 9, top: 16, bottom: 16, width: 2, backgroundColor: '#F0EBE3', borderRadius: 1 },
  timelineItem: { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-start' },
  timelineDot: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 14, marginLeft: -11, borderWidth: 2, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  operationCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 18, padding: 16, shadowColor: '#8B5E3C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F5EDE4' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, gap: 5 },
  statusDotSmall: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  timeText: { fontSize: 13, color: '#B08968', fontWeight: '600' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  guestInfo: { flex: 1 },
  guestName: { fontSize: 16, fontWeight: '700', color: '#3D2B1F', marginBottom: 4 },
  roomTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  roomType: { fontSize: 13, color: '#8C7B6B' },
  roomNumberContainer: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, minWidth: 48, alignItems: 'center' },
  roomNumberText: { fontSize: 18, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif' },
  actionButton: { marginTop: 12, borderRadius: 14, overflow: 'hidden' },
  actionButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 6, borderRadius: 14 },
  actionButtonText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});
