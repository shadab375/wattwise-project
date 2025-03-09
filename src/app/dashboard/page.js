"use client"

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Box, Container, Typography, MenuItem, Select, Button, Switch, FormControlLabel } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const [year, setYear] = useState('2023');
  const [month, setMonth] = useState('January');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictedData, setPredictedData] = useState([]);
  const [geminiInsights, setGeminiInsights] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getSheetsData');
        const result = await response.json();
        setData(result);
        
        const processedData = processData(result).lineData;
        if (processedData.length > 0) {
          analyzeDataWithGemini(processedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [year]); // Re-analyze when year changes

  const fetchPredictions = async (historicalData) => {
    const addRandomVariation = (value) => {
      const variation = (Math.random() * 2 - 1) * 0.01; // Random variation between -1% and +1%
      return value * (1 + variation);
    };

    const predictNextValues = (values, months = 6) => {
      if (values.length < 2) return [];
      
      // Get the last few months pattern to repeat
      const patternLength = Math.min(values.length, 12); // Use up to 12 months pattern
      const pattern = values.slice(-patternLength);
      
      const lastDate = new Date(historicalData[historicalData.length - 1].date);
      
      return Array.from({ length: months }, (_, i) => {
        const nextDate = new Date(lastDate);
        nextDate.setMonth(lastDate.getMonth() + i + 1);
        
        // Use pattern value with small random variation
        const patternValue = pattern[i % pattern.length];
        const predictedValue = addRandomVariation(patternValue);
        
        return {
          value: Math.max(0, predictedValue), // Ensure non-negative
          date: nextDate.toISOString().slice(0, 10)
        };
      });
    };

    const generatePredictions = (historicalData) => {
      const metrics = [
        'consumption', 'solar', 'otherSources', 'savings', 'solarPercentage', 
        'totalSavings', 'htc179', 'htc232', 'totalGED', 'solarCapex', 
        'solarOpex', 'c2kWh', 'c2SolarPercentage', 'rsPerKWh', 
        'savingsFrom1MWpSolar', 'savingsFromCapex', 'price',
        'htc179Amount', 'htc232Amount', 'totalAmount'
      ];

      // Get predictions for each metric
      const predictions = {};
      metrics.forEach(metric => {
        const values = historicalData.map(d => d[metric]).filter(v => !isNaN(v));
        predictions[metric] = predictNextValues(values, 6);
      });

      // Combine predictions into data points
      return predictions.consumption.map((_, index) => {
        const dataPoint = { date: predictions.consumption[index].date };
        metrics.forEach(metric => {
          dataPoint[metric] = predictions[metric][index]?.value ?? 0;
        });
        return dataPoint;
      });
    };

    const predictions = generatePredictions(historicalData);
    setPredictedData(predictions);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePredictionToggle = (event) => {
    setShowPredictions(event.target.checked);
    if (event.target.checked && lineData.length > 0) {
      fetchPredictions(lineData);
    }
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Select value={year} onChange={handleYearChange} sx={{ color: 'white', backgroundColor: 'black' }}>
          <MenuItem value="2023">2023</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
        </Select>
        <FormControlLabel
          control={
            <Switch
              checked={showPredictions}
              onChange={handlePredictionToggle}
              color="primary"
            />
          }
          label="Show Predictions"
          sx={{ color: 'white' }}
        />
      </Box>

      {currentPage === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Consumption (kWh)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consumption" stroke="#8884d8" name="Actual Consumption" />
                {showPredictions && predictedData.length > 0 && (
                  <Line 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="consumption" 
                    stroke="#ff4081" 
                    strokeDasharray="5 5" 
                    name="Predicted Consumption"
                  />
                )}
              </LineChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Solar Generation (kWh)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="solar" stroke="#82ca9d" name="Actual Solar" />
                {showPredictions && predictedData.length > 0 && (
                  <Line 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="solar" 
                    stroke="#ff4081" 
                    strokeDasharray="5 5" 
                    name="Predicted Solar"
                  />
                )}
              </LineChart>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Non-solar sources (kWh)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="otherSources" stroke="#ff7300" name="Other Sources" />
                {showPredictions && predictedData.length > 0 && (
                  <Line 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="otherSources" 
                    stroke="#ff4081" 
                    strokeDasharray="5 5" 
                    name="Predicted Other Sources"
                  />
                )}
              </LineChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Savings from Capex (Rs)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="savings" stroke="#82ca9d" name="Actual Savings" />
                {showPredictions && predictedData.length > 0 && (
                  <Line 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="savings" 
                    stroke="#ff4081" 
                    strokeDasharray="5 5" 
                    name="Predicted Savings"
                  />
                )}
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
                <Area type="monotone" dataKey="solarPercentage" stroke="#82ca9d" fill="#82ca9d" name="Actual Solar %" />
                {showPredictions && predictedData.length > 0 && (
                  <Area 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="solarPercentage" 
                    stroke="#ff4081" 
                    fill="#ff408133" 
                    strokeDasharray="5 5" 
                    name="Predicted Solar %"
                  />
                )}
              </AreaChart>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'white' }}>Total Savings from Solar (Rs)</Typography>
              <LineChart width={600} height={300} data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalSavings" stroke="#ff7300" name="Actual Savings" />
                {showPredictions && predictedData.length > 0 && (
                  <Line 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="totalSavings" 
                    stroke="#ff4081" 
                    strokeDasharray="5 5" 
                    name="Predicted Savings"
                  />
                )}
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
                <Bar dataKey="htc179" fill="#8884d8" name="HTC 179 Actual" />
                <Bar dataKey="htc232" fill="#82ca9d" name="HTC 232 Actual" />
                {showPredictions && predictedData.length > 0 && (
                  <>
                    <Bar dataKey="htc179" data={predictedData} fill="#ff4081" name="HTC 179 Predicted" fillOpacity={0.5} />
                    <Bar dataKey="htc232" data={predictedData} fill="#ff8cb1" name="HTC 232 Predicted" fillOpacity={0.5} />
                  </>
                )}
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
                <Line type="monotone" dataKey="totalGED" stroke="#ff7300" name="Actual GED" />
                {showPredictions && predictedData.length > 0 && (
                  <Line 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="totalGED" 
                    stroke="#ff4081" 
                    strokeDasharray="5 5" 
                    name="Predicted GED"
                  />
                )}
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
                <Bar dataKey="solarCapex" fill="#8884d8" name="Solar Capex Actual" />
                <Bar dataKey="solarOpex" fill="#82ca9d" name="Solar Opex Actual" />
                {showPredictions && predictedData.length > 0 && (
                  <>
                    <Bar dataKey="solarCapex" data={predictedData} fill="#ff4081" name="Solar Capex Predicted" fillOpacity={0.5} />
                    <Bar dataKey="solarOpex" data={predictedData} fill="#ff8cb1" name="Solar Opex Predicted" fillOpacity={0.5} />
                  </>
                )}
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
                <Line type="monotone" dataKey="c2kWh" stroke="#ff7300" name="C2 kWh Actual" />
                <Line type="monotone" dataKey="c2SolarPercentage" stroke="#82ca9d" name="Solar % Actual" />
                {showPredictions && predictedData.length > 0 && (
                  <>
                    <Line 
                      type="monotone" 
                      data={predictedData} 
                      dataKey="c2kWh" 
                      stroke="#ff4081" 
                      strokeDasharray="5 5" 
                      name="C2 kWh Predicted"
                    />
                    <Line 
                      type="monotone" 
                      data={predictedData} 
                      dataKey="c2SolarPercentage" 
                      stroke="#ff8cb1" 
                      strokeDasharray="5 5" 
                      name="Solar % Predicted"
                    />
                  </>
                )}
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
                <Line type="monotone" dataKey="rsPerKWh" stroke="#ff7300" name="Actual Rs/kWh" />
                {showPredictions && predictedData.length > 0 && (
                  <Line 
                    type="monotone" 
                    data={predictedData} 
                    dataKey="rsPerKWh" 
                    stroke="#ff4081" 
                    strokeDasharray="5 5" 
                    name="Predicted Rs/kWh"
                  />
                )}
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
                <Bar dataKey="savingsFrom1MWpSolar" fill="#8884d8" name="1 MWp Solar Actual" />
                <Bar dataKey="savingsFromCapex" fill="#82ca9d" name="Capex Actual" />
                {showPredictions && predictedData.length > 0 && (
                  <>
                    <Bar dataKey="savingsFrom1MWpSolar" data={predictedData} fill="#ff4081" name="1 MWp Solar Predicted" fillOpacity={0.5} />
                    <Bar dataKey="savingsFromCapex" data={predictedData} fill="#ff8cb1" name="Capex Predicted" fillOpacity={0.5} />
                  </>
                )}
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