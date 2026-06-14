import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getChats, Chat } from '../services/chatService';
import { getReviews, Review } from '../services/reviewService';

type TabType = 'chats' | 'reviews';

export default function StaffChatReviewsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [chats, setChats] = useState<Chat[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chatData, reviewData] = await Promise.all([
        getChats().catch(() => []),
        getReviews().catch(() => []),
      ]);
      setChats(Array.isArray(chatData) ? chatData : []);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const getInitials = (id: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[id % 26] + letters[(id * 7) % 26];
  };

  const renderChats = () => (
    <View style={styles.listContainer}>
      {chats.length === 0 ? (
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 30 }}>Tidak ada chat aktif.</Text>
      ) : (
        chats.map((chat, index) => (
          <View key={chat.id_chat}>
            <TouchableOpacity style={styles.chatCard}>
              <View style={styles.chatAvatar}>
                <Text style={styles.avatarText}>{getInitials(chat.id_customer)}</Text>
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>Customer #{chat.id_customer}</Text>
                  <Text style={styles.chatTime}>{new Date(chat.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</Text>
                </View>
                <Text style={styles.chatPreview} numberOfLines={1}>
                  Tap to view conversation
                </Text>
              </View>
            </TouchableOpacity>
            {index < chats.length - 1 && <View style={styles.divider} />}
          </View>
        ))
      )}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.masonryContainer}>
      {reviews.length === 0 ? (
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 30, width: '100%' }}>Tidak ada review.</Text>
      ) : (
        <>
          <View style={styles.masonryColumn}>
            {reviews.filter((_, i) => i % 2 === 0).map((review) => (
              <View key={review.id_review} style={[styles.reviewCard, { minHeight: 150 }]}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name={star <= review.rating ? 'star' : 'star-outline'} size={16} color="#F0AD4E" />
                  ))}
                </View>
                <Text style={styles.reviewText}>"{review.comment}"</Text>
                <Text style={styles.reviewerName}>- Customer #{review.id_customer}</Text>
              </View>
            ))}
          </View>
          <View style={styles.masonryColumn}>
            {reviews.filter((_, i) => i % 2 === 1).map((review) => (
              <View key={review.id_review} style={[styles.reviewCard, { minHeight: 150 }]}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name={star <= review.rating ? 'star' : 'star-outline'} size={16} color="#F0AD4E" />
                  ))}
                </View>
                <Text style={styles.reviewText}>"{review.comment}"</Text>
                <Text style={styles.reviewerName}>- Customer #{review.id_customer}</Text>
              </View>
            ))}
          </View>
        </>
      )}
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
            Active Chats ({chats.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'reviews' && styles.activeTabButton]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
            Recent Reviews ({reviews.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B5E3C" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'chats' ? renderChats() : renderReviews()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  tabContainer: { flexDirection: 'row', marginHorizontal: 24, backgroundColor: '#F4F4F4', borderRadius: 12, padding: 4, marginBottom: 16 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTabButton: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#888888' },
  activeTabText: { color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  listContainer: { marginTop: 8 },
  chatCard: { flexDirection: 'row', paddingVertical: 16 },
  chatAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: '#666666' },
  chatContent: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  chatTime: { fontSize: 12, color: '#888888' },
  chatPreview: { fontSize: 14, color: '#666666', paddingRight: 24 },
  divider: { height: 1, backgroundColor: '#F4F4F4', marginLeft: 64 },
  masonryContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  masonryColumn: { width: '48%', gap: 16 },
  reviewCard: { backgroundColor: '#F4F4F4', borderRadius: 16, padding: 16, justifyContent: 'space-between' },
  starsContainer: { flexDirection: 'row', marginBottom: 8 },
  reviewText: { fontSize: 14, color: '#1A1A1A', lineHeight: 20, marginBottom: 12 },
  reviewerName: { fontSize: 12, fontWeight: '600', color: '#666666' },
});
