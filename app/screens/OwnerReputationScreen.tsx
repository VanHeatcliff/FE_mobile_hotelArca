import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getReviews, Review } from '../services/reviewService';

const OwnerReputationScreen = () => {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'All' | 5 | 4 | 3 | 2 | 1>('All');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = filter === 'All' ? reviews : reviews.filter(r => r.rating === filter);
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const avgRatingRounded = Math.round(parseFloat(avgRating));

  const renderStars = (rating: number, size = 16) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color="#d4af37"
          />
        ))}
      </View>
    );
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.guestName}>Customer #{item.id_customer}</Text>
          <Text style={styles.reviewDate}>Room #{item.id_room}</Text>
        </View>
        {renderStars(item.rating)}
      </View>
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reputation Management</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.overviewContainer}>
            <Text style={styles.overviewTitle}>Hotel Sentiment Overview</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.averageScore}>{avgRating}</Text>
              <Text style={styles.maxScore}>/ 5.0</Text>
            </View>
            {renderStars(avgRatingRounded, 32)}
            <Text style={styles.totalReviewsText}>Based on {reviews.length} reviews</Text>
          </View>

          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Filter Reviews:</Text>
            <View style={styles.filterButtons}>
              {(['All', 5, 4, 3, 2, 1] as const).map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.filterButton, filter === opt && styles.filterButtonActive]}
                  onPress={() => setFilter(opt)}
                >
                  <Text style={[styles.filterButtonText, filter === opt && styles.filterButtonTextActive]}>
                    {opt === 'All' ? 'All' : `${opt} Stars`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {filteredReviews.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 30 }}>Tidak ada review untuk filter ini.</Text>
          ) : (
            <FlatList
              data={filteredReviews}
              keyExtractor={item => String(item.id_review)}
              renderItem={renderReview}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#333333' },
  content: { padding: 24 },
  overviewContainer: { alignItems: 'center', marginBottom: 32, padding: 24, backgroundColor: '#fafafa', borderRadius: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  overviewTitle: { fontSize: 16, color: '#666666', marginBottom: 8 },
  scoreContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  averageScore: { fontSize: 48, fontWeight: '700', color: '#333333' },
  maxScore: { fontSize: 24, fontWeight: '600', color: '#999999', marginLeft: 4 },
  totalReviewsText: { fontSize: 14, color: '#666666', marginTop: 8 },
  filterContainer: { marginBottom: 24 },
  filterTitle: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 12 },
  filterButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  filterButtonActive: { backgroundColor: '#333333' },
  filterButtonText: { fontSize: 14, color: '#666666', fontWeight: '500' },
  filterButtonTextActive: { color: '#ffffff' },
  reviewCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  guestName: { fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 4 },
  reviewDate: { fontSize: 12, color: '#999999' },
  commentText: { fontSize: 14, color: '#666666', lineHeight: 20 },
});

export default OwnerReputationScreen;
