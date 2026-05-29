import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';

const { width } = Dimensions.get('window');

const OwnerDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const { logout } = useRole();

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20000, 45000, 28000, 80000, 99000, 43000],
        color: (opacity = 1) => `rgba(212, 175, 55, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const today = new Date();
  const dateString = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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

      {/* KPI Cards */}
      <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
      <View style={styles.cardsContainer}>
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconCircle, { backgroundColor: '#FFF8E8' }]}>
            <Ionicons name="cash-outline" size={22} color="#D4AF37" />
          </View>
          <Text style={styles.kpiValue}>$315,000</Text>
          <Text style={styles.kpiLabel}>Total Revenue</Text>
          <View style={styles.trendBadge}>
            <Ionicons name="trending-up" size={12} color="#27AE60" />
            <Text style={[styles.trendText, { color: '#27AE60' }]}>+12.5%</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconCircle, { backgroundColor: '#EBF5FF' }]}>
            <Ionicons name="bed-outline" size={22} color="#3498DB" />
          </View>
          <Text style={styles.kpiValue}>82%</Text>
          <Text style={styles.kpiLabel}>Avg. Occupancy</Text>
          <View style={styles.trendBadge}>
            <Ionicons name="trending-up" size={12} color="#27AE60" />
            <Text style={[styles.trendText, { color: '#27AE60' }]}>+3.2%</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconCircle, { backgroundColor: '#F5EEFF' }]}>
            <Ionicons name="calendar-outline" size={22} color="#8E44AD" />
          </View>
          <Text style={styles.kpiValue}>1,240</Text>
          <Text style={styles.kpiLabel}>Total Bookings</Text>
          <View style={styles.trendBadge}>
            <Ionicons name="trending-down" size={12} color="#E74C3C" />
            <Text style={[styles.trendText, { color: '#E74C3C' }]}>-1.8%</Text>
          </View>
        </View>

        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconCircle, { backgroundColor: '#FFF0F0' }]}>
            <Ionicons name="star-outline" size={22} color="#E74C3C" />
          </View>
          <Text style={styles.kpiValue}>4.8</Text>
          <Text style={styles.kpiLabel}>Guest Rating</Text>
          <View style={styles.trendBadge}>
            <Ionicons name="trending-up" size={12} color="#27AE60" />
            <Text style={[styles.trendText, { color: '#27AE60' }]}>+0.3</Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>Monthly Revenue</Text>
            <Text style={styles.chartSubtitle}>Performa pendapatan 6 bulan terakhir</Text>
          </View>
        </View>
        <View style={styles.periodSelector}>
          <TouchableOpacity style={styles.periodBtnActive}>
            <Text style={styles.periodBtnTextActive}>6M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodBtn}>
            <Text style={styles.periodBtnText}>1Y</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.periodBtn}>
            <Text style={styles.periodBtnText}>ALL</Text>
          </TouchableOpacity>
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
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#D4AF37',
            },
            propsForBackgroundLines: {
              strokeDasharray: '4 4',
              stroke: '#F0EBE3',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF8F4',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },

  // ── Header ──
  headerArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  headerGreeting: {
    fontSize: 16,
    color: '#B08968',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D2B1F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 13,
    color: '#8C7B6B',
  },
  logoutBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF8E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E3C4',
    marginTop: 4,
  },

  // ── Section Title ──
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D2B1F',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },

  // ── KPI Cards ──
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 28,
  },
  kpiCard: {
    width: '47%',
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5EDE4',
  },
  kpiIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3D2B1F',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#8C7B6B',
    fontWeight: '500',
    marginBottom: 8,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // ── Chart ──
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5EDE4',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2B1F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#8C7B6B',
    marginTop: 2,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  periodBtnActive: {
    backgroundColor: '#3D2B1F',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  periodBtnTextActive: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  periodBtn: {
    backgroundColor: '#F5EDE4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  periodBtnText: {
    color: '#8C7B6B',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OwnerDashboardScreen;
