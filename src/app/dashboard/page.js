"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Box, Container, Typography, MenuItem, Select, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const [year, setYear] = useState('2023');
  const [month, setMonth] = useState('January');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getSheetsData');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const processData = (data) => {
    const filteredData = data.slice(4);

    const lineData = filteredData.filter(row => row[1] && row[1].includes(year)).map(row => ({
      date: row[1],
      consumption: parseFloat(row[7]),
      solar: parseFloat(row[5]),
      otherSources: parseFloat(row[7]) - parseFloat(row[5]),
      savings: parseFloat(row[15]),
      price: parseFloat(row[19]),
      solarPercentage: parseFloat(row[8]),
      totalSavings: parseFloat(row[14]),
      htc179: parseFloat(row[0]),
      htc232: parseFloat(row[2]),
      totalGED: parseFloat(row[3]),
      solarCapex: parseFloat(row[4]),
      solarOpex: parseFloat(row[6]),
      c2kWh: parseFloat(row[9]),
      c2SolarPercentage: parseFloat(row[10]),
      rsPerKWh: parseFloat(row[11]),
      savingsFrom1MWpSolar: parseFloat(row[12]),
      savingsFromCapex: parseFloat(row[13]),
      htc179Amount: parseFloat(row[16]),
      htc232Amount: parseFloat(row[17]),
      totalAmount: parseFloat(row[18])
    }));

    const pieData = lineData.filter(row => row.date.includes(month)).map(row => ({
      name: 'Solar',
      value: row.solar
    })).concat(lineData.filter(row => row.date.includes(month)).map(row => ({
      name: 'Other Sources',
      value: row.otherSources
    })));

    return { lineData, pieData };
  };

  const { lineData, pieData } = processData(data);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    signIn('google');
    return null;
  }

  const COLORS = ['#0088FE', '#FFBB28'];

  return (
    <Container sx={{
      color: 'white',
      backgroundColor: 'black',
      padding: '70px',
      borderRadius: '10px',
      minHeight: '100vh',
    }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '40px',
          padding: '20px',
          background: 'linear-gradient(45deg, #82ca9d, #0069ff)',
          borderRadius: '10px',
          transition: 'background 0.3s, color 0.3s',
          '&:hover': {
            background: 'linear-gradient(45deg,#75917f, #719fe1)',
            color: 'black',
            
          },
        }}
      >
        Energy Consumption Dashboard
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Select value={year} onChange={handleYearChange} sx={{ color: 'white', backgroundColor: 'black', marginRight: '20px' }}>
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
        </Select>

        <Select value={month} onChange={handleMonthChange} sx={{ color: 'white', backgroundColor: 'black' }}>
          <MenuItem value="January">January</MenuItem>
          <MenuItem value="February">February</MenuItem>
          <MenuItem value="March">March</MenuItem>
          {/* Add other months here */}
        </Select>
      </Box>

      {currentPage === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1', minWidth: '300px', marginBottom: '30px' }}>
              <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Total Consumption</Typography>
              <LineChart width={500} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consumption" stroke="#8884d8" name="Total Consumption" />
              </LineChart>
            </Box>

            <Box sx={{ flex: '1', minWidth: '300px', marginBottom: '30px' }}>
              <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Total Solar</Typography>
              <LineChart width={500} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="solar" stroke="#82ca9d" name="Total Solar" />
              </LineChart>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1', minWidth: '300px', marginBottom: '30px' }}>
              <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Other Sources</Typography>
              <LineChart width={500} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="otherSources" stroke="#ff7300" name="Other Sources" />
              </LineChart>
            </Box>

            <Box sx={{ flex: '1', minWidth: '300px', marginBottom: '30px' }}>
              <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Total Savings</Typography>
              <LineChart width={500} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="savings" stroke="#82ca9d" />
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1', minWidth: '300px', marginBottom: '30px' }}>
              <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Solar Percentage</Typography>
              <AreaChart width={500} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="solarPercentage" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </Box>
            <Box sx={{ flex: '1', minWidth: '300px', marginBottom: '30px' }}>
              <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>Total Savings from Solar</Typography>
              <LineChart width={500} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalSavings" stroke="#8884d8" />
              </LineChart>
            </Box>
          </Box>
        </>
      )}
    
    </Container>
  );
};

export default Dashboard;
