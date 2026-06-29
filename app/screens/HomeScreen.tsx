import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Platform, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getRoomTypes, RoomType } from '../services/roomService';
import { getReviews, Review, createReview } from '../services/reviewService';
import { getAiRecommendation, getAiTravelPlan } from '../services/aiService';
import { getBookings, Booking } from '../services/bookingService';
import { useRole } from '../context/RoleContext';

const { width } = Dimensions.get('window');

const formatPrice = (price: number) => {
  return 'Rp ' + price.toLocaleString('id-ID');
};

export default function HomeScreen() {
  const [aiQuery, setAiQuery] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { user } = useRole();

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  // API data
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);

  // Travel plan state
  const [latestPaidBooking, setLatestPaidBooking] = useState<Booking | null>(null);
  const [travelActivities, setTravelActivities] = useState<string[]>([]);
  const [travelCustomMessage, setTravelCustomMessage] = useState('');
  const [travelReply, setTravelReply] = useState('');
  const [travelLoading, setTravelLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch latest paid booking when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchLatestPaidBooking();
    }, [user])
  );

  const fetchLatestPaidBooking = async () => {
    if (!user) {
      setLatestPaidBooking(null);
      setBookingLoading(false);
      return;
    }
    setBookingLoading(true);
    try {
      const data = await getBookings();
      const all = Array.isArray(data) ? data : [];
      const myPaidBookings = all
        .filter(b => b.id_customer === user.id && b.status_payment === 'paid')
        .sort((a, b) => new Date(b.date_in).getTime() - new Date(a.date_in).getTime());
      setLatestPaidBooking(myPaidBookings.length > 0 ? myPaidBookings[0] : null);
    } catch {
      setLatestPaidBooking(null);
    } finally {
      setBookingLoading(false);
    }
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [rtData, rvData] = await Promise.all([
        getRoomTypes().catch(() => []),
        getReviews().catch(() => []),
      ]);
      setRoomTypes(Array.isArray(rtData) ? rtData : []);
      setReviews(Array.isArray(rvData) ? rvData : []);
    } catch {
      // Silently fail — show empty
    } finally {
      setLoadingData(false);
    }
  };

  const handleAiSend = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiReply('');
    try {
      const data = await getAiRecommendation(aiQuery);
      setAiReply(data.reply);
    } catch (error: any) {
      Alert.alert('AI Error', error.message || 'Gagal mendapatkan rekomendasi');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      Alert.alert('Error', 'Silakan login untuk memberikan ulasan');
      return;
    }
    if (!reviewComment.trim()) {
      Alert.alert('Error', 'Komentar ulasan tidak boleh kosong');
      return;
    }
    setReviewLoading(true);
    try {
      await createReview({
        id_customer: user.id,
        id_room: 1,
        rating: reviewRating,
        comment: reviewComment,
      });
      Alert.alert('Berhasil', 'Terima kasih atas ulasan Anda!');
      setReviewComment('');
      setReviewRating(5);
      fetchData();
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Gagal mengirim ulasan');
    } finally {
      setReviewLoading(false);
    }
  };

  // Travel plan
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

  const toggleTravelActivity = (keyword: string) => {
    setTravelActivities(prev =>
      prev.includes(keyword)
        ? prev.filter(a => a !== keyword)
        : [...prev, keyword]
    );
  };

  const handleGetTravelPlan = async () => {
    if (!latestPaidBooking) {
      Alert.alert('Info', 'Anda perlu memiliki booking yang sudah dibayar untuk mendapatkan rekomendasi wisata.');
      return;
    }
    setTravelLoading(true);
    setTravelReply('');
    try {
      const message = [
        ...travelActivities,
        travelCustomMessage.trim(),
      ].filter(Boolean).join(', ');
      const data = await getAiTravelPlan(latestPaidBooking.id_booking, message || undefined);
      setTravelReply(data.reply);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal mendapatkan rekomendasi wisata.');
    } finally {
      setTravelLoading(false);
    }
  };

  const travelNights = latestPaidBooking
    ? Math.max(1, Math.round((new Date(latestPaidBooking.date_out).getTime() - new Date(latestPaidBooking.date_in).getTime()) / 86400000))
    : 0;

  const formatBookingDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const onCheckInChange = (event: any, selectedDate?: Date) => {
    setShowCheckInPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setCheckInDate(selectedDate);
      if (selectedDate >= checkOutDate) {
        setCheckOutDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
      }
    }
  };

  const onCheckOutChange = (event: any, selectedDate?: Date) => {
    setShowCheckOutPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Room type images (fallback mapping since API doesn't return images)
  const roomTypeImages: Record<string, string> = {
    'VIP': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop',
    'Suite': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop',
    'Deluxe': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop',
    'Standard': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
    'Superior': 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=600&auto=format&fit=crop',
    'Family': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop',
  };

  const getRoomImage = (name: string) => {
    for (const key of Object.keys(roomTypeImages)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return roomTypeImages[key];
      }
    }
    return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop';
  };

  const getRecommendedRoomType = () => {
    if (!aiReply || roomTypes.length === 0) return null;
    const replyLower = aiReply.toLowerCase();
    return roomTypes.find(rt => replyLower.includes(rt.name.toLowerCase()));
  };

  const recommendedRoomType = getRecommendedRoomType();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/logo_full_arca.png')} 
            style={styles.headerLogo} 
          />
          <View>
            <Text style={styles.headerTitle}>Hotel Arca</Text>
            <Text style={styles.headerSubtitle}>Luxury Experience</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications-outline" size={22} color="#5C3D2E" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <View style={styles.avatarRing}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' }} 
              style={styles.profilePhoto} 
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Welcome Banner */}
        <View style={styles.heroBanner}>
          <LinearGradient
            colors={['#8B5E3C', '#C4956A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTextArea}>
                <Text style={styles.heroGreeting}>Selamat Datang{user ? `, ${user.name}` : ''} 🌟</Text>
                <Text style={styles.heroMessage}>Temukan pengalaman menginap terbaik di Hotel Arca</Text>
              </View>
              <View style={styles.heroDecor}>
                <Ionicons name="diamond-outline" size={48} color="rgba(255,255,255,0.2)" />
              </View>
            </View>
            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />
          </LinearGradient>
        </View>

        {/* Booking Form */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="search" size={18} color="#8B5E3C" />
            <Text style={styles.sectionTitle}>Cari Kamar</Text>
          </View>
          <View style={styles.bookingCard}>
            <View style={styles.goldAccentLine} />
            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.inputGroup} onPress={() => setShowCheckInPicker(true)}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="calendar-outline" size={14} color="#B08968" />
                  <Text style={styles.inputLabel}>Check-in</Text>
                </View>
                <Text style={styles.inputValue}>{formatDate(checkInDate)}</Text>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.inputGroup} onPress={() => setShowCheckOutPicker(true)}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="calendar-outline" size={14} color="#B08968" />
                  <Text style={styles.inputLabel}>Check-out</Text>
                </View>
                <Text style={styles.inputValue}>{formatDate(checkOutDate)}</Text>
              </TouchableOpacity>
            </View>

            {showCheckInPicker && (
              <DateTimePicker
                value={checkInDate}
                mode="date"
                display="default"
                onChange={onCheckInChange}
                minimumDate={new Date()}
              />
            )}
            
            {showCheckOutPicker && (
              <DateTimePicker
                value={checkOutDate}
                mode="date"
                display="default"
                onChange={onCheckOutChange}
                minimumDate={new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)}
              />
            )}
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="people-outline" size={14} color="#B08968" />
                  <Text style={styles.inputLabel}>Jumlah Tamu (Maks 4)</Text>
                </View>
                
                {/* Dewasa Counter */}
                <View style={styles.guestCounterRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputValue}>Dewasa</Text>
                    <Text style={styles.guestSubtitle}>3 tahun ke atas</Text>
                  </View>
                  <View style={styles.counterControl}>
                    <TouchableOpacity 
                      style={[styles.counterButton, adultCount <= 1 && styles.counterButtonDisabled]} 
                      onPress={() => setAdultCount(Math.max(1, adultCount - 1))}
                      disabled={adultCount <= 1}
                    >
                      <Ionicons name="remove" size={16} color={adultCount <= 1 ? "#CCC" : "#8B5E3C"} />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{adultCount}</Text>
                    <TouchableOpacity 
                      style={[styles.counterButton, (adultCount >= 4 || adultCount + childCount >= 4) && styles.counterButtonDisabled]} 
                      onPress={() => {
                        if (adultCount < 4 && adultCount + childCount < 4) setAdultCount(adultCount + 1);
                      }}
                      disabled={adultCount >= 4 || adultCount + childCount >= 4}
                    >
                      <Ionicons name="add" size={16} color={(adultCount >= 4 || adultCount + childCount >= 4) ? "#CCC" : "#8B5E3C"} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Anak Counter */}
                <View style={[styles.guestCounterRow, { marginTop: 12 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputValue}>Anak</Text>
                    <Text style={styles.guestSubtitle}>Di bawah 3 tahun</Text>
                  </View>
                  <View style={styles.counterControl}>
                    <TouchableOpacity 
                      style={[styles.counterButton, childCount <= 0 && styles.counterButtonDisabled]} 
                      onPress={() => setChildCount(Math.max(0, childCount - 1))}
                      disabled={childCount <= 0}
                    >
                      <Ionicons name="remove" size={16} color={childCount <= 0 ? "#CCC" : "#8B5E3C"} />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{childCount}</Text>
                    <TouchableOpacity 
                      style={[styles.counterButton, (childCount >= 3 || adultCount + childCount >= 4) && styles.counterButtonDisabled]} 
                      onPress={() => {
                        if (childCount < 3 && adultCount + childCount < 4) setChildCount(childCount + 1);
                      }}
                      disabled={childCount >= 3 || adultCount + childCount >= 4}
                    >
                      <Ionicons name="add" size={16} color={(childCount >= 3 || adultCount + childCount >= 4) ? "#CCC" : "#8B5E3C"} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.searchButton} activeOpacity={0.85} onPress={() => navigation.navigate('RoomList', { checkIn: checkInDate.toISOString(), checkOut: checkOutDate.toISOString() })}>
              <LinearGradient
                colors={['#8B5E3C', '#A0724E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.searchButtonGradient}
              >
                <Ionicons name="search" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.searchButtonText}>Cari Kamar Tersedia</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Recommendation */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={18} color="#D4AF37" />
            <Text style={styles.sectionTitle}>Rekomendasi Cerdas AI</Text>
          </View>
          <View style={styles.aiCard}>
            <View style={styles.aiIconCircle}>
              <Ionicons name="sparkles" size={20} color="#D4AF37" />
            </View>
            <View style={styles.aiInputArea}>
              <TextInput 
                style={styles.aiInput}
                placeholder="'Kamar yang cocok untuk keluarga?'"
                placeholderTextColor="#B5A897"
                value={aiQuery}
                onChangeText={setAiQuery}
                multiline
              />
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>Powered by AI</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.aiButton} activeOpacity={0.8} onPress={handleAiSend} disabled={aiLoading}>
              <LinearGradient
                colors={['#D4AF37', '#C49B30']}
                style={styles.aiButtonGradient}
              >
                {aiLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Ionicons name="send" size={14} color="#FFF" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {aiReply ? (
            <View style={styles.aiReplyCard}>
              <Text style={styles.aiReplyText}>{aiReply}</Text>
              {recommendedRoomType && (
                <View style={[styles.roomCard, { marginTop: 16, marginBottom: 0, borderWidth: 1, borderColor: '#D4AF37' }]}>
                  <View style={styles.roomImageContainer}>
                    <Image source={{ uri: getRoomImage(recommendedRoomType.name) }} style={styles.roomImage} />
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={styles.roomImageOverlay} />
                    <View style={styles.roomBadge}>
                      <Ionicons name="diamond" size={10} color="#FFF" />
                      <Text style={styles.roomBadgeText}>{recommendedRoomType.name.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.roomInfo}>
                    <Text style={styles.roomTitle}>{recommendedRoomType.name}</Text>
                    <Text style={styles.roomDesc} numberOfLines={2}>{recommendedRoomType.description}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.roomPrice}>{formatPrice(recommendedRoomType.price)}</Text>
                      <Text style={styles.perNight}>/malam</Text>
                    </View>
                    <TouchableOpacity 
                      style={{ marginTop: 16, backgroundColor: '#D4AF37', paddingVertical: 12, borderRadius: 12, alignItems: 'center' }}
                      onPress={() => navigation.navigate('RoomList', { checkIn: checkInDate.toISOString(), checkOut: checkOutDate.toISOString(), filter: recommendedRoomType.name })}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>Booking Kamar Ini</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : null}
        </View>

        {/* Travel Plan Recommendation */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="map-outline" size={18} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Rekomendasi Wisata Lombok</Text>
          </View>

          {bookingLoading ? (
            <ActivityIndicator size="large" color="#2E7D32" style={{ marginVertical: 30 }} />
          ) : !user ? (
            <View style={styles.travelEmptyCard}>
              <Ionicons name="log-in-outline" size={32} color="#B08968" />
              <Text style={styles.travelEmptyText}>Silakan login untuk mendapatkan rekomendasi wisata Lombok.</Text>
            </View>
          ) : !latestPaidBooking ? (
            <View style={styles.travelEmptyCard}>
              <Ionicons name="airplane-outline" size={32} color="#B08968" />
              <Text style={styles.travelEmptyText}>Selesaikan booking dan pembayaran untuk mendapatkan rekomendasi wisata Lombok yang dipersonalisasi oleh AI.</Text>
            </View>
          ) : (
            <>
              {/* Booking Info Card */}
              <View style={styles.travelBookingCard}>
                <View style={styles.travelAccentLine} />
                <View style={styles.travelBookingRow}>
                  <View style={styles.travelBookingItem}>
                    <Ionicons name="calendar-outline" size={16} color="#2E7D32" />
                    <View>
                      <Text style={styles.travelBookingLabel}>CHECK-IN</Text>
                      <Text style={styles.travelBookingValue}>{formatBookingDate(latestPaidBooking.date_in)}</Text>
                    </View>
                  </View>
                  <View style={styles.travelBookingDivider} />
                  <View style={styles.travelBookingItem}>
                    <Ionicons name="calendar-outline" size={16} color="#2E7D32" />
                    <View>
                      <Text style={styles.travelBookingLabel}>CHECK-OUT</Text>
                      <Text style={styles.travelBookingValue}>{formatBookingDate(latestPaidBooking.date_out)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.travelNightsBadge}>
                  <Ionicons name="moon-outline" size={14} color="#2E7D32" />
                  <Text style={styles.travelNightsBadgeText}>{travelNights} malam</Text>
                </View>
              </View>

              {/* Activity Chips */}
              <View style={styles.travelSubSection}>
                <View style={styles.travelSubHeader}>
                  <Ionicons name="compass-outline" size={16} color="#2E7D32" />
                  <Text style={styles.travelSubTitle}>Pilih Aktivitas</Text>
                </View>
                <Text style={styles.travelSubDesc}>Pilih aktivitas yang Anda sukai untuk rekomendasi yang lebih akurat</Text>
                <View style={styles.travelChipsContainer}>
                  {ACTIVITY_CHIPS.map((chip) => {
                    const isSelected = travelActivities.includes(chip.keyword);
                    return (
                      <TouchableOpacity
                        key={chip.keyword}
                        style={[styles.travelChip, isSelected && styles.travelChipSelected]}
                        onPress={() => toggleTravelActivity(chip.keyword)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name={chip.icon} size={14} color={isSelected ? '#FFF' : '#2E7D32'} />
                        <Text style={[styles.travelChipText, isSelected && styles.travelChipTextSelected]}>{chip.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Custom Message */}
              <View style={styles.travelSubSection}>
                <View style={styles.travelSubHeader}>
                  <Ionicons name="chatbubble-outline" size={16} color="#2E7D32" />
                  <Text style={styles.travelSubTitle}>Catatan Tambahan</Text>
                </View>
                <View style={styles.travelInputWrapper}>
                  <TextInput
                    style={styles.travelInput}
                    placeholder="Contoh: saya suka tempat yang sepi dan fotogenik..."
                    placeholderTextColor="#B5A897"
                    value={travelCustomMessage}
                    onChangeText={setTravelCustomMessage}
                    multiline
                    editable={!travelLoading}
                  />
                </View>
              </View>

              {/* Get Plan Button */}
              <TouchableOpacity
                style={[styles.travelPlanButton, travelLoading && { opacity: 0.7 }]}
                onPress={handleGetTravelPlan}
                disabled={travelLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#2E7D32', '#43A047']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.travelPlanButtonGradient}
                >
                  {travelLoading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="map-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                      <Text style={styles.travelPlanButtonText}>Dapatkan Rekomendasi Wisata</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Result */}
              {travelReply ? (
                <View style={styles.travelResultContainer}>
                  <View style={styles.travelResultHeader}>
                    <View style={styles.travelResultIconCircle}>
                      <Ionicons name="sparkles" size={20} color="#2E7D32" />
                    </View>
                    <View>
                      <Text style={styles.travelResultTitle}>Rekomendasi Wisata</Text>
                      <Text style={styles.travelResultSubtitle}>Berdasarkan {travelNights} hari perjalanan Anda</Text>
                    </View>
                  </View>
                  <View style={styles.travelResultDivider} />
                  <Text style={styles.travelResultText}>{travelReply}</Text>
                </View>
              ) : null}
            </>
          )}
        </View>

        {/* Room Types */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bed-outline" size={18} color="#8B5E3C" />
            <Text style={styles.sectionTitle}>Pilihan Kamar</Text>
          </View>
          
          {loadingData ? (
            <ActivityIndicator size="large" color="#8B5E3C" style={{ marginVertical: 30 }} />
          ) : roomTypes.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', marginVertical: 20 }}>Belum ada data tipe kamar.</Text>
          ) : (
            roomTypes.slice(0, 4).map((rt) => (
              <View key={rt.id_room_type} style={styles.roomCard}>
                <View style={styles.roomImageContainer}>
                  <Image 
                    source={{ uri: getRoomImage(rt.name) }} 
                    style={styles.roomImage} 
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.5)']}
                    style={styles.roomImageOverlay}
                  />
                  <View style={styles.roomBadge}>
                    <Ionicons name="diamond" size={10} color="#FFF" />
                    <Text style={styles.roomBadgeText}>{rt.name.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.roomInfo}>
                  <View>
                    <Text style={styles.roomTitle}>{rt.name}</Text>
                    <Text style={styles.roomDesc}>{rt.description || 'Kamar nyaman dengan fasilitas lengkap.'}</Text>
                    <View style={styles.roomFacilities}>
                      <View style={styles.facilityItem}>
                        <Ionicons name="wifi" size={12} color="#B08968" />
                        <Text style={styles.facilityText}>WiFi</Text>
                      </View>
                      <View style={styles.facilityItem}>
                        <Ionicons name="tv" size={12} color="#B08968" />
                        <Text style={styles.facilityText}>TV</Text>
                      </View>
                      <View style={styles.facilityItem}>
                        <Ionicons name="snow" size={12} color="#B08968" />
                        <Text style={styles.facilityText}>AC</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.roomPrice}>{formatPrice(rt.price)}</Text>
                    <Text style={styles.perNight}>/malam</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Reviews */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#8B5E3C" />
            <Text style={styles.sectionTitle}>Ulasan Tamu</Text>
            {reviews.length > 0 && (
              <View style={styles.ratingOverall}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingOverallText}>
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          {loadingData ? (
            <ActivityIndicator size="large" color="#8B5E3C" style={{ marginVertical: 30 }} />
          ) : reviews.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', marginVertical: 20 }}>Belum ada ulasan.</Text>
          ) : (
            reviews.slice(0, 5).map((review) => (
              <View key={review.id_review} style={styles.reviewCard}>
                <View style={styles.quoteDecor}>
                  <Text style={styles.quoteIcon}>❝</Text>
                </View>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>Tamu #{review.id_customer}</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= review.rating ? 'star' : 'star-outline'}
                          size={12}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>"{review.comment}"</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 30 }} />

        {/* Add Review Form */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create-outline" size={18} color="#8B5E3C" />
            <Text style={styles.sectionTitle}>Berikan Ulasan Anda</Text>
          </View>
          <View style={styles.reviewFormCard}>
            <Text style={styles.reviewFormLabel}>Beri Rating (1-5)</Text>
            <View style={styles.ratingInputContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                  <Ionicons
                    name={star <= reviewRating ? 'star' : 'star-outline'}
                    size={32}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewFormInput}
              placeholder="Tulis pengalaman menginap Anda..."
              placeholderTextColor="#B5A897"
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
            />
            <TouchableOpacity 
              style={[styles.submitReviewButton, reviewLoading && { opacity: 0.7 }]}
              onPress={handleSubmitReview}
              disabled={reviewLoading}
            >
              {reviewLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitReviewText}>Kirim Ulasan</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF8F4',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE3',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5C3D2E',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#B08968',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifButton: {
    marginRight: 14,
    position: 'relative',
    padding: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  avatarRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  profilePhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  // ── Hero Banner ──
  heroBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  heroGradient: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  heroTextArea: {
    flex: 1,
    marginRight: 16,
  },
  heroGreeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    marginBottom: 6,
  },
  heroMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
  heroDecor: {
    opacity: 0.6,
  },
  heroCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -30,
    right: -20,
  },
  heroCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -20,
    left: 40,
  },

  // ── Section ──
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2B1F',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
    flex: 1,
  },

  // ── Booking Card ──
  bookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
    paddingTop: 24,
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  divider: {
    width: 1,
    backgroundColor: '#F0EBE3',
    marginHorizontal: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#B08968',
    marginLeft: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputValue: {
    fontSize: 16,
    color: '#3D2B1F',
    fontWeight: '600',
  },
  searchButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 4,
  },
  searchButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  guestCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D2B1F',
    width: 14,
    textAlign: 'center',
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBF5ED',
    borderWidth: 1,
    borderColor: '#F0E6D6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonDisabled: {
    borderColor: '#EAEAEA',
    backgroundColor: '#F9F9F9',
  },
  guestSubtitle: {
    fontSize: 11,
    color: '#B08968',
    marginTop: 2,
    fontStyle: 'italic',
  },

  // ── AI Card ──
  aiCard: {
    backgroundColor: '#FFFBF5',
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#F5EBD6',
  },
  aiIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F0E3C4',
  },
  aiInputArea: {
    flex: 1,
  },
  aiInput: {
    fontSize: 14,
    color: '#3D2B1F',
    maxHeight: 60,
    paddingVertical: 2,
  },
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3DB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  aiBadgeText: {
    fontSize: 9,
    color: '#C49B30',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  aiButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 8,
  },
  aiButtonGradient: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiReplyCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F5EBD6',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  aiReplyText: {
    fontSize: 14,
    color: '#3D2B1F',
    lineHeight: 22,
  },

  // ── Room Cards ──
  roomCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5EDE4',
  },
  roomImageContainer: {
    position: 'relative',
  },
  roomImage: {
    width: '100%',
    height: 190,
  },
  roomImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  roomBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  roomBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  roomRatingBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 3,
  },
  roomRatingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  roomInfo: {
    padding: 18,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3D2B1F',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  roomDesc: {
    fontSize: 13,
    color: '#8C7B6B',
    marginBottom: 10,
    lineHeight: 18,
  },
  roomFacilities: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF5ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  facilityText: {
    fontSize: 11,
    color: '#8B5E3C',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  roomPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5E3C',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  perNight: {
    fontSize: 12,
    color: '#B08968',
    fontWeight: 'normal',
    marginLeft: 4,
  },

  // ── Reviews ──
  ratingOverall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#F0E3C4',
  },
  ratingOverallText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C49B30',
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
    position: 'relative',
    overflow: 'hidden',
  },
  quoteDecor: {
    position: 'absolute',
    top: 6,
    right: 14,
    opacity: 0.08,
  },
  quoteIcon: {
    fontSize: 48,
    color: '#8B5E3C',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#F5EDE4',
  },
  reviewerInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D2B1F',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  reviewDate: {
    fontSize: 11,
    color: '#B5A897',
    marginLeft: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#6B5D50',
    lineHeight: 22,
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Italic' : 'serif',
  },

  // ── Review Form ──
  reviewFormCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5EDE4',
  },
  reviewFormLabel: {
    fontSize: 14,
    color: '#8C7B6B',
    marginBottom: 8,
    fontWeight: '500',
  },
  ratingInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  reviewFormInput: {
    backgroundColor: '#FBF8F4',
    borderWidth: 1,
    borderColor: '#F0EBE3',
    borderRadius: 12,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#3D2B1F',
    marginBottom: 16,
  },
  submitReviewButton: {
    backgroundColor: '#8B5E3C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitReviewText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ── Travel Plan Section ──
  travelEmptyCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    gap: 10,
  },
  travelEmptyText: {
    fontSize: 14,
    color: '#6B5D50',
    textAlign: 'center',
    lineHeight: 22,
  },
  travelBookingCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    position: 'relative',
    overflow: 'hidden',
  },
  travelAccentLine: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 3,
    backgroundColor: '#43A047',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  travelBookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  travelBookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  travelBookingLabel: {
    fontSize: 11,
    color: '#66BB6A',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  travelBookingValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3D2B1F',
    marginTop: 2,
  },
  travelBookingDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
  },
  travelNightsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  travelNightsBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  travelSubSection: {
    marginBottom: 16,
  },
  travelSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  travelSubTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D2B1F',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  travelSubDesc: {
    fontSize: 13,
    color: '#8C7B6B',
    marginBottom: 12,
    lineHeight: 19,
  },
  travelChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  travelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    gap: 5,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  travelChipSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
    shadowOpacity: 0.12,
    elevation: 3,
  },
  travelChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  travelChipTextSelected: {
    color: '#FFF',
  },
  travelInputWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  travelInput: {
    fontSize: 14,
    color: '#3D2B1F',
    paddingHorizontal: 18,
    paddingVertical: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  travelPlanButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  travelPlanButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  travelPlanButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  travelResultContainer: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  travelResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  travelResultIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  travelResultTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3D2B1F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  },
  travelResultSubtitle: {
    fontSize: 12,
    color: '#66BB6A',
    marginTop: 2,
  },
  travelResultDivider: {
    height: 1,
    backgroundColor: '#E8F5E9',
    marginBottom: 16,
  },
  travelResultText: {
    fontSize: 14,
    color: '#3D2B1F',
    lineHeight: 24,
  },
});
