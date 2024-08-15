'use client';

import React, { useState } from 'react';
import supabase from '../../utils/supabaseClient';
import { generateAndAssignFamilyCode } from '../../utils/family';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      // Erstellt einen neuen Benutzer
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw new Error(`Fehler bei der Registrierung: ${signUpError.message}`);
      }

      // Generiere und weise dem Benutzer einen Familiencode zu
      const familyCode = await generateAndAssignFamilyCode(user.id, familyName);
      console.log('Generated Family Code:', familyCode);

      alert('Registrierung erfolgreich!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register p-8">
      <h1 className="text-3xl mb-4">Registrieren</h1>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <input
          type="text"
          placeholder="Familienname"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <button
          onClick={handleRegister}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Registrieren
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
