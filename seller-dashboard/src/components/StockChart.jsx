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
      <CartesianGrid strokeDasharray="3 3" stroke="#fff" />
      <XAxis dataKey="name" stroke="#fff" tick={{ fill: '#fff' }} />
      <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
      <Tooltip contentStyle={{ background: '#2c0821', color: '#fff', border: '1px solid #FFB6D9' }} itemStyle={{ color: '#FFB6D9' }} labelStyle={{ color: '#FFE066' }} />
      <Legend wrapperStyle={{ color: '#fff' }} />
      <Line type="monotone" dataKey="pv" stroke="#FFB6D9" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="uv" stroke="#FFE066" />
    </LineChart>
  );
};

export default StockChart; 