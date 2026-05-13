import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface RoomType {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
}

const initialRooms: RoomType[] = [
  { id: '1', name: 'Ocean Suite', price: '450', imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'Deluxe King', price: '280', imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Standard Queen', price: '150', imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Presidential Penthouse', price: '1200', imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=300&q=80' },
];

const OwnerRoomManagementScreen = () => {
  const insets = useSafeAreaInsets();
  const [rooms, setRooms] = useState<RoomType[]>(initialRooms);

  const updatePrice = (id: string, newPrice: string) => {
    setRooms(rooms.map(room => room.id === id ? { ...room, price: newPrice } : room));
  };

  const handleSave = () => {
    // Mock save action
    console.log('Saved new prices:', rooms);
    alert('Room rates updated successfully.');
  };

  const renderRoom = ({ item }: { item: RoomType }) => (
    <View style={styles.roomCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.currentPriceLabel}>Current Rate / Night</Text>
        <View style={styles.priceInputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.priceInput}
            value={item.price}
            onChangeText={(text) => updatePrice(item.id, text)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Room Pricing</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={item => item.id}
        renderItem={renderRoom}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  saveButton: {
    backgroundColor: '#333333', // Dark charcoal
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 24,
  },
  roomCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  roomInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  currentPriceLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d4af37', // Gold accent
    paddingBottom: 4,
    width: 100,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 4,
  },
  priceInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    padding: 0,
  },
});

export default OwnerRoomManagementScreen;
