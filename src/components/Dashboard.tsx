import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';
import {
  Thermometer, Droplets, Users, Wind, Lightbulb, Activity
} from 'lucide-react';

import UserInfoForm from './ui/UserInfoForm';

interface SensorReading {
  id: number;
  sensorType: string;
  value: number;
  unit: string;
  timestamp: string;
  isValid: boolean;
  space: {
    id: number;
    name: string;
  };
}

interface ChartDataPoint {
  timestamp: string;
  value: number;
  unit: string;
  fullTimestamp: string;
}

interface SensorData {
  temperature: ChartDataPoint[];
  humidity: ChartDataPoint[];
  occupancy: ChartDataPoint[];
  co2: ChartDataPoint[];
  light: ChartDataPoint[];
  motion: ChartDataPoint[];
}

interface RealTimeData {
  temperature: { value: number; unit: string; timestamp: string | null };
  humidity: { value: number; unit: string; timestamp: string | null };
  occupancy: { value: number; unit: string; timestamp: string | null };
  co2: { value: number; unit: string; timestamp: string | null };
  light: { value: number; unit: string; timestamp: string | null };
}

interface UserInfoData {
  profession: string;
  secteur: string;
  besoinsSpecifiques?: string;
}

const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: [],
    humidity: [],
    occupancy: [],
    co2: [],
    light: [],
    motion: []
  });

  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    temperature: { value: 0, unit: '°C', timestamp: null },
    humidity: { value: 0, unit: '%', timestamp: null },
    occupancy: { value: 0, unit: 'people', timestamp: null },
    co2: { value: 0, unit: 'ppm', timestamp: null },
    light: { value: 0, unit: 'lux', timestamp: null }
  });

  const [spaceName, setSpaceName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // État pour le message de confirmation ou d'erreur (remplace alert)
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const handleUserInfoSubmit = async (data: UserInfoData) => {
    try {
      const res = await fetch("http://localhost:8081/api/user-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi des données");

      setConfirmationMessage("Informations utilisateur enregistrées avec succès !");
    } catch (error) {
      setConfirmationMessage("Erreur lors de l'envoi : " + (error as Error).message);
    }
  };

  const safeNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const safeTimestamp = (timestamp: any): string => {
    if (!timestamp) return new Date().toISOString();
    if (typeof timestamp === 'string') return timestamp;
    return new Date(timestamp).toISOString();
  };

  const fetchSensorData = async (spaceId: number = 1): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8081/sensors/space/${spaceId}`);
      if (!response.ok) throw new Error('Failed to fetch sensor data');

      const data: SensorReading[] = await response.json();

      if (data.length > 0 && data[0].space && data[0].space.name) {
        setSpaceName(data[0].space.name);
      } else {
        setSpaceName('Inconnue');
      }

      const groupedData: SensorData = {
        temperature: [],
        humidity: [],
        occupancy: [],
        co2: [],
        light: [],
        motion: []
      };

      data.forEach(reading => {
        const type = reading.sensorType.toLowerCase() as keyof SensorData;
        if (groupedData[type]) {
          groupedData[type].push({
            timestamp: new Date(reading.timestamp).toLocaleTimeString(),
            value: safeNumber(reading.value),
            unit: reading.unit || '',
            fullTimestamp: safeTimestamp(reading.timestamp)
          });
        }
      });

      Object.keys(groupedData).forEach(key => {
        const sensorType = key as keyof SensorData;
        groupedData[sensorType] = groupedData[sensorType]
          .sort((a, b) => new Date(a.fullTimestamp).getTime() - new Date(b.fullTimestamp).getTime())
          .slice(-20);
      });

      setSensorData(groupedData);

      // Met à jour les données temps réel avec les dernières valeurs
      Object.keys(groupedData).forEach(key => {
        const sensorType = key as keyof SensorData;
        const latestReading = groupedData[sensorType][groupedData[sensorType].length - 1];
        if (latestReading && sensorType in realTimeData) {
          setRealTimeData(prev => ({
            ...prev,
            [sensorType]: {
              value: safeNumber(latestReading.value),
              unit: latestReading.unit,
              timestamp: latestReading.fullTimestamp
            }
          }));
        }
      });

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081/ws/sensor-data');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const type = data.sensorType.toLowerCase() as keyof SensorData;

        if (type in realTimeData) {
          setRealTimeData(prev => ({
            ...prev,
            [type]: {
              value: safeNumber(data.value),
              unit: data.unit || '',
              timestamp: safeTimestamp(data.timestamp)
            }
          }));
        }

        if (type in sensorData) {
          setSensorData(prev => ({
            ...prev,
            [type]: [...prev[type], {
              timestamp: new Date(data.timestamp).toLocaleTimeString(),
              value: safeNumber(data.value),
              unit: data.unit || '',
              fullTimestamp: safeTimestamp(data.timestamp)
            }].slice(-20)
          }));
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(() => fetchSensorData(), 30000);
    return () => clearInterval(interval);
  }, []);

  const getSensorIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'temperature': return <Thermometer className="w-6 h-6" />;
      case 'humidity': return <Droplets className="w-6 h-6" />;
      case 'occupancy': return <Users className="w-6 h-6" />;
      case 'co2': return <Wind className="w-6 h-6" />;
      case 'light': return <Lightbulb className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  const getSensorColor = (type: string): string => {
    switch (type) {
      case 'temperature': return '#ff6b6b';
      case 'humidity': return '#4ecdc4';
      case 'occupancy': return '#45b7d1';
      case 'co2': return '#96ceb4';
      case 'light': return '#ffeaa7';
      default: return '#ddd';
    }
  };

  const getSensorName = (type: string): string => {
    switch (type) {
      case 'temperature': return 'Temperature';
      case 'humidity': return 'Humidity';
      case 'occupancy': return 'Occupancy';
      case 'co2': return 'CO2 Level';
      case 'light': return 'Light Level';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-lg">Error loading sensor data: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-lg">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sensor Data Dashboard</h1>

        <h2 className="text-2xl font-semibold mb-8">Salle : {spaceName}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Object.entries(realTimeData).map(([type, data]) => (
            <div key={type} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div style={{ color: getSensorColor(type) }}>
                    {getSensorIcon(type)}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {getSensorName(type)}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-gray-900">
                  {data.value.toFixed(1)} {data.unit}
                </div>
                <div className="text-sm text-gray-500">
                  {data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'No data'}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(sensorData).map(([type, data]) => {
            if (data.length === 0) return null;

            return (
              <div key={type} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <div style={{ color: getSensorColor(type) }}>
                    {getSensorIcon(type)}
                  </div>
                  <span>{getSensorName(type)} Trends</span>
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  {type === 'occupancy' ? (
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tick={{ fontSize: 14 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [`${value} ${data[0]?.unit || ''}`, getSensorName(type)]}
                      />
                      <Bar
                        dataKey="value"
                        fill={getSensorColor(type)}
                        name={getSensorName(type)}
                      />
                    </BarChart>
                  ) : (
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tick={{ fontSize: 14 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [`${value} ${data[0]?.unit || ''}`, getSensorName(type)]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={getSensorColor(type)}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={getSensorName(type)}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>

        {/* Formulaire utilisateur */}
        <div className="mt-12 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center"></h2>
          <UserInfoForm onSubmit={handleUserInfoSubmit} />
        </div>

        {/* Message de confirmation / erreur */}
        {confirmationMessage && (
          <div className="fixed bottom-8 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg max-w-xs animate-fadeIn">
            {confirmationMessage}
            <button
              onClick={() => setConfirmationMessage(null)}
              className="ml-4 underline text-white hover:text-green-300 focus:outline-none"
            >
              Fermer
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-base text-gray-500">
          <p>Data refreshes automatically via WebSocket connection</p>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
