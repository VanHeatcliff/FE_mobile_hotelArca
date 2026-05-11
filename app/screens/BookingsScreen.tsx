import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('Aktif');

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

      <ScrollView contentContainerStyle={styles.listContainer}>
        {activeTab === 'Aktif' ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.roomType}>Deluxe Ocean View</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Menunggu Pembayaran</Text>
              </View>
            </View>
            <Text style={styles.dateText}>12 Mei 2026 - 14 Mei 2026</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total Harga</Text>
              <Text style={styles.priceValue}>Rp 2.450.000</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Bayar Sekarang</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Batalkan Pesanan</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada riwayat pesanan.</Text>
          </View>
        )}
      </ScrollView>
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
});
