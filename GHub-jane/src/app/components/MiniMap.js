'use client'; // Diese Zeile stellt sicher, dass der Code nur im Client gerendert wird

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MiniMap() {
  const mapRef = useRef(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Überprüfen, ob das `window`-Objekt verfügbar ist
    if (typeof window !== 'undefined') {
      if (mapRef.current === null) {
        const map = L.map('minimap').setView([51.505, -0.09], 13); // Temporärer Startpunkt

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        // Versuche, den aktuellen Standort des Benutzers abzurufen
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              map.setView([latitude, longitude], 13);

              L.marker([latitude, longitude]).addTo(map)
                .bindPopup('Du bist hier!')
                .openPopup();
            },
            (error) => {
              setLocationError('Fehler beim Abrufen des Standorts: ' + error.message);
              console.error('Fehler beim Abrufen des Standorts', error);
            }
          );
        } else {
          setLocationError('Geolocation wird von diesem Browser nicht unterstützt.');
        }

        mapRef.current = map;
      }
    }
  }, []);

  return (
    <div>
      {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
      <div id="minimap" style={{ height: '500px', width: '100%' }} />
    </div>
  );
}
