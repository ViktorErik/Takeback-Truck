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
        <h2>Do you have old IKEA products that you no longer want or need?</h2>
        <h2> Follow the steps below!</h2>

        <div className="stepList">
            {steps.map((step)=> (
                <div className="step" key={step.number}>
                    <div className="stepContent">
                        <h3>{step.text}</h3>
                    </div>
                </div>
            ))} 
        </div>
    </section>
    );
}

export default Steps;