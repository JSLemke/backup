'use client';

import React from 'react';
import { useSupabase } from '../../utils/supabaseClient';

export default function UserCard({ user }) {
    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg shadow-md mb-6">
            <img
                src={user.photoURL || '/default-profile.png'}
                alt="User Profile"
                className="w-16 h-16 rounded-full object-cover"
            />
            <div>
                <h2 className="text-xl font-semibold text-white">Hi {user.displayName}</h2>
            </div>
        </div>
    );
}
