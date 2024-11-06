"use client"

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Container, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Sample data
const rows = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  date: `2023-01-${String(index + 1).padStart(2, '0')}`,
  consumption: Math.floor(Math.random() * 200) + 100,
}));

const columns = [
  { field: 'date', headerName: 'Date', width: 150 },
  { field: 'consumption', headerName: 'Consumption (kWh)', width: 200 },
];

// Sample chart data
const chartData = [
  { name: 'Jan', consumption: 400 },
  { name: 'Feb', consumption: 300 },
  { name: 'Mar', consumption: 500 },
  { name: 'Apr', consumption: 450 },
  // ... more data
];

const pieData = [
  { name: 'Residential', value: 400 },
  { name: 'Commercial', value: 300 },
  { name: 'Industrial', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid rendering on the server
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Energy Consumption Dashboard
      </Typography>

      {/* Data Table */}
      <Box sx={{ height: 400, width: '100%', marginBottom: 4 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          sx={{
            '& .MuiDataGrid-root': {
              backgroundColor: '#000',
            },
            '& .MuiDataGrid-cell': {
              color: '#fff',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#fff',
              color: '#000',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              color: '#000',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#fff',
              color: '#000',
            },
            '& .MuiDataGrid-toolbarContainer': {
              backgroundColor: '#000',
              color: '#fff',
            },
          }}
        />
      </Box>

      {/* Line Chart */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Consumption Trend
        </Typography>
        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="consumption" stroke="#8884d8" />
        </LineChart>
      </Box>

      {/* Bar Chart */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Consumption Comparison
        </Typography>
        <BarChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="consumption" fill="#82ca9d" />
        </BarChart>
      </Box>

      {/* Pie Chart */}
      <Box display="flex" justifyContent="center" sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Consumption by Sector
        </Typography>
        <PieChart width={500} height={500}>
          <Pie
            data={pieData}
            cx="50%" // Center horizontally
            cy="50%" // Center vertically
            labelLine={false}
            outerRadius={150} // Increase size for better visibility
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            formatter={(value, entry, index) => (
              <span style={{ color: COLORS[index % COLORS.length] }}>{value}</span>
            )}
          />
        </PieChart>
      </Box>
    </Container>
  );
}

export default DashboardPage;