"use client"

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Box, Container, Typography, MenuItem, Select, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

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
        console.log(result);
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
    <Container sx={{ color: 'white', backgroundColor: 'black', padding: '20px', borderRadius: '10px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
        Energy Consumption Dashboard
      </Typography>
      <Select value={year} onChange={handleYearChange} sx={{ color: 'white', backgroundColor: 'black', mb: 2 }}>
        <MenuItem value="2023">2023</MenuItem>
        <MenuItem value="2024">2024</MenuItem>
      </Select>
      {currentPage === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>Total Consumption</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consumption" stroke="#8884d8" name="Total Consumption" />
              </LineChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Solar Capex (kWh)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="solar" stroke="#82ca9d" name="Total Solar" />
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Non-solar sources</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="otherSources" stroke="#ff7300" name="Other Sources" />
              </LineChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Savings</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="savings" stroke="#82ca9d" />
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Solar (kWh)</Typography>
              <AreaChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="solarPercentage" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Savings from Solar</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalSavings" stroke="#ff7300" />
              </LineChart>
            </Box>
          </Box>
        </>
      )}
      {currentPage === 2 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>HTC 179 and HTC 232</Typography>
              <BarChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Bar dataKey="htc179" fill="#8884d8" name="HTC 179" />
                <Bar dataKey="htc232" fill="#82ca9d" name="HTC 232" />
              </BarChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total GED</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalGED" stroke="#ff7300" />
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Solar Capex and Opex</Typography>
              <BarChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Bar dataKey="solarCapex" fill="#8884d8" name="Solar Capex" />
                <Bar dataKey="solarOpex" fill="#82ca9d" name="Solar Opex" />
              </BarChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>C2 kWh and Solar Percentage of C2</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="c2kWh" stroke="#ff7300" name="C2 kWh" />
                <Line type="monotone" dataKey="c2SolarPercentage" stroke="#82ca9d" name="Solar Percentage of C2" />
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Rs/kWh</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rsPerKWh" stroke="#ff7300" />
              </LineChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Savings from 1 MWp Solar and Capex</Typography>
              <BarChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Bar dataKey="savingsFrom1MWpSolar" fill="#8884d8" name="Savings from 1 MWp Solar" />
                <Bar dataKey="savingsFromCapex" fill="#82ca9d" name="Savings from Capex" />
              </BarChart>
            </Box>
          </Box>
        </>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="contained" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          Page 1
        </Button>
        <Button variant="contained" onClick={() => handlePageChange(2)} disabled={currentPage === 2} sx={{ ml: 2 }}>
          Page 2
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;