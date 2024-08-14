'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const generateFamilyCode = () => {
    const code = `${familyName}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setFamilyCode(code);
  };

  const handleSignUp = async () => {
    try {
      if (!familyCode) {
        throw new Error('Bitte generieren Sie einen Familiencode, bevor Sie sich registrieren.');
      }

      // Registriere den Benutzer mit Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error('Die Benutzerregistrierung ist fehlgeschlagen');

      // Füge den Benutzer in die 'users'-Tabelle ein
      const { error: docError } = await supabase.from('users').insert([
        {
          id: user.id, // Verwende die von Supabase generierte Benutzer-ID
          email: user.email,
          familyCode: familyCode, // Verwende den generierten Familiencode
          createdAt: new Date().toISOString(), // Verwende das aktuelle Datum
          nickname: '', // Falls es ein Eingabefeld für den Nickname gibt, kannst du diesen hier setzen
        },
      ]);

      if (docError) throw docError;

      alert('Registrierung erfolgreich! Bitte loggen Sie sich jetzt ein.');
      router.push('/login'); // Weiterleitung zur Login-Seite nach erfolgreicher Registrierung
    } catch (error) {
      setError(error.message);
      // Stelle sicher, dass keine Weiterleitung erfolgt, wenn ein Fehler auftritt
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="p-8 max-w-md w-full">
        <h1 className="text-4xl mb-6 text-center">Registrieren</h1>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-500"
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <input
            type="text"
            placeholder="Familienname"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-700"
            required
          />
          <button
            type="button"
            onClick={generateFamilyCode}
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Familiencode generieren
          </button>
          <input
            type="text"
            placeholder="Generierter Familiencode"
            value={familyCode}
            onChange={(e) => setFamilyCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-silver-500"
            required
            disabled
          />
          <button
            type="submit"
            onClick={handleSignUp}
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Jetzt registrieren
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
