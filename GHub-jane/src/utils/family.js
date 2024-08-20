import supabase from './supabaseClient';

// Funktion zum Erstellen einer neuen Familie
export const createFamily = async (familyCode, userId) => {
  const { data, error } = await supabase
    .from('families')
    .insert([
      {
        familyCode,
        members: [userId],
        createdBy: userId,
      },
    ]);

  if (error) {
    console.error('Fehler beim Erstellen der Familie:', error);
    return null;
  }

  return data;
};

// Funktion zum Hinzufügen eines Benutzers zu einer bestehenden Familie
export const addUserToFamily = async (familyCode, userId) => {
  // Überprüfen, ob die Familie existiert
  const { data: family, error: familyError } = await supabase
    .from('families')
    .select('members')
    .eq('familyCode', familyCode)
    .single();

  if (familyError) {
    console.error('Familie nicht gefunden:', familyError);
    return null;
  }

  // Überprüfen, ob der Benutzer bereits Mitglied ist
  if (family.members.includes(userId)) {
    console.log('Benutzer ist bereits Mitglied der Familie.');
    return family;
  }

  // Benutzer zur Mitgliederliste hinzufügen
  const updatedMembers = [...family.members, userId];

  const { data, error } = await supabase
    .from('families')
    .update({ members: updatedMembers })
    .eq('familyCode', familyCode);

  if (error) {
    console.error('Fehler beim Hinzufügen des Benutzers zur Familie:', error);
    return null;
  }

  return data;
};
