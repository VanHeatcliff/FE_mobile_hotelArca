import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { getRevenueReports, RevenueReport } from '../services/revenueService';
import { getBookings, Booking } from '../services/bookingService';
import { getReviews, Review } from '../services/reviewService';

const { width } = Dimensions.get('window');

const OwnerDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const { logout } = useRole();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<RevenueReport[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [repData, bkData, rvData] = await Promise.all([
        getRevenueReports().catch(() => []),
        getBookings().catch(() => []),
        getReviews().catch(() => []),
      ]);
      setReports(Array.isArray(repData) ? repData : []);
      setBookings(Array.isArray(bkData) ? bkData : []);
      setReviews(Array.isArray(rvData) ? rvData : []);
    } catch {} finally {
      setLoading(false);
    }
  };

  // Compute KPIs
  const totalRevenue = reports.reduce((sum, r) => sum + (r.total_revenue || 0), 0);
  const totalBookingsCount = bookings.length;
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';

  // Chart data from reports or fallback
  const chartLabels = reports.length > 0
    ? reports.slice(-6).map(r => r.period?.substring(0, 3) || '')
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const chartValues = reports.length > 0
    ? reports.slice(-6).map(r => r.total_revenue || 0)
    : [0, 0, 0, 0, 0, 0];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues.length > 0 ? chartValues : [0],
        color: (opacity = 1) => `rgba(212, 175, 55, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const today = new Date();
  const dateString = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}K`;
    return `Rp ${num}`;
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      
      {/* Header with Greeting */}
      <View style={styles.headerArea}>
        <View>
          <Text style={styles.headerGreeting}>Selamat Pagi 👋</Text>
          <Text style={styles.headerTitle}>Executive Dashboard</Text>
          <Text style={styles.headerDate}>{dateString}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color="#D4AF37" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 60 }} />
      ) : (
        <>
          {/* KPI Cards */}
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.cardsContainer}>
            <View style={styles.kpiCard}>
              <View style={[styles.kpiIconCircle, { backgroundColor: '#FFF8E8' }]}>
                <Ionicons name="cash-outline" size={22} color="#D4AF37" />
              </View>
              <Text style={styles.kpiValue}>{formatCurrency(totalRevenue)}</Text>
              <Text style={styles.kpiLabel}>Total Revenue</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={[styles.kpiIconCircle, { backgroundColor: '#EBF5FF' }]}>
                <Ionicons name="bed-outline" size={22} color="#3498DB" />
              </View>
              <Text style={styles.kpiValue}>{reports.length > 0 ? reports[reports.length - 1].total_booking || 0 : 0}</Text>
              <Text style={styles.kpiLabel}>Latest Bookings</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={[styles.kpiIconCircle, { backgroundColor: '#F5EEFF' }]}>
                <Ionicons name="calendar-outline" size={22} color="#8E44AD" />
              </View>
              <Text style={styles.kpiValue}>{totalBookingsCount}</Text>
              <Text style={styles.kpiLabel}>Total Bookings</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={[styles.kpiIconCircle, { backgroundColor: '#FFF0F0' }]}>
                <Ionicons name="star-outline" size={22} color="#E74C3C" />
              </View>
              <Text style={styles.kpiValue}>{avgRating}</Text>
              <Text style={styles.kpiLabel}>Guest Rating</Text>
            </View>
          </View>

          {/* Chart */}
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Monthly Revenue</Text>
                <Text style={styles.chartSubtitle}>Performa pendapatan</Text>
              </View>
            </View>
            <LineChart
              data={chartData}
              width={width - 72}
              height={200}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#FFFDF8',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(61, 43, 31, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(140, 123, 107, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '5', strokeWidth: '2', stroke: '#D4AF37' },
                propsForBackgroundLines: { strokeDasharray: '4 4', stroke: '#F0EBE3' },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBF8F4' },
  content: { padding: 24, paddingBottom: 40 },
  headerArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  headerGreeting: { fontSize: 16, color: '#B08968', marginBottom: 4 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#3D2B1F', fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif', marginBottom: 4 },
  headerDate: { fontSize: 13, color: '#8C7B6B' },
  logoutBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF8E8', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0E3C4', marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#3D2B1F', marginBottom: 16, fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif' },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 28 },
  kpiCard: { width: '47%', backgroundColor: '#FFF', padding: 18, borderRadius: 20, alignItems: 'center', shadowColor: '#8B5E3C', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: '#F5EDE4' },
  kpiIconCircle: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  kpiValue: { fontSize: 26, fontWeight: '800', color: '#3D2B1F', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif' },
  kpiLabel: { fontSize: 12, color: '#8C7B6B', fontWeight: '500', marginBottom: 8 },
  chartContainer: { backgroundColor: '#FFF', borderRadius: 22, padding: 20, shadowColor: '#8B5E3C', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: '#F5EDE4' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  chartTitle: { fontSize: 18, fontWeight: '700', color: '#3D2B1F', fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif' },
  chartSubtitle: { fontSize: 12, color: '#8C7B6B', marginTop: 2 },
});

export default OwnerDashboardScreen;
