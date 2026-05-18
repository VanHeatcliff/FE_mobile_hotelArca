import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';

export default function StaffDashboardScreen() {
  const { logout } = useRole();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Current Operations</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="#D9534F" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Widgets */}
        <View style={styles.widgetsContainer}>
          <View style={styles.widgetCard}>
            <Text style={styles.widgetTitle}>Occupancy Rate</Text>
            <Text style={styles.widgetValue}>84%</Text>
            <Text style={styles.widgetSubtext}>+2% from yesterday</Text>
          </View>
          <View style={styles.widgetCard}>
            <Text style={styles.widgetTitle}>Pending Tasks</Text>
            <Text style={styles.widgetValue}>12</Text>
            <Text style={styles.widgetSubtext}>Requires attention</Text>
          </View>
        </View>

        {/* List Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Check-ins & Check-outs</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Minimalist Cards */}
        <View style={styles.listContainer}>
          
          <View style={styles.operationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: '#5CB85C' }]} />
                <Text style={styles.statusText}>Checked-in</Text>
              </View>
              <Text style={styles.timeText}>14:30</Text>
            </View>
            <View style={styles.cardBody}>
              <View>
                <Text style={styles.guestName}>Sarah Jenkins</Text>
                <Text style={styles.roomType}>Deluxe Ocean View</Text>
              </View>
              <View style={styles.roomNumberContainer}>
                <Text style={styles.roomNumberText}>302</Text>
              </View>
            </View>
          </View>

          <View style={styles.operationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: '#F0AD4E' }]} />
                <Text style={styles.statusText}>Pending Check-in</Text>
              </View>
              <Text style={styles.timeText}>15:00</Text>
            </View>
            <View style={styles.cardBody}>
              <View>
                <Text style={styles.guestName}>Michael Chen</Text>
                <Text style={styles.roomType}>Executive Suite</Text>
              </View>
              <View style={styles.roomNumberContainer}>
                <Text style={styles.roomNumberText}>501</Text>
              </View>
            </View>
          </View>

          <View style={styles.operationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: '#D9534F' }]} />
                <Text style={styles.statusText}>Check-out</Text>
              </View>
              <Text style={styles.timeText}>11:00</Text>
            </View>
            <View style={styles.cardBody}>
              <View>
                <Text style={styles.guestName}>Emily Rodriguez</Text>
                <Text style={styles.roomType}>Standard Room</Text>
              </View>
              <View style={styles.roomNumberContainer}>
                <Text style={styles.roomNumberText}>105</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  scrollContent: {
    padding: 24,
  },
  widgetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  widgetCard: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    padding: 16,
    width: '48%',
  },
  widgetTitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 8,
  },
  widgetValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  widgetSubtext: {
    fontSize: 12,
    color: '#888888',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#D9534F',
    fontWeight: '500',
  },
  listContainer: {
    gap: 16,
  },
  operationCard: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  timeText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  roomType: {
    fontSize: 14,
    color: '#666666',
  },
  roomNumberContainer: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roomNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
});
