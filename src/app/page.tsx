'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine} from 'recharts';

type Measurement = {
  id: string;
  startMeasurement: string;
  endMeasurement: string;
  coordinate: string;
  values: number[];
  frequencies: number[];
};

export default function Home() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/measurements');
        if (!res.ok) {
          throw new Error('Error fetching data');
        }
        const data: Measurement[] = await res.json();
        setMeasurements(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // --- Helper: get healthy and current per coordinate ---
  function getHealthyAndCurrent(measurements: Measurement[]) {
    const grouped: Record<string, { healthy?: Measurement; current?: Measurement }> = {};

    for (const m of measurements) {
      const coord = m.coordinate;

      if (!grouped[coord]) {
        grouped[coord] = { healthy: m, current: m };
      } else {
        // update healthy if earlier
        if (
          new Date(m.startMeasurement).getTime() <
          new Date(grouped[coord].healthy!.startMeasurement).getTime()
        ) {
          grouped[coord].healthy = m;
        }
        // update current if newer
        if (
          new Date(m.endMeasurement).getTime() >
          new Date(grouped[coord].current!.endMeasurement).getTime()
        ) {
          grouped[coord].current = m;
        }
      }
    }

    return grouped;
  }

  const grouped = getHealthyAndCurrent(measurements);

  const combineData = (
    healthy: Measurement | undefined,
    current: Measurement | undefined
  ) => {
    if (!healthy && !current) return [];

    const length = healthy ? healthy.values.length : current!.values.length;
    const combined: { frequency: number; healthyValue?: number; currentValue?: number }[] = [];

    for (let i = 0; i < length; i++) {
      combined.push({
        frequency: healthy?.frequencies[i] ?? current!.frequencies[i],
        healthyValue: healthy?.values[i],
        currentValue: current?.values[i]
      });
    }

    return combined;
  };

  const xData = combineData(grouped.X?.healthy, grouped.X?.current);
  const yData = combineData(grouped.Y?.healthy, grouped.Y?.current);
  const zData = combineData(grouped.Z?.healthy, grouped.Z?.current);
  const magnitudeData = combineData(grouped.Magnitude?.healthy, grouped.Magnitude?.current);

  // Custom styles for axis labels
  const axisLabelStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    fill: '#333'
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>Vibration Frequency Dashboard</h1>
      {measurements.length === 0 ? (
        <p>Loading measurements...</p>
      ) : (
        <>
          {/* X Axis */}
          <h2 style={{ color: '#333' }}>X Axis</h2>
          <ResponsiveContainer width="100%" height={700}>
            <LineChart data={xData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="frequency" 
                label={{ 
                  value: 'Frequency (Hz)', 
                  position: 'insideBottom', 
                  offset: -5, 
                  style: axisLabelStyle 
                }} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <YAxis 
                label={{ 
                  value: 'Magnitude [g]', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: axisLabelStyle 
                }} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="healthyValue" stroke="#8884d8" name="Healthy State" strokeWidth={2} strokeDasharray="5 5" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="currentValue" stroke="#82ca9d" name="Current State" />
              <ReferenceLine y={1} stroke="yellow" strokeDasharray="3 3" label="1 g Warning" />
            </LineChart>
          </ResponsiveContainer>

          {/* Y Axis */}
          <h2 style={{ color: '#333' }}>Y Axis</h2>
          <ResponsiveContainer width="100%" height={700}>
            <LineChart data={yData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="frequency" 
                label={{ 
                  value: 'Frequency (Hz)', 
                  position: 'insideBottom', 
                  offset: -5, 
                  style: axisLabelStyle 
                }} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <YAxis 
                label={{ 
                  value: 'Magnitude [g]', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: axisLabelStyle 
                }} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="healthyValue" stroke="#8884d8" name="Healthy State" strokeWidth={2} strokeDasharray="5 5" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="currentValue" stroke="#82ca9d" name="Current State" />
              <ReferenceLine y={1} stroke="yellow" strokeDasharray="3 3" label="1 g Warning" />
            </LineChart>
          </ResponsiveContainer>

          {/* Z Axis */}
          <h2 style={{ color: '#333' }}>Z Axis</h2>
          <ResponsiveContainer width="100%" height={700}>
            <LineChart data={zData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="frequency" 
                label={{ 
                  value: 'Frequency (Hz)', 
                  position: 'insideBottom', 
                  offset: -5, 
                  style: axisLabelStyle 
                }} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <YAxis 
                label={{ 
                  value: 'Magnitude [g]', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: axisLabelStyle 
                }} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="healthyValue" stroke="#8884d8" name="Healthy State" strokeWidth={2} strokeDasharray="5 5" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="currentValue" stroke="#82ca9d" name="Current State" />
              <ReferenceLine y={1} stroke="yellow" strokeDasharray="3 3" label="1 g Warning" />
            </LineChart>
          </ResponsiveContainer>

          {/* Magnitude */}
          <h2 style={{ color: '#333' }}>Overall Magnitude</h2>
          <ResponsiveContainer width="100%" height={700}>
            <LineChart data={magnitudeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="frequency" 
                label={{ 
                  value: 'Frequency (Hz)', 
                  position: 'insideBottom', 
                  offset: -5, 
                  style: axisLabelStyle 
                }} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <YAxis 
                label={{ 
                  value: 'Magnitude [g]', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: axisLabelStyle 
                }} 
                tick={{ fontSize: 12, fill: '#333' }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="healthyValue" stroke="#8884d8" name="Healthy State" strokeWidth={2} strokeDasharray="5 5" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="currentValue" stroke="#82ca9d" name="Current State" />
              <ReferenceLine y={1} stroke="yellow" strokeDasharray="3 3" label="1 g Warning" />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};