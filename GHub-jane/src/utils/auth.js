import supabase from './supabaseClient'; // Verwende den Supabase-Client aus supabaseClient.js

// Funktion zum Registrieren eines Benutzers
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return data;
};

// Funktion zum Anmelden eines Benutzers
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('SignIn Error:', error.message); // Fehlerprotokollierung
    throw new Error(error.message);
  }

  console.log('SignIn Data:', data); // Debugging: Ausgabe der zurückgegebenen Daten

  if (!data || !data.user) {
    console.error('User not found in the returned data:', data);
    throw new Error('Anmeldung fehlgeschlagen.');
  }

  return data;
};
