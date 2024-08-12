'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';

export default function ProfileEdit() {
  const [nickname, setNickname] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = supabase.auth.user();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setNickname(data.nickname);
          setPhotoURL(data.photo_url);
          setEmail(data.email);
          setBio(data.bio);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = supabase.auth.user();
    if (user) {
      const { error } = await supabase
        .from('users')
        .update({
          nickname,
          photo_url: photoURL,
          email,
          bio
        })
        .eq('id', user.id);
      if (error) throw new Error(error.message);
      alert('Profil aktualisiert');
    }
  };

  return (
    <div className="profile-edit p-8">
      <h1 className="text-3xl mb-4">Profil bearbeiten</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <input
          type="text"
          placeholder="Profilbild-URL"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <button
          onClick={handleSave}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}
