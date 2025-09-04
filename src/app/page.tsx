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

  // Find the measurements for each coordinate
  const xAxisMeasurement = measurements.find(m => m.coordinate === 'X');
  const yAxisMeasurement = measurements.find(m => m.coordinate === 'Y');
  const zAxisMeasurement = measurements.find(m => m.coordinate === 'Z');
  const magnitudeMeasurement = measurements.find(m => m.coordinate === 'Magnitude');

  // Function to combine all data into one dataset
  const combineData = () => {
    // If any measurement is missing, return empty array
    if (!xAxisMeasurement || !yAxisMeasurement || !zAxisMeasurement || !magnitudeMeasurement) return [];

    // We use the X measurement's frequency array as the source of truth for the X-axis.
    return xAxisMeasurement.frequencies.map((frequency, index) => ({
      frequency: frequency, // X-axis value (in Hz)
      x: xAxisMeasurement.values[index], // Y-axis value for X coordinate
      y: yAxisMeasurement.values[index], // Y-axis value for Y coordinate
      z: zAxisMeasurement.values[index], // Y-axis value for Z coordinate
      magnitude: magnitudeMeasurement.values[index], // Y-axis value for Magnitude <-- FIXED SPELLING
    }));
  };


  return (
    <div>
      <h1>Vibration Frequency Dashboard</h1>
      {measurements.length === 0 ? (
        <p>Loading measurements...</p>
      ) : chartData.length === 0 ? ( // Check if combineData returned nothing
        <p>Incomplete data found. Waiting for all measurements (X, Y, Z, Magnitude)...</p>
      ) : (
        <>
          {/* Chart for X, Y, Z axis data */}
          <h2>Individual Axes</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={combineData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="x" stroke="#8884d8" name="X Axis" dot={false} />
              <Line type="monotone" dataKey="y" stroke="#82ca9d" name="Y Axis" dot={false} />
              <Line type="monotone" dataKey="z" stroke="#ff7300" name="Z Axis" dot={false} />
            </LineChart>
          </ResponsiveContainer>

          {/* Chart for Magnitude data */}
          <h2>Overall Magnitude</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={combineData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="frequency" label={{ value: 'Frequency (Hz)', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              {/* FIXED TYPO: changed 'magnitute' to 'magnitude' */}
              <Line type="monotone" dataKey="magnitude" stroke="#0000FF" name="Magnitude" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}