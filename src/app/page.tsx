import { useEffect, useState } from 'react';

export default function Home() {
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the measurements API
    const fetchData = async () => {
      try {
        const res = await fetch('/api/measurements');
        if (!res.ok) {
          throw new Error('Error fetching data');
        }
        const data = await res.json();
        setMeasurements(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

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
          {measurements.map((measurement: any, index: number) => (
            <li key={index}>
              {/* Display the relevant measurement data */}
              {JSON.stringify(measurement)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
