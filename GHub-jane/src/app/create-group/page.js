'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    const user = supabase.auth.user();
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const newFamilyCode = `${groupName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setFamilyCode(newFamilyCode);

      const groupData = {
        groupName: groupName,
        familyCode: newFamilyCode,
        createdBy: user.id,
        members: { [user.id]: true },
        createdAt: new Date(),
      };

      const { error } = await supabase.from('families').insert([groupData]);
      if (error) throw error;

      alert(`Group created! Your family code is: ${newFamilyCode}`);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error writing to database:", error.message);
      setError("Error creating family group: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="p-8 max-w-md w-full">
        <h1 className="text-4xl mb-6 text-center">Create Family Group</h1>
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-500"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Group
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
