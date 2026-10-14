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
 

function App(){
  return(
    <div className="app">
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/informationPage" element={<InformationPage />}/>
      <Route path="/booking" element={<BookingPage />}/>
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
              HEJEHEHE
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
            <div className="map-container">
              <MapComponent />
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
