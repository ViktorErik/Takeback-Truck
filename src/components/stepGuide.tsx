import { Link } from "react-router-dom";
import homePageImg from "../assets/ikea_homepage image.png";
import "./stepGuide.css";

const steps = [
  {
    number: 1,
    title: "Fill in our form",
    description: "with your personal details.",
  },
  {
    number: 2,
    title: "Book a time",
    description: "for IKEA pickup or leave your items at a pickup station.",
  },
  {
    number: 3,
    title: "Answer questions",
    description: "about the condition of your products.",
  },
  
  {
    number: 4,
    title: "Get IKEA credits",
    description: "when your items are sold!",
  },
];

function Steps() {
  return (
    <section className="steps">
      <div className="title">
        <h1>Give your IKEA products a new life!</h1>
      </div>

      <div className="stepsHero">
        <div className="stepsContainer">
          <div className="stepsTitle">
            <h2>How it works</h2>
          </div>

          <div className="stepList">
            {steps.map((step) => (
              <div className="step" key={step.number}>
                {/* Cirkel med siffra */}
                <div className="stepCircle">{step.number}</div>

                {/* Textinnehåll */}
                <div className="stepContent">
                  <p>
                    <strong>{step.title}</strong> {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="button">
            <Link to="/booking" className="bookButton">
              Book a pickup
            </Link>
          </div>
        </div>

        <div className="stepsImageContainer">
          <div className="stepsImage">
            <img src={homePageImg} alt="IKEA pickup" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Steps;