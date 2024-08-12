// src/app/components/WeatherWidget.js

'use client';

import React, { useEffect, useState } from 'react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState('Berlin'); // Standard-Standort

    useEffect(() => {
        fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location}`)
            .then(res => res.json())
            .then(data => {
                setWeather(data);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }, [location]);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Wetter</h2>
            {weather ? (
                <div>
                    <p className="text-lg font-semibold">{weather.location.name}</p>
                    <p>{weather.current.condition.text}</p>
                    <p>{weather.current.temp_c}°C</p>
                    <img src={weather.current.condition.icon} alt="Wetter Icon" />
                </div>
            ) : (
                <p>Lade Wetterdaten...</p>
            )}
        </div>
    );
}
