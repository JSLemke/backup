'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [familyCode, setFamilyCode] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Holen Sie sich die aktuelle Sitzung
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error.message);
          return;
        }

        if (session) {
          const user = session.user;
          const { data, error: userError } = await supabase
            .from('users')
            .select('nickname, familyCode')
            .eq('id', user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError.message);
          } else {
            setUserName(data.nickname || user.email);
            setFamilyCode(data.familyCode || 'N/A');
          }
        } else {
          console.log('No user is logged in');
        }
      } catch (error) {
        console.error('Unexpected error fetching session:', error);
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
