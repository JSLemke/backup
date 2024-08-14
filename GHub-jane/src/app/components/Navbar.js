'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw new Error('Error fetching session: ' + error.message);
        }

        if (session) {
          const user = session.user;
          const { data, error: userError } = await supabase
            .from('users')
            .select('nickname, familyCode')
            .eq('id', user.id)
            .single();

          if (userError) {
            throw new Error('Error fetching user data: ' + userError.message);
          } else {
            setUserName(data.nickname || user.email);
            setFamilyCode(data.familyCode || 'N/A');
          }
        } else {
          console.log('No user is logged in');
        }
      } catch (err) {
        console.error('Unexpected error fetching session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push('/');
    } catch (err) {
      console.error('Error logging out:', err.message);
    }
  };

  if (loading) {
    return <p>Lade Navigation...</p>;
  }

  if (error) {
    return <p>Fehler: {error}</p>;
  }

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
