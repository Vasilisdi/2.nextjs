'use client';

import { useEffect, useState } from 'react';

type Measurement = {
  id: number;
  value: number;
  timestamp: string;
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

  return (
    <div>
      <h1>Measurements</h1>
      {measurements.length === 0 ? (
        <p>No measurements found</p>
      ) : (
        <ul>
          {measurements.map((measurement, index) => (
            <li key={index}>
              {/* Display the measurement data */}
              ID: {measurement.id}, Value: {measurement.value}, Timestamp: {measurement.timestamp}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
