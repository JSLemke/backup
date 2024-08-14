'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient'; // Korrekte Importpfad für Supabase
import Picker from 'emoji-picker-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) console.error('Error fetching messages:', error.message);
      else setMessages(data);
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const { error } = await supabase
        .from('messages')
        .insert([{ text: newMessage, timestamp: new Date() }]);

      if (error) console.error('Error sending message:', error.message);
      setNewMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (event, emojiObject) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-container bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md w-full mx-auto mt-6">
      <div className="chat-box h-96 overflow-y-scroll p-4">
        {messages.map((message) => (
          <div key={message.id} className="message mb-4 flex items-start">
            <div>
              <p className="text-sm font-semibold">{message.userName}</p>
              <p className="bg-gray-700 p-2 rounded-lg text-sm">{message.text}</p>
            </div>
          </div>
        ))}
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
