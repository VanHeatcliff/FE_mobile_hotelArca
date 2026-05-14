import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Booking {
  id: string;
  guestName: string;
  dates: string;
  totalPaid: string;
  status: 'Confirmed' | 'Checked In' | 'Completed' | 'Cancelled';
}

const mockBookings: Booking[] = [
  { id: 'B1001', guestName: 'Alice Johnson', dates: 'Oct 12 - Oct 15', totalPaid: '$1,350', status: 'Confirmed' },
  { id: 'B1002', guestName: 'Michael Smith', dates: 'Oct 10 - Oct 14', totalPaid: '$1,120', status: 'Checked In' },
  { id: 'B1003', guestName: 'Sarah Williams', dates: 'Oct 05 - Oct 08', totalPaid: '$450', status: 'Completed' },
  { id: 'B1004', guestName: 'David Brown', dates: 'Oct 15 - Oct 20', totalPaid: '$6,000', status: 'Confirmed' },
  { id: 'B1005', guestName: 'Emily Davis', dates: 'Oct 01 - Oct 03', totalPaid: '$300', status: 'Cancelled' },
];

const OwnerBookingHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const filteredBookings = mockBookings.filter(b => 
    b.guestName.toLowerCase().includes(search.toLowerCase()) ||
    b.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return '#d4af37'; // Gold
      case 'Checked In': return '#4CAF50';
      case 'Completed': return '#333333';
      case 'Cancelled': return '#F44336';
      default: return '#666666';
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={styles.row}>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={styles.guestName}>{item.guestName}</Text>
        <Text style={styles.bookingId}>#{item.id}</Text>
      </View>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={styles.cellText}>{item.dates}</Text>
      </View>
      <View style={[styles.cell, { flex: 1.5 }]}>
        <Text style={styles.totalPaid}>{item.totalPaid}</Text>
      </View>
      <View style={[styles.cell, { flex: 1.5 }]}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
      </View>
      <View style={[styles.cell, { flex: 1, alignItems: 'flex-end' }]}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Details</Text>
        </TouchableOpacity>
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
            placeholder="Search guests or status..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.columnHeader, { flex: 2 }]}>Guest</Text>
          <Text style={[styles.columnHeader, { flex: 2 }]}>Dates</Text>
          <Text style={[styles.columnHeader, { flex: 1.5 }]}>Total Paid</Text>
          <Text style={[styles.columnHeader, { flex: 1.5 }]}>Status</Text>
          <Text style={[styles.columnHeader, { flex: 1, textAlign: 'right' }]}>Action</Text>
        </View>
        
        <FlatList
          data={filteredBookings}
          keyExtractor={item => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Slightly off-white to make table stand out
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    width: 250,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333333',
  },
  table: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  columnHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  listContent: {
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cell: {
    justifyContent: 'center',
  },
  guestName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 12,
    color: '#999999',
  },
  cellText: {
    fontSize: 14,
    color: '#333333',
  },
  totalPaid: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 14,
    color: '#d4af37', // Gold
    fontWeight: '600',
  },
});

export default OwnerBookingHistoryScreen;
