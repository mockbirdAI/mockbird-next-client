'use client'

import { PaymentStatus } from '@prisma/client';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Define the type for months explicitly
type MonthKey = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

const Overview = ({ payments }: { payments: Array<{ amount: number, status: PaymentStatus, createdAt: Date }> }) => {
  const monthlyTotals: Record<MonthKey, number> = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
  };

  payments.forEach(payment => {
    if (payment.status === 'COMPLETED') {
      const month = new Date(payment.createdAt).getMonth();
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(payment.createdAt)) as MonthKey;
      monthlyTotals[monthName] += payment.amount / 100;
    }
  });

  // Convert the totals object into an array for the chart
  const data = Object.keys(monthlyTotals).map(key => ({
    name: key,
    total: monthlyTotals[key as MonthKey]
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
