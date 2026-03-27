import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import './PieChartComponent.css';

/**
 * Pie Chart Component
 * Displays market composition data for courses
 */
const PieChartComponent = ({ data, title, legend = true, colors = [] }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="pie-chart-container">
        <CardHeader>
          <CardTitle>{title || 'Market Composition'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="no-data">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Default color palette for pie charts
  const DEFAULT_COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c',
    '#8dd1e1', '#d084d0', '#82d982', '#ffa07a',
    '#20b2aa', '#ff6b6b', '#4ecdc4', '#45b7d1'
  ];

  const chartColors = colors.length > 0 ? colors : DEFAULT_COLORS;

  return (
    <Card className="pie-chart-container">
      <CardHeader>
        <CardTitle>{title || 'Market Composition'}</CardTitle>
      </CardHeader>
      <CardContent className="pie-chart-content">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            {legend && <Legend />}
            <Tooltip 
              formatter={(value) => `${value.toFixed(1)}%`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pie-chart-stats">
          {data.map((item, index) => (
            <div key={index} className="stat-item">
              <span 
                className="stat-color" 
                style={{ backgroundColor: chartColors[index % chartColors.length] }}
              ></span>
              <span className="stat-label">{item.name}</span>
              <span className="stat-value">{item.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Custom label renderer for pie chart
 */
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null; // Don't show label if less than 5%

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default PieChartComponent;
