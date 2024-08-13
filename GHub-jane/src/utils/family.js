import { supabase } from '../../my-supabase-auth-server/supabase';

// Funktion zum Generieren und Zuordnen eines Familiencodes zu einem Benutzer
export const generateAndAssignFamilyCode = async (userId, familyName) => {
  const familyCode = `${familyName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Füge den neuen Familiencode zur `familyCodes` Tabelle hinzu
  const { error: insertError } = await supabase
    .from('familyCodes')
    .insert({
      familyName: familyName,
      familyCode: familyCode,
      createdAt: new Date(),
    });

  if (insertError) {
    throw new Error(`Error generating family code: ${insertError.message}`);
  }

  // Aktualisiere den Benutzer mit dem neuen Familiencode
  const { error: updateUserError } = await supabase.auth.updateUser({
    id: userId,
    data: { familyCode: familyCode },  // Benutzer-Metadaten aktualisieren
  });

  if (updateUserError) {
    throw new Error(`Error updating user with family code: ${updateUserError.message}`);
  }

  return familyCode;
};
