/*import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'*/
import homePageImg from "./assets/ikea_homepage image.png"
import descriptionIMG from "./assets/description image.png"
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
        <img src={homePageImg} className="baseIMG" width="500" height="300" alt=""/>
      </div>
    </section>
    <div className="bookButton">
        <button 
          type="button"
          className="formsButton">
            Book pickup here
          </button>
      </div>
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
/*
  <img src={descriptionIMG} className="descIMG" width="700" height="200" alt=""/>

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}*/

export default App
