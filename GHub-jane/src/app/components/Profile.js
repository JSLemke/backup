'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';
import UserCard from './UserCard';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw new Error(`Fehler beim Abrufen des Benutzers: ${userError.message}`);
        }

        if (!user || !user.id) {
          throw new Error('Benutzer-ID ist undefiniert oder Benutzer ist nicht angemeldet.');
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .limit(1);  // Begrenzen der Ergebnisse auf eine Zeile

        if (error) {
          throw new Error(`Fehler beim Abrufen der Benutzerdaten: ${error.message}`);
        }

        if (data.length === 0) {
          throw new Error('Keine Benutzerdaten gefunden.');
        }

        const userData = data[0];  // Zugriff auf das erste Element im Array

        setUserData({
          displayName: userData.nickname || 'Kein Nickname',
          photoURL: userData.photo_url || '/default-profile.png',
          email: userData.email,
          bio: userData.bio || 'Keine Bio hinterlegt',
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Lade Benutzerdaten...</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div className="profile p-8">
      <h1 className="text-3xl mb-4">Profil</h1>
      {userData ? (
        <UserCard user={userData} />
      ) : (
        <p>Keine Benutzerdaten gefunden.</p>
      )}
    </div>
  );
}
