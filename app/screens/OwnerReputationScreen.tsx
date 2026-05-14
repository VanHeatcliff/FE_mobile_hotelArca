import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Review {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  comment: string;
}

const mockReviews: Review[] = [
  { id: '1', guestName: 'James Wilson', rating: 5, date: '2 days ago', comment: 'Absolutely phenomenal stay. The Ocean Suite exceeded expectations and the service was impeccable.' },
  { id: '2', guestName: 'Linda Martinez', rating: 4, date: '1 week ago', comment: 'Great location and beautiful rooms. The breakfast could have more variety, but overall a solid experience.' },
  { id: '3', guestName: 'Robert Taylor', rating: 5, date: '2 weeks ago', comment: 'A luxurious escape in the city. The spa facilities are top-notch. Will definitely return.' },
  { id: '4', guestName: 'Susan Clark', rating: 2, date: '3 weeks ago', comment: 'Disappointing check-in experience. Our room was not ready until 5 PM.' },
];

const OwnerReputationScreen = () => {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'All' | 5 | 4 | 3 | 2 | 1>('All');

  const filteredReviews = filter === 'All' ? mockReviews : mockReviews.filter(r => r.rating === filter);

  const renderStars = (rating: number, size = 16) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color="#d4af37" // Gold
          />
        ))}
      </View>
    );
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.guestName}>{item.guestName}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.overviewContainer}>
          <Text style={styles.overviewTitle}>Hotel Sentiment Overview</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.averageScore}>4.8</Text>
            <Text style={styles.maxScore}>/ 5.0</Text>
          </View>
          {renderStars(5, 32)}
          <Text style={styles.totalReviewsText}>Based on 1,284 reviews</Text>
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

        <FlatList
          data={filteredReviews}
          keyExtractor={item => item.id}
          renderItem={renderReview}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
};

// Need to import ScrollView since it's used
import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  content: {
    padding: 24,
  },
  overviewContainer: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 24,
    backgroundColor: '#fafafa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  overviewTitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  averageScore: {
    fontSize: 48,
    fontWeight: '700',
    color: '#333333',
  },
  maxScore: {
    fontSize: 24,
    fontWeight: '600',
    color: '#999999',
    marginLeft: 4,
  },
  totalReviewsText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#333333',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999999',
  },
  commentText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default OwnerReputationScreen;
