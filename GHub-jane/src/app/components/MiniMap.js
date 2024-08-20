'use client'; // Sicherstellen, dass dies nur im Client gerendert wird

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Stelle sicher, dass die Leaflet CSS-Datei importiert wird

export default function GPSPage() {
  const mapRef = useRef(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Überprüfen, ob die Karte bereits existiert
      if (mapRef.current) return;

      // Initialisiere die Karte und speichere die Referenz
      mapRef.current = L.map('gpsmap').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Marker auf den aktuellen Standort setzen
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          L.marker([latitude, longitude]).addTo(mapRef.current);
          mapRef.current.setView([latitude, longitude], 13);
        },
        (error) => {
          setLocationError('Fehler beim Abrufen des Standorts: ' + error.message);
          console.error('Fehler beim Abrufen des Standorts', error);
        }
      );
    }
  }, []);

  return (
    <div>
      {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
      <div id="gpsmap" style={{ height: '400px', width: '100%' }} />
    </div>
  );
}
