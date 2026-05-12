import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy data for the list
const PENDING_VALIDATIONS = [
  {
    id: '1',
    ref: '#BKG-84920',
    guestName: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+62 812 3456 7890',
    roomType: 'Deluxe Ocean View',
    checkIn: '14 May 2026, 14:00',
    checkOut: '16 May 2026, 12:00',
    guests: '2 Adults, 1 Child',
    amount: 'Rp 2.500.000',
  },
  {
    id: '2',
    ref: '#BKG-84925',
    guestName: 'Maria Garcia',
    email: 'maria.g@example.com',
    phone: '+62 899 1234 5678',
    roomType: 'Standard Room',
    checkIn: '15 May 2026, 14:00',
    checkOut: '17 May 2026, 12:00',
    guests: '1 Adult',
    amount: 'Rp 1.200.000',
  },
];

export default function StaffValidationScreen() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // --- LIST VIEW ---
  const renderListView = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Validations</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{PENDING_VALIDATIONS.length}</Text>
        </View>
      </View>

      <FlatList
        data={PENDING_VALIDATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.listItemCard}
            onPress={() => setSelectedBooking(item)}
          >
            <View style={styles.listItemHeader}>
              <Text style={styles.listItemRef}>{item.ref}</Text>
              <Text style={styles.listItemAmount}>{item.amount}</Text>
            </View>
            <View style={styles.listItemBody}>
              <View>
                <Text style={styles.listItemName}>{item.guestName}</Text>
                <Text style={styles.listItemRoom}>{item.roomType}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </View>
          </TouchableOpacity>
        )}
      />
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
          <Text style={styles.refValue}>{selectedBooking.ref}</Text>
        </View>

        {/* Guest Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Guest Details</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>{selectedBooking.guestName}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{selectedBooking.email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{selectedBooking.phone}</Text>
            </View>
          </View>
        </View>

        {/* Room Details */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Stay Details</Text>
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Room Type</Text>
              <Text style={styles.detailValue}>{selectedBooking.roomType}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-in</Text>
              <Text style={styles.detailValue}>{selectedBooking.checkIn}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Check-out</Text>
              <Text style={styles.detailValue}>{selectedBooking.checkOut}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Guests</Text>
              <Text style={styles.detailValue}>{selectedBooking.guests}</Text>
            </View>
          </View>
        </View>

        {/* Proof of Payment */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Proof of Payment</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentPlaceholder}>
              <Ionicons name="image-outline" size={48} color="#A0A0A0" />
              <Text style={styles.paymentPlaceholderText}>Bank Transfer Receipt.jpg</Text>
            </View>
            <View style={styles.paymentTotal}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{selectedBooking.amount}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setSelectedBooking(null)} // Simulate approve
          >
            <Text style={styles.primaryButtonText}>Approve & Validate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setSelectedBooking(null)} // Simulate reject
          >
            <Text style={styles.secondaryButtonText}>Reject & Message</Text>
          </TouchableOpacity>
        </View>
        
        {/* Extra padding at bottom for safe scroll */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  return selectedBooking ? renderDetailView() : renderListView();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  badge: {
    backgroundColor: '#D9534F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  listItemCard: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    padding: 16,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  listItemRef: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  listItemAmount: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  listItemBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  listItemRoom: {
    fontSize: 14,
    color: '#666666',
  },
  scrollContent: {
    padding: 24,
  },
  refContainer: {
    marginBottom: 24,
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    padding: 16,
    borderRadius: 12,
  },
  refLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 4,
  },
  refValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 4,
  },
  paymentCard: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    overflow: 'hidden',
  },
  paymentPlaceholder: {
    height: 160,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentPlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  paymentTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F4F4F4',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  actionContainer: {
    gap: 16,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
