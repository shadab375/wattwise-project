"use client";

import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Typography, Button, Alert } from "@mui/material";
import { FaLightbulb, FaSolarPanel, FaLeaf, FaChartLine } from "react-icons/fa";

const Login = () => {
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState(false);

  const handleLoginSuccess = (response) => {
    const token = response.credential;
    const decoded = jwtDecode(token);
    const email = decoded.email;
    const organization = email.split("@")[1];

    if (organization === "goa.bits-pilani.ac.in") {
      localStorage.setItem("token", token);
      router.push("/");
    } else {
      setAccessDenied(true);
    }
  };

  const handleLoginFailure = (error) => {
    console.log("Login Failed:", error);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#04080F]">
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#507DBC] rounded-full mb-6">
              <FaLightbulb className="text-[#FFFFFF] text-4xl" />
            </div>
            <Typography variant="h2" className="text-[#507DBC] font-bold mb-2">
              WattWise
            </Typography>
            <Typography variant="h5" className="text-[#B8DBD9]">
              Empowering BITS Goa&apos;s Sustainable Future
            </Typography>
          </div>

          {accessDenied && (
            <Alert
              severity="error"
              className="mb-6 bg-red-500 bg-opacity-90 text-white w-full"
            >
              Access Denied. Only BITS Goa email accounts are allowed.
            </Alert>
          )}

          <div className="w-full max-w-xs translate-x-16">
            <GoogleLogin
              clientId="752300815973-ptjap2259e5m868hggcan5j9plgvbk50.apps.googleusercontent.com"
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              useOneTap
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  variant="contained"
                  fullWidth
                  className="bg-[#507DBC] hover:bg-[#3A5A8C] text-[#FFFFFF] py-4 rounded-full text-lg font-semibold transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Login with Google
                </Button>
              )}
            />
          </div>

          <Typography
            variant="body2"
            className="mt-6 text-[#B8DBD9] text-center"
          >
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </div>
      </div>

      <div className="flex-1 bg-[#04080F] flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="text-center max-w-lg">
          <div className="flex justify-center space-x-12 mb-12">
            <FaSolarPanel className="text-[#507DBC] text-7xl" />
            <FaLeaf className="text-[#B8DBD9] text-7xl" />
            <FaChartLine className="text-[#507DBC] text-7xl" />
          </div>
          <Typography variant="h3" className="text-[#FFFFFF] font-bold mb-6">
            Monitor. Analyze. Optimize.
          </Typography>
          <Typography variant="h6" className="text-[#B8DBD9] mb-8">
            Join us in our mission to create a more sustainable BITS Goa.
            Together, we can make a difference in energy consumption and
            environmental impact.
          </Typography>
          <div className="grid grid-cols-3 gap-6">
            {["Reduce Energy", "Save Costs", "Go Green"].map((item, index) => (
              <div
                key={index}
                className="bg-[#507DBC] bg-opacity-20 p-4 rounded-lg"
              >
                <Typography
                  variant="body1"
                  className="text-[#B8DBD9] font-semibold"
                >
                  {item}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
