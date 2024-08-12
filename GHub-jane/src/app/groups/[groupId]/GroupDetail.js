'use client';

import { useState, useEffect } from 'react';
import supabase from '../../../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Modal';

export default function GroupDetail({ groupId }) {
  const [group, setGroup] = useState(null);
  const [user, setUser] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchGroupData = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (error) {
        console.error('Group not found', error.message);
        router.push('/');
      } else {
        setGroup(data);
      }
    };

    const fetchUserData = () => {
      const currentUser = supabase.auth.user();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    fetchGroupData();
    fetchUserData();
  }, [groupId, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true })
        .eq('groupId', groupId);

      if (error) console.error('Error fetching messages:', error.message);
      else setMessages(data);
    };

    fetchMessages();
  }, [groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const { error } = await supabase
        .from('messages')
        .insert([{ text: newMessage, timestamp: new Date(), user: user.id, userName: user.email }]);

      if (error) console.error('Error sending message:', error.message);
      setNewMessage('');
    }
  };

  const handleJoinGroup = async () => {
    if (user) {
      const { error } = await supabase
        .from('groups')
        .update({ members: { ...group.members, [user.id]: true } })
        .eq('id', groupId);

      if (error) console.error('Error joining group:', error.message);
      else setGroup({ ...group, members: { ...group.members, [user.id]: true } });
    }
  };

  const handleLeaveGroup = async () => {
    if (user) {
      const newMembers = { ...group.members };
      delete newMembers[user.id];

      const { error } = await supabase
        .from('groups')
        .update({ members: newMembers })
        .eq('id', groupId);

      if (error) console.error('Error leaving group:', error.message);
      else setGroup({ ...group, members: newMembers });
    }
  };

  const handleDeleteGroup = async () => {
    if (user && group && user.id === group.createdBy) {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) console.error('Error deleting group:', error.message);
      else router.push('/');
    }
  };

  const generateInviteCode = () => {
    const code = Math.random().toString(36).substr(2, 8);
    setGeneratedCode(code);
    return code;
  };

  const handleCreateInvite = async () => {
    if (user && user.id === group.createdBy) {
      const code = generateInviteCode();
      const { error } = await supabase
        .from('invites')
        .insert([{ code, used: false, groupId }]);

      if (error) console.error('Error creating invite code:', error.message);
      else {
        await supabase
          .from('groups')
          .update({ inviteCode: code })
          .eq('id', groupId);

        console.log('Invite code created:', code);
      }
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!group || !user) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-3xl mb-4">{group.name}</h2>
      <p className="text-lg mb-2">{group.description}</p>

      {user.id !== group.createdBy && !group.members[user.id] && (
        <button
          onClick={handleJoinGroup}
          className="p-2 bg-green-500 text-white rounded mb-4"
        >
          Join Group
        </button>
      )}

      {user.id !== group.createdBy && group.members[user.id] && (
        <button
          onClick={handleLeaveGroup}
          className="p-2 bg-red-500 text-white rounded mb-4"
        >
          Leave Group
        </button>
      )}

      {user.id === group.createdBy && (
        <div>
          <button
            onClick={handleCreateInvite}
            className="p-2 bg-blue-500 text-white rounded mb-4"
          >
            Create Invite Code
          </button>
          {group.inviteCode && <p>Current Invite Code: {group.inviteCode}</p>}
        </div>
      )}

      {user.id === group.createdBy && (
        <button
          onClick={handleDeleteGroup}
          className="p-2 bg-red-500 text-white rounded"
        >
          Delete Group
        </button>
      )}

      <button
        onClick={handleOpenModal}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Open Live Chat
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="chat-box">
          {messages.map((message) => (
            <div key={message.id} className="message">
              <p>{message.userName || 'Unknown User'}: {message.text}</p>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-2"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </Modal>
    </div>
  );
}
