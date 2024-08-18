import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';

export default function ProfileEdit() {
  const [nickname, setNickname] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Fehler beim Abrufen des Benutzers', userError.message);
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Benutzerdaten nicht gefunden', error.message);
        } else {
          setNickname(data.nickname || '');
          setPhotoURL(data.photo_url || '');
          setEmail(data.email || '');
          setBio(data.bio || '');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);  // Setze den Ladezustand auf true
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Fehler beim Abrufen des Benutzers', userError.message);
      setLoading(false);
      return;
    }

    let uploadedPhotoURL = photoURL;

    if (file) {
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(`public/${user.id}/${file.name}`, file);

      if (error) {
        console.error('Fehler beim Hochladen des Bildes', error.message);
        setLoading(false);
        return;
      }

      uploadedPhotoURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pictures/public/${user.id}/${file.name}`;
    }

    if (user) {
      const { error } = await supabase
        .from('users')
        .update({
          nickname,
          photo_url: uploadedPhotoURL,
          email,
          bio,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Fehler beim Speichern des Profils', error.message);
      } else {
        alert('Profil erfolgreich aktualisiert');
        console.log('Profil erfolgreich gespeichert', { nickname, email, bio, uploadedPhotoURL });
      }
    }
    setLoading(false);  // Ladezustand wieder auf false setzen
  };

  return (
    <div className="profile-edit p-8">
      <h1 className="text-3xl mb-4">Profil bearbeiten</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none"
        />
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Profilbild hochladen
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
        </div>
        <button
          onClick={handleSave}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}  // Deaktivieren Sie die Schaltfläche während des Ladens
        >
          {loading ? 'Speichern...' : 'Speichern'}
        </button>
      </div>
    </div>
  );
}
