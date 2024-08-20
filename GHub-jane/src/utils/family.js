import supabase from './supabaseClient'; // Verwende den Supabase-Client aus supabaseClient.js

// Funktion zum Generieren und Zuordnen eines Familiencodes zu einem Benutzer
export const generateAndAssignFamilyCode = async (userId, familyName) => {
  const familyCode = `${familyName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Füge den neuen Familiencode zur families Tabelle hinzu
  const { data: familyData, error: insertError } = await supabase
    .from('families')
    .insert({
      familyCode: familyCode,
      createdBy: userId,
      createdAt: new Date(),
      members: [userId], // Initial füge den Benutzer als Mitglied hinzu
    });

  if (insertError) {
    throw new Error(`Error generating family code: ${insertError.message}`);
  }

  // Aktualisiere den Benutzer mit dem neuen Familiencode in der users Tabelle
  const { error: updateUserError } = await supabase
    .from('users')
    .update({ familyCode: familyCode })
    .eq('id', userId);

  if (updateUserError) {
    throw new Error(`Error updating user with family code: ${updateUserError.message}`);
  }

  return familyCode;
};

// Funktion zum Hinzufügen eines Benutzers zu einer existierenden Familie
export const addUserToFamily = async (userId, familyCode) => {
  // Füge den Benutzer zur members Liste der entsprechenden Familie hinzu
  const { data, error } = await supabase
    .from('families')
    .update({
      members: supabase.raw('array_append(members, ?)', [userId])
    })
    .eq('familyCode', familyCode);

  if (error) {
    throw new Error(`Error adding user to family: ${error.message}`);
  }

  // Aktualisiere den Benutzer mit dem Familiencode in der users Tabelle
  const { error: updateUserError } = await supabase
    .from('users')
    .update({ familyCode: familyCode })
    .eq('id', userId);

  if (updateUserError) {
    throw new Error(`Error updating user with family code: ${updateUserError.message}`);
  }
};
