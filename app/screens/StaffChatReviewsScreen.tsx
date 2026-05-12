import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'chats' | 'reviews';

export default function StaffChatReviewsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('chats');

  const renderChats = () => (
    <View style={styles.listContainer}>
      <TouchableOpacity style={styles.chatCard}>
        <View style={styles.chatAvatar}>
          <Text style={styles.avatarText}>SJ</Text>
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>Sarah Jenkins (Room 302)</Text>
            <Text style={styles.chatTime}>10:45</Text>
          </View>
          <Text style={styles.chatPreview} numberOfLines={1}>
            Could we get some extra towels sent up?
          </Text>
          <View style={styles.badgeContainer}>
            <View style={styles.unreadBadge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.chatCard}>
        <View style={styles.chatAvatar}>
          <Text style={styles.avatarText}>MC</Text>
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>Michael Chen</Text>
            <Text style={styles.chatTime}>Yesterday</Text>
          </View>
          <Text style={styles.chatPreview} numberOfLines={1}>
            Thank you, the AI concierge was very helpful.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.masonryContainer}>
      {/* Left Column */}
      <View style={styles.masonryColumn}>
        <View style={[styles.reviewCard, { minHeight: 180 }]}>
          <View style={styles.starsContainer}>
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
          </View>
          <Text style={styles.reviewText}>
            "Absolutely stunning property. The staff was incredibly attentive and the check-in process was seamless. Highly recommend the ocean view suites!"
          </Text>
          <Text style={styles.reviewerName}>- David W.</Text>
        </View>
        
        <View style={[styles.reviewCard, { minHeight: 140 }]}>
          <View style={styles.starsContainer}>
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star-outline" size={16} color="#F0AD4E" />
          </View>
          <Text style={styles.reviewText}>
            "Great stay overall, though the breakfast area got a bit crowded."
          </Text>
          <Text style={styles.reviewerName}>- Anna L.</Text>
        </View>
      </View>

      {/* Right Column */}
      <View style={styles.masonryColumn}>
        <View style={[styles.reviewCard, { minHeight: 150 }]}>
          <View style={styles.starsContainer}>
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star-half" size={16} color="#F0AD4E" />
          </View>
          <Text style={styles.reviewText}>
            "Loved the minimal design of the app and the room. Everything worked perfectly."
          </Text>
          <Text style={styles.reviewerName}>- James K.</Text>
        </View>
        
        <View style={[styles.reviewCard, { minHeight: 180 }]}>
          <View style={styles.starsContainer}>
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
            <Ionicons name="star" size={16} color="#F0AD4E" />
          </View>
          <Text style={styles.reviewText}>
            "The AI Concierge was a fun touch, but the real star is the quick room service!"
          </Text>
          <Text style={styles.reviewerName}>- Chloe M.</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guest Relations</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'chats' && styles.activeTabButton]}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>
            Active Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'reviews' && styles.activeTabButton]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
            Recent Reviews
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'chats' ? renderChats() : renderReviews()}
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
  },
  activeTabText: {
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  listContainer: {
    marginTop: 8,
  },
  chatCard: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  chatTime: {
    fontSize: 12,
    color: '#888888',
  },
  chatPreview: {
    fontSize: 14,
    color: '#666666',
    paddingRight: 24,
  },
  badgeContainer: {
    position: 'absolute',
    right: 0,
    bottom: 2,
  },
  unreadBadge: {
    backgroundColor: '#D9534F',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F4F4F4',
    marginLeft: 64,
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  masonryColumn: {
    width: '48%',
    gap: 16,
  },
  reviewCard: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
});
