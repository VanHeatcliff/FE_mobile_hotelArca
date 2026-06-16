import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAiTravelPlan } from '../services/aiService';

const ACTIVITY_CHIPS = [
  { label: 'Pantai', icon: 'sunny-outline' as const, keyword: 'pantai' },
  { label: 'Snorkeling', icon: 'fish-outline' as const, keyword: 'snorkeling' },
  { label: 'Hiking', icon: 'walk-outline' as const, keyword: 'hiking' },
  { label: 'Budaya', icon: 'globe-outline' as const, keyword: 'budaya' },
  { label: 'Air Terjun', icon: 'water-outline' as const, keyword: 'air terjun' },
  { label: 'Gunung', icon: 'triangle-outline' as const, keyword: 'gunung' },
  { label: 'Diving', icon: 'boat-outline' as const, keyword: 'diving' },
  { label: 'Kuliner', icon: 'restaurant-outline' as const, keyword: 'kuliner' },
];

export default function TravelPlanScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const booking = route.params?.booking;

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleActivity = (keyword: string) => {
    setSelectedActivities((prev) =>
      prev.includes(keyword)
        ? prev.filter((a) => a !== keyword)
        : [...prev, keyword]
    );
  };

  const handleGetPlan = async () => {
    if (!booking?.id_booking) {
      Alert.alert('Error', 'Data booking tidak ditemukan.');
      return;
    }

    setLoading(true);
    setReply('');
    try {
      const message = [
        ...selectedActivities,
        customMessage.trim(),
      ].filter(Boolean).join(', ');

      const data = await getAiTravelPlan(booking.id_booking, message || undefined);
      setReply(data.reply);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal mendapatkan rekomendasi wisata.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const nights = booking
    ? Math.max(
        1,
        Math.round(
          (new Date(booking.date_out).getTime() - new Date(booking.date_in).getTime()) /
            86400000
        )
      )
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#3D2B1F" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Rencana Wisata</Text>
          <Text style={styles.headerSubtitle}>Destinasi Lombok by AI</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking Info Card */}
        {booking && (
          <View style={styles.bookingInfoCard}>
            <View style={styles.goldAccentLine} />
            <View style={styles.bookingInfoRow}>
              <View style={styles.bookingInfoItem}>
                <Ionicons name="calendar-outline" size={16} color="#B08968" />
                <View>
                  <Text style={styles.bookingInfoLabel}>Check-in</Text>
                  <Text style={styles.bookingInfoValue}>
                    {formatDate(booking.date_in)}
                  </Text>
                </View>
              </View>
              <View style={styles.bookingInfoDivider} />
              <View style={styles.bookingInfoItem}>
                <Ionicons name="calendar-outline" size={16} color="#B08968" />
                <View>
                  <Text style={styles.bookingInfoLabel}>Check-out</Text>
                  <Text style={styles.bookingInfoValue}>
                    {formatDate(booking.date_out)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.nightsBadge}>
              <Ionicons name="moon-outline" size={14} color="#D4AF37" />
              <Text style={styles.nightsBadgeText}>{nights} malam</Text>
            </View>
          </View>
        )}

        {/* Activity Preferences */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="compass-outline" size={18} color="#8B5E3C" />
            <Text style={styles.sectionTitle}>Pilih Aktivitas</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Pilih aktivitas yang Anda sukai untuk rekomendasi yang lebih akurat
          </Text>

          <View style={styles.chipsContainer}>
            {ACTIVITY_CHIPS.map((chip) => {
              const isSelected = selectedActivities.includes(chip.keyword);
              return (
                <TouchableOpacity
                  key={chip.keyword}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => toggleActivity(chip.keyword)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={chip.icon}
                    size={16}
                    color={isSelected ? '#FFF' : '#8B5E3C'}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Custom message */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble-outline" size={18} color="#8B5E3C" />
            <Text style={styles.sectionTitle}>Catatan Tambahan</Text>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Contoh: saya suka tempat yang sepi dan fotogenik..."
              placeholderTextColor="#B5A897"
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline
              editable={!loading}
            />
          </View>
        </View>

        {/* Get Plan Button */}
        <TouchableOpacity
          style={[styles.planButton, loading && { opacity: 0.7 }]}
          onPress={handleGetPlan}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#8B5E3C', '#A0724E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.planButtonGradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="map-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.planButtonText}>Dapatkan Rekomendasi</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Result */}
        {reply ? (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <View style={styles.resultIconCircle}>
                <Ionicons name="sparkles" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.resultTitle}>Rekomendasi Wisata</Text>
                <Text style={styles.resultSubtitle}>
                  Berdasarkan {nights} hari perjalanan Anda
                </Text>
              </View>
            </View>
            <View style={styles.resultDivider} />
            <Text style={styles.resultText}>{reply}</Text>
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF8F4',
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F4EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3D2B1F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8C7B6B',
    marginTop: 2,
  },

  scrollContent: {
    padding: 20,
  },

  // ── Booking Info ──
  bookingInfoCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5EDE4',
    position: 'relative',
    overflow: 'hidden',
  },
  goldAccentLine: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 3,
    backgroundColor: '#D4AF37',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  bookingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  bookingInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bookingInfoLabel: {
    fontSize: 11,
    color: '#B08968',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookingInfoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3D2B1F',
    marginTop: 2,
  },
  bookingInfoDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F0EBE3',
    marginHorizontal: 16,
  },
  nightsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF8E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#F0E3C4',
  },
  nightsBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C49B30',
  },

  // ── Sections ──
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2B1F',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#8C7B6B',
    marginBottom: 14,
    lineHeight: 19,
  },

  // ── Activity Chips ──
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#F0EBE3',
    gap: 6,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#8B5E3C',
    borderColor: '#8B5E3C',
    shadowOpacity: 0.12,
    elevation: 3,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B5E3C',
  },
  chipTextSelected: {
    color: '#FFF',
  },

  // ── Input ──
  inputWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F5EDE4',
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 14,
    color: '#3D2B1F',
    paddingHorizontal: 18,
    paddingVertical: 14,
    minHeight: 70,
    textAlignVertical: 'top',
  },

  // ── Button ──
  planButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  planButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  planButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },

  // ── Result ──
  resultContainer: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F5EBD6',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  resultIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF8E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E3C4',
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3D2B1F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  resultSubtitle: {
    fontSize: 12,
    color: '#8C7B6B',
    marginTop: 2,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#F5EBD6',
    marginBottom: 16,
  },
  resultText: {
    fontSize: 14,
    color: '#3D2B1F',
    lineHeight: 24,
  },
});
