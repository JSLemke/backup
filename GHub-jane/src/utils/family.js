import supabase from './supabaseClient'; // Verwende den Supabase-Client aus supabaseClient.js

// Funktion zum Generieren und Zuordnen eines Familiencodes zu einem Benutzer
export const generateAndAssignFamilyCode = async (userId, familyName) => {
  const familyCode = `${familyName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Füge den neuen Familiencode zur `families` Tabelle hinzu
  const { error: insertError } = await supabase
    .from('families')
    .insert({
      familyCode: familyCode,
      createdBy: userId,
      createdAt: new Date(),
    });

  if (insertError) {
    throw new Error(`Error generating family code: ${insertError.message}`);
  }

  // Aktualisiere den Benutzer mit dem neuen Familiencode in der `users` Tabelle
  const { error: updateUserError } = await supabase
    .from('users')
    .update({ familyCode: familyCode })
    .eq('id', userId);

  if (updateUserError) {
    throw new Error(`Error updating user with family code: ${updateUserError.message}`);
  }

  return familyCode;
};
