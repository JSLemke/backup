import React, { useState, useEffect, useRef } from 'react';
import supabase from '../../utils/supabaseClient';
import Picker from 'emoji-picker-react';

export default function ChatPage({ receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Benutzer-ID abrufen und setzen
    const fetchUserId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Fehler beim Abrufen der Benutzer-ID:', error.message);
      } else if (user) {
        setUserId(user.id);
        console.log('User ID:', user.id);
      } else {
        console.error('Benutzer nicht angemeldet');
      }
    };

    fetchUserId();

    if (!receiverId) {
      console.error('Receiver ID is undefined');
      return;
    }

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender:sender_id (id, username),
          receiver:receiver_id (id, username)
        `)
        .eq('receiver_id', receiverId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Fehler beim Abrufen der Nachrichten:', error.message);
      } else {
        console.log('Fetched Messages:', data);
        setMessages(data);
        scrollToBottom(); // Zum Ende der Nachrichtenliste scrollen
      }
    };

    fetchMessages();

    // Realtime subscription für neue Nachrichten
    const messageSubscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        console.log('New message received:', payload.new);
        setMessages((prevMessages) => [...prevMessages, payload.new]);
        scrollToBottom(); // Zum Ende der Nachrichtenliste scrollen
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [receiverId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && userId) {
      const uuid = crypto.randomUUID(); // UUID für den Primärschlüssel generieren

      const { error } = await supabase
        .from('messages')
        .insert([{ 
          id: uuid,
          sender_id: userId,
          receiver_id: receiverId,
          content: newMessage,
          created_at: new Date(),
        }]);

      if (error) {
        console.error('Fehler beim Senden der Nachricht:', error.message);
      } else {
        console.log('Message sent:', newMessage);
        setNewMessage('');
        setShowEmojiPicker(false);
      }
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-container bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md w-full mx-auto mt-6">
      <div className="chat-box h-96 overflow-y-scroll p-4">
        {messages.map((message) => (
          <div key={message.id} className="message mb-4 flex items-start">
            <img 
              src={'/default-avatar.png'} 
              alt="Sender" 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div>
              <p className="text-sm font-semibold">
                {message.sender?.username || 'Unknown User'}
              </p>
              <p className="bg-gray-700 p-2 rounded-lg text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 relative">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="p-2 w-full rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
          placeholder="Type a message"
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute right-12 top-2 text-xl"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 right-0">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <button
          onClick={handleSendMessage}
          className="mt-2 p-2 w-full bg-blue-500 rounded text-white hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
