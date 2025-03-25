'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Measurement = {
  id: string;
  startMeasurement: string;
  endMeasurement: string;
  coordinate: string;
  values: number[];
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

  // Function to transform measurements data for plotting
  const transformData = (measurement: Measurement) => {
    const start = new Date(measurement.startMeasurement);
    const end = new Date(measurement.endMeasurement);
    const duration = end.getTime() - start.getTime(); // duration in milliseconds
    const timeStep = duration / measurement.values.length; // divide the duration by the number of values

    return measurement.values.map((value, index) => ({
      time: new Date(start.getTime() + timeStep * index),
      value,
    }));
  };

  // Find the measurements for each coordinate
  const xAxisMeasurement = measurements.find(m => m.coordinate === 'X');
  const yAxisMeasurement = measurements.find(m => m.coordinate === 'Y');
  const zAxisMeasurement = measurements.find(m => m.coordinate === 'Z');
  const magnitudeMeasurement = measurements.find(m => m.coordinate === 'Magnitude');

  // Combine the data for all coordinates, aligning by time
  const combineData = () => {
    if (!xAxisMeasurement || !yAxisMeasurement || !zAxisMeasurement) return [];

    const xData = transformData(xAxisMeasurement);
    const yData = transformData(yAxisMeasurement);
    const zData = transformData(zAxisMeasurement);

    const combinedData = xData.map((xItem, index) => {
      const yItem = yData[index];
      const zItem = zData[index];
      return {
        time: xItem.time,
        x: xItem.value,
        y: yItem.value,
        z: zItem.value,
      };
    });

    return combinedData;
  };

  return (
    <div>
      <h1>Measurements</h1>
      {measurements.length === 0 ? (
        <p>No measurements found</p>
      ) : (
        <>
          {/* Chart for X, Y, Z axis data */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={combineData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="x" stroke="#8884d8" name="X Axis" />
              <Line type="monotone" dataKey="y" stroke="#82ca9d" name="Y Axis" />
              <Line type="monotone" dataKey="z" stroke="#ff7300" name="Z Axis" />
            </LineChart>
          </ResponsiveContainer>

          {/* Chart for Magnitude data */}
          {magnitudeMeasurement && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={transformData(magnitudeMeasurement)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#0000FF" name="Magnitude" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
}
