'use client';
import React, { useState } from 'react';

interface WeatherData {
  name: string;
  main: { temp: number; humidity: number; feels_like: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e?: React.FormEvent, searchCity?: string) => {
    if (e) e.preventDefault();
    const targetCity = searchCity || city;
    if (!targetCity.trim()) return;
    setLoading(true);
    setError('');
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '82fb99830db79c7d04c146e13e4cd2ed';
      const res = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(targetCity) + '&units=metric&appid=' + apiKey);
      const data = await res.json();
      if (res.ok && data.cod === 200) {
        setWeather(data);
        if (!history.includes(data.name)) {
          setHistory([data.name, ...history]);
        }
      } else {
        setError(data.message || 'City not found');
      }
    } catch (err: any) {
      setError('Error loading weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWeather(null);
    setCity('');
    setError('');
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 10px 0' }}>
            Weather Intelligence Dashboard
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Real-time Weather Analytics Assessment App</p>
        </header>

        <form onSubmit={(e) => handleSearch(e)} style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
          <input
            type='text'
            placeholder='Enter city name (e.g. Lahore, Karachi, Tokyo)...'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ flex: 1, padding: '14px 20px', fontSize: '1rem', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' }}
          />
          <button type='submit' style={{ padding: '14px 24px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#fff', cursor: 'pointer' }}>
            Search
          </button>
          {weather && (
            <button type='button' onClick={handleReset} style={{ padding: '14px 20px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#334155', color: '#fff', cursor: 'pointer' }}>
              Back / Clear
            </button>
          )}
        </form>

        {loading && <p style={{ textAlign: 'center', color: '#38bdf8' }}>Fetching live metrics...</p>}
        {error && <p style={{ color: '#ef4444', backgroundColor: '#451a1a', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>{error}</p>}

        {weather && (
          <div style={{ backgroundColor: '#1e293b', borderRadius: '20px', padding: '28px', border: '1px solid #334155', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '700' }}>{weather.name}</h2>
                <p style={{ color: '#94a3b8', margin: '4px 0 0 0', textTransform: 'capitalize' }}>{weather.weather[0].description}</p>
              </div>
              <img src={'https://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'} alt='weather icon' style={{ width: '80px', height: '80px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Temperature</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '4px 0 0 0', color: '#38bdf8' }}>{weather.main.temp}°C</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Feels Like</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '4px 0 0 0', color: '#818cf8' }}>{weather.main.feels_like}°C</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Humidity</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '4px 0 0 0', color: '#34d399' }}>{weather.main.humidity}%</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Wind Speed</span>
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '4px 0 0 0', color: '#f43f5e' }}>{weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '20px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 12px 0', color: '#94a3b8' }}>Recent Searches</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {history.map((cityName, idx) => (
                <button key={idx} onClick={() => { setCity(cityName); handleSearch(undefined, cityName); }} style={{ backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #334155', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  {cityName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
