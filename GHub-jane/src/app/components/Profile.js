'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        const user = session?.user;
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();  // Verwende maybeSingle, um den Fehler zu umgehen

          if (error) {
            throw new Error('Fehler beim Abrufen der Benutzerdaten: ' + error.message);
          } else if (!data) {
            throw new Error('Keine Benutzerdaten gefunden.');
          } else {
            setUserData(data);
          }
        } else {
          throw new Error('Kein Benutzer authentifiziert');
        }
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Lade Benutzerdaten...</p>;
  }

  if (error) {
    return <p>Fehler: {error}</p>;
  }

  return (
    <div className="profile p-8">
      <h1 className="text-3xl mb-4">Profil</h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <img src={userData.photoURL || '/default-profile.png'} alt="Profilbild" className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h2 className="text-2xl text-center font-semibold mb-4">{userData.nickname}</h2>
        <p className="text-lg text-center mb-2">Familiencode: {userData.familyCode}</p>
        <p className="text-lg text-center mb-2">Beruf: {userData.job}</p>
        <p className="text-lg text-center mb-2">Hobbys: {userData.hobbies}</p>
        <p className="text-lg text-center mb-2">Telefon: {userData.phone}</p>
        <p className="text-lg text-center mb-2">Email: {userData.email}</p>
        <div className="text-center">
          <a href={userData.instagram} className="text-blue-500 hover:underline mx-2">Instagram</a>
          <a href={userData.google} className="text-blue-500 hover:underline mx-2">Google</a>
          <a href={userData.linkedin} className="text-blue-500 hover:underline mx-2">LinkedIn</a>
        </div>
      </div>
    </div>
  );
}
