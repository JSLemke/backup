'use client';

import React, { useState, useEffect } from 'react';
import MiniCalendar from './MiniCalendar';
import WeatherWidget from './WeatherWidget';
import TasksPreview from './TasksPreview';
import ShoppingListPreview from './ShoppingListPreview';
import ChatIcon from './ChatIcon';
import MiniMap from './MiniMap';
import supabase from '../../utils/supabaseClient';

export default function FamilyDashboard() {
  const [familyCode, setFamilyCode] = useState('');

  useEffect(() => {
    const fetchFamilyCode = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Fehler beim Abrufen des Benutzers', userError.message);
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('familyCode')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Fehler beim Abrufen des Familiencodes', error.message);
        } else {
          if (data && data.familyCode) {
            setFamilyCode(data.familyCode);
          } else {
            console.warn('Kein Familiencode gefunden.');
          }
        }
      }
    };

    fetchFamilyCode();
  }, []);

  return (
    <div className="family-dashboard p-8">
      <h1 className="text-3xl mb-4">Familiendashboard</h1>
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <h2 className="text-xl font-semibold">Familie:</h2>
        <p className="text-lg">{familyCode || 'Kein Familiencode zugeordnet'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MiniCalendar />
        <WeatherWidget />
        <TasksPreview />
        <ShoppingListPreview />
        <MiniMap />
      </div>
      <div className="mt-4 flex justify-end">
        <ChatIcon />
      </div>
    </div>
  );
}
