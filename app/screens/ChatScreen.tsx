import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getChats, createChat, getChatMessages, sendMessage, ChatMessage } from '../services/chatService';
import { useRole } from '../context/RoleContext';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useRole();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initChat();
  }, []);

  const initChat = async () => {
    setLoading(true);
    try {
      const chats = await getChats();
      const chatList = Array.isArray(chats) ? chats : [];
      
      // Find existing chat for this customer
      const myChat = user ? chatList.find(c => c.id_customer === user.id) : null;
      
      if (myChat) {
        setChatId(myChat.id_chat);
        const msgs = await getChatMessages(myChat.id_chat);
        setMessages(Array.isArray(msgs) ? msgs : []);
      } else if (user) {
        // Create a new chat with staff id=1 (default)
        try {
          const newChat = await createChat(user.id, 1);
          setChatId(newChat.id_chat);
          setMessages([]);
        } catch {
          // If create fails, just show empty
          setMessages([]);
        }
      }
    } catch (error: any) {
      // Silently handle - show empty chat
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !chatId) return;

    const msgText = message.trim();
    setMessage('');
    setSending(true);

    try {
      const newMsg = await sendMessage(chatId, 'customer', msgText);
      setMessages(prev => [...prev, newMsg]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal mengirim pesan');
      setMessage(msgText); // Restore message on failure
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.headerName}>CS Hotel Arca</Text>
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="call-outline" size={24} color="#8B5E3C" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8B5E3C" />
        </View>
      ) : (
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.chatArea}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.length === 0 && (
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Text style={{ color: '#888', fontSize: 14 }}>Mulai percakapan dengan CS Hotel Arca</Text>
            </View>
          )}
          {messages.map((msg) => (
            msg.sender_type === 'staff' ? (
              <View key={msg.id_chat_message} style={styles.messageBubbleReceived}>
                <Text style={styles.messageTextReceived}>{msg.message}</Text>
                <Text style={styles.timeText}>{formatTime(msg.date)}</Text>
              </View>
            ) : (
              <View key={msg.id_chat_message} style={styles.messageBubbleSent}>
                <Text style={styles.messageTextSent}>{msg.message}</Text>
                <Text style={styles.timeTextSent}>{formatTime(msg.date)}</Text>
              </View>
            )
          ))}
        </ScrollView>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="camera-outline" size={24} color="#8B5E3C" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Ketik pesan..."
            value={message}
            onChangeText={setMessage}
            editable={!sending}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={sending || !message.trim()}>
            {sending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C2C2C',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  chatArea: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubbleReceived: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageTextReceived: {
    color: '#2C2C2C',
    fontSize: 15,
    lineHeight: 22,
  },
  messageBubbleSent: {
    backgroundColor: '#8B5E3C',
    padding: 14,
    borderRadius: 16,
    borderTopRightRadius: 4,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageTextSent: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 22,
  },
  timeText: {
    fontSize: 11,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  timeTextSent: {
    fontSize: 11,
    color: '#E0D0C1',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#8B5E3C',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
