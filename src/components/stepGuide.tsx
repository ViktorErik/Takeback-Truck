const steps = [
    {
        number: 1,
        title: "Do you have old IKEA products that you no longer want or need?",
        text:"Follow the steps below!",
    },
    {
        number: 2,
        title: "Fill out our form to book a pickup",
        text:"",
    },
    {
        number: 3,
        title: "",
        text:"",
    },
    {
        number: 4,
        title: "",
        text:"",
    },
];

function Steps(){
    return(
    <section className="steps">
        <h2>Step by step guide</h2>

        <div className="stepList">
            {steps.map((step)=> (
                <div className="step" key={step.number}>
                    <div className="stepNumber">
                        {step.number}
                    </div>

                    <div className="stepContent">
                        <h3>{step.title}</h3>
                        <h3>{step.text}</h3>
                    </div>
                </div>
            ))} 
        </div>
    </section>
    );
}

export default Steps;

