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

function App(){
  return(
    <>
    <Header/>
    <section id="center">
      <div className="infoSection">
        <Steps/>
      </div>
    </section>
      <div className="descriptionIMG">
        <img src={truckIMG} className="truckIMG" width="900" height="500" alt=""/>
      </div>

    <section id="map-section">
      <div className="map-text">
        <h2>Find your nearest IKEA pickup-station</h2>
        <p>We have a wide range of pickup-stations across the country. Find the one closest to you and start your journey towards a more sustainable future.</p>
      </div>
      <div className="map-container" style={{ width: '100%', height: '500px' }}>
        <MapComponent />
      </div>
    </section>
    <div className="bottompadding" style={{ height: '100px' }}></div>
      <FAQ/>
      <Footer/>
    </>
  )
}

export default App
