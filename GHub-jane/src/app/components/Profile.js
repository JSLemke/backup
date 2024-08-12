'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../my-supabase-auth-server/supabase.js';


export default function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = supabase.auth.user();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) console.error('Benutzerdaten nicht gefunden', error.message);
        else setUserData(data);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <p>Lade Benutzerdaten...</p>;
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
