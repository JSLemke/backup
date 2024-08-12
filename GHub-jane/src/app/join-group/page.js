'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';

export default function JoinGroup() {
  const [groupCode, setGroupCode] = useState('');
  const router = useRouter();

  const handleJoinGroup = async () => {
    const { data, error } = await supabase
      .from('familyCodes')
      .select('*')
      .eq('familyCode', groupCode)
      .single();

    if (error || !data) {
      alert('Invalid family code.');
    } else {
      const { error: updateError } = await supabase
        .from('users')
        .update({ familyCode: data.familyCode })
        .eq('id', supabase.auth.user().id);

      if (updateError) console.error('Error joining the family group:', updateError.message);
      else {
        alert('Successfully joined the family group!');
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="p-8 max-w-md w-full">
        <h1 className="text-4xl mb-6 text-center">Join Family Group</h1>
        <input
          type="text"
          placeholder="Family Code"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-500"
        />
        <button
          onClick={handleJoinGroup}
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
        >
          Join Group
        </button>
      </div>
    </div>
  );
}
