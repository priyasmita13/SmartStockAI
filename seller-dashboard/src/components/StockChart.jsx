"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StockChart = () => {
  const data = [
    { name: 'Page A', uv: 400, pv: 240, amt: 240 },
    { name: 'Page B', uv: 300, pv: 139, amt: 221 },
    { name: 'Page C', uv: 200, pv: 980, amt: 229 },
    { name: 'Page D', uv: 278, pv: 390, amt: 200 },
    { name: 'Page E', uv: 189, pv: 480, amt: 218 },
    { name: 'Page F', uv: 239, pv: 380, amt: 250 },
    { name: 'Page G', uv: 349, pv: 430, amt: 210 },
  ];

  return (
    <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
  );
};

export default StockChart; 