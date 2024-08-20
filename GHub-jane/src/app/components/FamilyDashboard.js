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
            await addToFamilyTable(user.id, data.familyCode); // Füge den Benutzer zur Familien-Tabelle hinzu
          } else {
            console.warn('Kein Familiencode gefunden.');
          }
        }
      }
    };

    fetchFamilyCode();
  }, []);

  const addToFamilyTable = async (userId, familyCode) => {
    // Abrufen der aktuellen Mitgliederliste
    const { data: family, error: fetchError } = await supabase
      .from('families')
      .select('members')
      .eq('familyCode', familyCode)
      .single();

    if (fetchError) {
      console.error('Fehler beim Abrufen der Familienmitglieder', fetchError.message);
      return;
    }

    // Hinzufügen des neuen Mitglieds zur Mitgliederliste
    const updatedMembers = [...(family.members || []), userId];

    // Aktualisieren der Mitgliederliste in der Datenbank
    const { error: updateError } = await supabase
      .from('families')
      .update({ members: updatedMembers })
      .eq('familyCode', familyCode);

    if (updateError) {
      console.error('Fehler beim Hinzufügen des Benutzers zur Familien-Tabelle:', updateError.message);
    } else {
      console.log('Benutzer erfolgreich zur Familien-Tabelle hinzugefügt.');
    }
  };

  return (
    <div className="family-dashboard p-8">
      <h1 className="text-3xl mb-4">Familiendashboard</h1>
      <div className="bg-gray-100 p-4 mb-4 rounded flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Familie:</h2>
          <p className="text-lg">{familyCode || 'Kein Familiencode zugeordnet'}</p>
        </div>
        <ChatIcon />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MiniCalendar />
        <WeatherWidget />
        <TasksPreview />
        <ShoppingListPreview />
        <MiniMap />
      </div>
    </div>
  );
}
