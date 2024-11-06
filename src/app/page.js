"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Typography, Button, Grid } from "@mui/material";
import CustomNavbar from "./components/CustomNavbar";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Home = () => {

  return (
    <div className="bg-[#04080F] min-h-screen text-[#FFFFFF]">
      <CustomNavbar />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-16">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                className="mb-4 text-[#507DBC] font-bold"
              >
                Welcome to WattWise
              </Typography>
              <Typography variant="h5" className="mb-6 text-[#B8DBD9]">
                Empowering BITS Goa to Save Energy and Build a Sustainable
                Future
              </Typography>
              <Link href="/dashboard">
                <Button
                  variant="contained"
                  className="bg-[#507DBC] hover:bg-[#3A5A8C] text-white px-6 py-3 rounded-full text-lg font-semibold transition duration-300"
                >
                  Explore Dashboard
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} md={6}>
              <Image
                src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e"
                alt="Sustainable Energy"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </Grid>
          </Grid>
        </section>

        <section className="mb-16">
          <Typography variant="h3" className="mb-8 text-center text-[#507DBC]">
            Why Save Energy?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Reduce Carbon Footprint",
                description:
                  "By saving energy, we can significantly reduce our carbon emissions and combat climate change.",
                image:
                  "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9",
              },
              {
                title: "Lower Energy Costs",
                description:
                  "Efficient energy use leads to reduced electricity bills, saving money for our institution.",
                image:
                  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
              },
              {
                title: "Build a Sustainable Campus",
                description:
                  "Energy conservation helps create a more sustainable and eco-friendly learning environment.",
                image:
                  "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a",
              },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <div className="bg-[#507DBC] bg-opacity-10 p-6 rounded-lg shadow-lg h-full flex flex-col items-center">
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg mb-4"
                    />
                  </div>
                  <Typography variant="h5" className="mb-2 text-[#B8DBD9]">
                    {item.title}
                  </Typography>
                  <Typography variant="body1" className="text-[#FFFFFF]">
                    {item.description}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </section>

        <section className="mb-16">
          <Typography variant="h3" className="mb-8 text-center text-[#507DBC]">
            How WattWise Helps
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
                alt="Energy Dashboard"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {[
                "Real-time Energy Monitoring",
                "Data-driven Insights",
                "Community Engagement",
              ].map((item, index) => (
                <div key={index} className="mb-4">
                  <Typography variant="h5" className="mb-2 text-[#B8DBD9]">
                    {item}
                  </Typography>
                  <Typography variant="body1" className="text-[#FFFFFF]">
                    WattWise provides comprehensive tools and analytics to help
                    BITS Goa monitor, analyze, and optimize energy consumption
                    across the campus.
                  </Typography>
                </div>
              ))}
            </Grid>
          </Grid>
        </section>

        <section>
          <div className="bg-[#507DBC] p-8 rounded-lg shadow-lg text-center">
            <Typography variant="h4" className="mb-4 text-[#FFFFFF]">
              Ready to Make a Difference?
            </Typography>
            <Typography variant="body1" className="mb-6 text-[#B8DBD9]">
              Join us in our mission to create a more sustainable BITS Goa.
              Every small action counts!
            </Typography>
            <Link href="/login">
              <Button
                variant="contained"
                className="bg-[#FFFFFF] text-[#04080F] hover:bg-[#B8DBD9] px-6 py-3 rounded-full text-lg font-semibold transition duration-300"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#04080F] text-[#FFFFFF] py-12 mt-16 border-t border-[#507DBC]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-4">
              <h6 className="text-2xl font-bold text-[#507DBC] mb-4">
                Contact Us
              </h6>
              <p className="flex items-center text-[#B8DBD9]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#507DBC]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                mkd@goa.bits-pilani.ac.in
              </p>
              <p className="flex items-center text-[#B8DBD9]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#507DBC]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +91 942 239 0888
              </p>
            </div>
            <div>
              <h6 className="text-2xl font-bold text-[#507DBC] mb-4">
                Quick Links
              </h6>
              <ul className="space-y-2">
                {["Dashboard", "Login", "About Us"].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={
                        item === "Dashboard"
                          ? "/dashboard"
                          : item === "Login"
                            ? "/login"
                            : "#"
                      }
                      className="text-[#B8DBD9] hover:text-[#FFFFFF] transition-colors duration-200 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* <div>
              <h6 className="text-2xl font-bold text-[#507DBC] mb-4">Stay Connected</h6>
              <p className="mb-4 text-[#B8DBD9]">Follow us on social media for the latest updates and energy-saving tips.</p>
              <div className="flex space-x-4">
                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                  <a key={index} href="#" className="text-[#B8DBD9] hover:text-[#FFFFFF] transition-colors duration-200">
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div> */}
          </div>
          <div className="border-t border-[#507DBC] mt-8 pt-8 text-center">
            <p className="text-[#B8DBD9]">
              © {new Date().getFullYear()} WattWise - BITS Goa. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
