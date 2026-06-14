import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRoomTypes, updateRoomType, RoomType } from '../services/roomService';

const OwnerRoomManagementScreen = () => {
  const insets = useSafeAreaInsets();
  const [rooms, setRooms] = useState<(RoomType & { price_str: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchRoomTypes(); }, []);

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const data = await getRoomTypes();
      const list = Array.isArray(data) ? data : [];
      setRooms(list.map(rt => ({ ...rt, price_str: String(rt.price) })));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = (id: number, newPrice: string) => {
    setRooms(rooms.map(room => room.id_room_type === id ? { ...room, price_str: newPrice } : room));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const promises = rooms.map(room =>
        updateRoomType(room.id_room_type, { price: parseInt(room.price_str) || room.price })
      );
      await Promise.all(promises);
      Alert.alert('Berhasil', 'Harga kamar berhasil diperbarui.');
      fetchRoomTypes();
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const getRoomImage = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('ocean') || n.includes('suite') || n.includes('vip'))
      return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80';
    if (n.includes('deluxe'))
      return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=300&q=80';
    if (n.includes('standard'))
      return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80';
    if (n.includes('presidential'))
      return 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=300&q=80';
    return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=300&q=80';
  };

  const renderRoom = ({ item }: { item: (RoomType & { price_str: string }) }) => (
    <View style={styles.roomCard}>
      <Image source={{ uri: getRoomImage(item.name) }} style={styles.thumbnail} />
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.currentPriceLabel}>Current Rate / Night</Text>
        <View style={styles.priceInputContainer}>
          <Text style={styles.currencySymbol}>Rp</Text>
          <TextInput
            style={styles.priceInput}
            value={item.price_str}
            onChangeText={(text) => updatePrice(item.id_room_type, text)}
            keyboardType="numeric"
            editable={!saving}
          />
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Room Pricing</Text>
        <TouchableOpacity style={[styles.saveButton, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={item => String(item.id_room_type)}
        renderItem={renderRoom}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#333333' },
  saveButton: { backgroundColor: '#333333', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  saveButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  listContent: { padding: 24 },
  roomCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#f0f0f0' },
  thumbnail: { width: 80, height: 80, borderRadius: 12, marginRight: 16 },
  roomInfo: { flex: 1, justifyContent: 'center' },
  roomName: { fontSize: 18, fontWeight: '600', color: '#333333', marginBottom: 4 },
  currentPriceLabel: { fontSize: 12, color: '#666666', marginBottom: 8 },
  priceInputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#d4af37', paddingBottom: 4, width: 120 },
  currencySymbol: { fontSize: 16, fontWeight: '600', color: '#333333', marginRight: 4 },
  priceInput: { fontSize: 16, fontWeight: '600', color: '#333333', flex: 1, padding: 0 },
});

export default OwnerRoomManagementScreen;
