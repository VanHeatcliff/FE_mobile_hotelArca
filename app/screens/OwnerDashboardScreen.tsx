import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
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
        color: (opacity = 1) => `rgba(212, 175, 55, ${opacity})`, // Gold color
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text style={[styles.headerTitle, { marginBottom: 0 }]}>Executive Dashboard</Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={28} color="#d4af37" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Revenue</Text>
        <LineChart
          data={chartData}
          width={width - 48}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`, // Dark charcoal text
            labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#d4af37', // Gold
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
      <View style={styles.cardsContainer}>
        <View style={styles.kpiCard}>
          <Ionicons name="cash-outline" size={24} color="#d4af37" />
          <Text style={styles.kpiValue}>$315,000</Text>
          <Text style={styles.kpiLabel}>Total Revenue</Text>
        </View>

        <View style={styles.kpiCard}>
          <Ionicons name="bed-outline" size={24} color="#d4af37" />
          <Text style={styles.kpiValue}>82%</Text>
          <Text style={styles.kpiLabel}>Avg. Occupancy</Text>
        </View>

        <View style={styles.kpiCard}>
          <Ionicons name="calendar-outline" size={24} color="#d4af37" />
          <Text style={styles.kpiValue}>1,240</Text>
          <Text style={styles.kpiLabel}>Total Bookings</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Pure white base
  },
  content: {
    padding: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333', // Dark charcoal
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginVertical: 8,
  },
  kpiLabel: {
    fontSize: 14,
    color: '#666666',
  },
});

export default OwnerDashboardScreen;
