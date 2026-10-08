import homePageImg from "../assets/ikea_homepage image.png"
import "./stepGuide.css";

const steps = [
    {
        number: 1,
        text:"1: Fill in our form with your personal details",
    },
    {
        number: 2,
        text:"2: Answer questions about the condition of your products",
    },
    {
        number: 3,
        text:"3: Book a time for an IKEA pickup",
    },
    {
        number: 4,
        text:"4: Get IKEA credits when your items are sold!",
    },
];

function Steps(){
    return(
    <section className="steps">
        <div className="stepsHero">
            <div className="title">
                <h1>Give your IKEA products a new life!</h1>
            </div>
            <div className="stepsContainer">
                <div className="stepsTitle">
                    <h2>How it works</h2>
                </div>
                <div className="stepList">
                    {steps.map((step)=> (
                    <div className="step" key={step.number}>
                        <div className="stepContent">
                            <h3>{step.text}</h3>
                        </div>
                    </div>
                    ))} 
                </div>
                            
                <div className="button">
                    <a href="/book-pickpup" className="bookButton">Book a pickup</a>
                </div>
            </div>
            <div className="stepsImageContainer">
                <div className="stepsImage">
                    <img src={homePageImg} alt="IKEA pickup"/>
                </div>
            </div>
        </div>
    </section>
    );
}

export default Steps;