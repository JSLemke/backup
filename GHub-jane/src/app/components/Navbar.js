'use client';

import React, { useEffect, useState } from 'react';
// src/app/components/Navbar.js
import { supabase } from '../../utils/supabaseClient';

import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [familyCode, setFamilyCode] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      // Holen Sie sich die aktuelle Sitzung
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error.message);
        return;
      }

      if (session) {
        const user = session.user;
        try {
          const { data, error } = await supabase
            .from('users')
            .select('nickname, familyCode')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error.message);
          } else {
            setUserName(data.nickname || user.email);
            setFamilyCode(data.familyCode || 'N/A');
          }
        } catch (error) {
          console.error('Unexpected error fetching user data:', error.message);
        }
      } else {
        console.log('No user is logged in');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="bg-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Willkommen, {userName} (Familie: {familyCode})</h1>
      <div className="flex items-center space-x-4">
        <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
