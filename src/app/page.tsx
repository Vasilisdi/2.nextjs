'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  // --- Helper: combine into chart data ---
  const combineData = (
    healthy: Measurement | undefined,
    current: Measurement | undefined
  ) => {
    if (!healthy && !current) return [];

    const dataMap: Record<number, { frequency: number; healthyValue?: number; currentValue?: number }> = {};

    if (healthy) {
      healthy.frequencies.forEach((freq, i) => {
        if (!dataMap[freq]) dataMap[freq] = { frequency: freq };
        dataMap[freq].healthyValue = healthy.values[i];
      });
    }

    if (current) {
      current.frequencies.forEach((freq, i) => {
        if (!dataMap[freq]) dataMap[freq] = { frequency: freq };
        dataMap[freq].currentValue = current.values[i];
      });
    }

    return Object.values(dataMap).sort((a, b) => a.frequency - b.frequency);
  };

  const xData = combineData(grouped.X?.healthy, grouped.X?.current);
  const yData = combineData(grouped.Y?.healthy, grouped.Y?.current);
  const zData = combineData(grouped.Z?.healthy, grouped.Z?.current);
  const magnitudeData = combineData(grouped.Magnitude?.healthy, grouped.Magnitude?.current);

  return (
    <div>
      <h1>Vibration Frequency Dashboard</h1>
      {measurements.length === 0 ? (
        <p>Loading measurements...</p>
      ) : (
        <>
          {/* X Axis */}
          <h2>X Axis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={xData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="healthyValue" stroke="#8884d8" name="Healthy State" dot={false} />
              <Line type="monotone" dataKey="currentValue" stroke="#82ca9d" name="Current State" dot={false} />
            </LineChart>
          </ResponsiveContainer>

          {/* Y Axis */}
          <h2>Y Axis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={yData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="healthyValue" stroke="#8884d8" name="Healthy State" dot={false} />
              <Line type="monotone" dataKey="currentValue" stroke="#82ca9d" name="Current State" dot={false} />
            </LineChart>
          </ResponsiveContainer>

          {/* Z Axis */}
          <h2>Z Axis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={zData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="healthyValue" stroke="#8884d8" name="Healthy State" dot={false} />
              <Line type="monotone" dataKey="currentValue" stroke="#82ca9d" name="Current State" dot={false} />
            </LineChart>
          </ResponsiveContainer>

          {/* Magnitude */}
          <h2>Overall Magnitude</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={magnitudeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="healthyValue" stroke="#8884d8" name="Healthy State" dot={false} />
              <Line type="monotone" dataKey="currentValue" stroke="#82ca9d" name="Current State" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};
