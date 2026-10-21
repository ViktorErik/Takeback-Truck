/*import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'*/
import truckIMG from "./assets/ikea_truck image.png"
import './App.css'
import MapComponent from "./components/MapComponent";

import Footer from "./components/footer";
import Header from "./components/header";
import FAQ from "./components/faq";
import Steps from "./components/stepGuide";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import InformationPage from "./pages/informationPage";
import BookingPage from "./pages/BookingPage"; 
import LoginPage from "./pages/LoginPage";
 

// CO2 comparison shown under the map: 10 people each driving to IKEA Kållered
// in an average car, versus one electric truck doing the same trip once for
// a mass pickup. Distance and emission factors are rough estimates.
const CO2_PEOPLE = 10;
const CO2_ROUND_TRIP_KM = 30; // ~15 km each way, random Gothenburg address <-> IKEA Kållered
const CO2_CAR_G_PER_KM = 170;
const CO2_TRUCK_G_PER_KM = 50;
const co2CarsKg = (CO2_PEOPLE * CO2_ROUND_TRIP_KM * CO2_CAR_G_PER_KM) / 1000;
const co2TruckKg = (CO2_ROUND_TRIP_KM * CO2_TRUCK_G_PER_KM) / 1000;
const co2SavedKg = co2CarsKg - co2TruckKg;

function App(){
  return(
    <div className="app">
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/informationPage" element={<InformationPage />}/>
      <Route path="/booking" element={<BookingPage />}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/" element={
        <>
          <section id="center">
            <div className="infoSection">
              <Steps/>
            </div>
          </section>
          <section id="sustainability-section">
            <div className="truckIMG-container">
              <img src={truckIMG} className="truckIMG" alt=""/>
            </div>
            <div className="sustainability-text-container">
              IKEA’s electric trucks offer a smarter, cleaner, and more sustainable way to transport products. Unlike traditional diesel trucks, electric trucks produce no exhaust emissions while driving, helping reduce air pollution and greenhouse gas emissions. They are also quieter, making deliveries more environmentally friendly for cities and communities.

Why choose electric trucks? Because the future of transport should be sustainable! By investing in electric vehicles, IKEA can reduce its environmental impact, support climate goals, and show customers that it cares about the planet. Electric trucks can also help lower running costs over time and, when powered by renewable electricity, make deliveries even greener.

Our project promotes a simple but powerful idea: better deliveries, less pollution, and a greener future. IKEA’s electric trucks prove that businesses don’t have to choose between delivering products efficiently and protecting the environment.
            </div>
          </section>
          <section id="map-section">
            <div className="map-text-container">
              <div className="map-text-header">
                <h2>Find your nearest IKEA pickup-station</h2>
              </div>
              <div className="map-text-body">
                <p>We have a wide range of pickup-stations across the country. Find the one closest to you and start your journey towards a more sustainable future.</p>
              </div>
            </div>
            <div className="map-container" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, minHeight: 0 }}>
                <MapComponent />
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#888' }}>
                A truck collecting {CO2_PEOPLE} packages in one mass pickup saves about {Math.round(co2SavedKg)} kg of CO₂ compared to {CO2_PEOPLE} individual car trips to IKEA Kållered.
              </p>
            </div>
          </section>

          <div className="bottompadding" style={{ height: '100px' }}></div>
          <div id="faq-container">
            <FAQ/>
          </div>
          
        </>
      }
    />
    </Routes>
    </BrowserRouter>
    <Footer/>
    </div>
  )
}

export default App
