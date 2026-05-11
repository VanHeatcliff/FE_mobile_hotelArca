import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [aiQuery, setAiQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hotel Arca</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#2C2C2C" />
          </TouchableOpacity>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' }} 
            style={styles.profilePhoto} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Booking Form (Top) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cari Kamar</Text>
          <View style={styles.bookingCard}>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Check-in</Text>
                <Text style={styles.inputValue}>12 Mei 2026</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Check-out</Text>
                <Text style={styles.inputValue}>14 Mei 2026</Text>
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tamu & Kamar</Text>
                <Text style={styles.inputValue}>2 Dewasa, 1 Kamar</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Cari Kamar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Recommendation Form */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Rekomendasi Cerdas AI</Text>
          <View style={styles.aiCard}>
            <Ionicons name="sparkles" size={24} color="#8B5E3C" style={styles.aiIcon} />
            <TextInput 
              style={styles.aiInput}
              placeholder="Tanya AI: 'Kamar yang cocok untuk keluarga?'"
              value={aiQuery}
              onChangeText={setAiQuery}
              multiline
            />
            <TouchableOpacity style={styles.aiButton}>
              <Ionicons name="send" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Room Types */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pilihan Kamar</Text>
          
          {/* VIP Room */}
          <View style={styles.roomCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop' }} 
              style={styles.roomImage} 
            />
            <View style={styles.roomInfo}>
              <View>
                <Text style={styles.roomTitle}>Kamar VIP (Suite)</Text>
                <Text style={styles.roomDesc}>Fasilitas premium, pemandangan kota, akses lounge.</Text>
              </View>
              <Text style={styles.roomPrice}>Rp 3.500.000<Text style={styles.perNight}>/malam</Text></Text>
            </View>
          </View>

          {/* Regular Room */}
          <View style={styles.roomCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop' }} 
              style={styles.roomImage} 
            />
            <View style={styles.roomInfo}>
              <View>
                <Text style={styles.roomTitle}>Kamar Reguler (Deluxe)</Text>
                <Text style={styles.roomDesc}>Nyaman dan luas, cocok untuk istirahat.</Text>
              </View>
              <Text style={styles.roomPrice}>Rp 1.200.000<Text style={styles.perNight}>/malam</Text></Text>
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ulasan Tamu</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' }} 
                style={styles.reviewerAvatar} 
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>Budi Santoso</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={14} color="#FFD700" />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>"Pengalaman menginap di kamar VIP sangat luar biasa. Pelayanan sangat cepat dan ramah. AI rekomendasinya juga sangat membantu!"</Text>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' }} 
                style={styles.reviewerAvatar} 
              />
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewerName}>Siti Aminah</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4].map((star) => (
                    <Ionicons key={star} name="star" size={14} color="#FFD700" />
                  ))}
                  <Ionicons name="star-half" size={14} color="#FFD700" />
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>"Kamar regulernya sangat bersih dan nyaman. Lokasi hotel strategis, sangat direkomendasikan untuk liburan keluarga."</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5E3C',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
  },
  profilePhoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: '#EAEAEA',
    marginHorizontal: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#8B5E3C',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0EBE1',
  },
  aiIcon: {
    marginRight: 12,
    marginLeft: 8,
  },
  aiInput: {
    flex: 1,
    fontSize: 14,
    color: '#2C2C2C',
    maxHeight: 60,
  },
  aiButton: {
    backgroundColor: '#8B5E3C',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  roomCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  roomImage: {
    width: '100%',
    height: 180,
  },
  roomInfo: {
    padding: 16,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  roomDesc: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  roomPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5E3C',
  },
  perNight: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'normal',
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    justifyContent: 'center',
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
