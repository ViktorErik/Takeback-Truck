import './informationPage.css'
import axel from "../assets/axellinkan.jpg"

function informationPage()
{
    return(
        <div className="info-text-container">
            <div className="info-text-header">
                <h1>About our project</h1>
            </div>
            <div className="info-text-body">
                <p>Takeback Truck is a service designed to help IKEA customers address the problem of having to return big furniture on your own.</p>
            </div>
            <div className ="info-text-body">
                <p>The primary users are people who can’t return the products themselves, who need an easier takeback system.</p>
            </div>
            <div className='info-text-header'>
                <h1>Backgorund and team</h1>
            </div>
            <div className='info-list-text-container'>
                <p> Hello, we are Team 17, and our concept is called takeback truck.</p>
                <p> Currently, IKEA offers a takeback service where you are able to assess your furniture, and if approved, are able to bring your product to the nearest warehouse to be sold back to IKEA, where it is then put in their circular store.</p>
                <p> Our solution improves this situation by applying return trucks that do mass pickups at a regular schedule, based on demand. This will contribute to actually selling items instead of throwing them away and, in turn, reduce the amount of cars with trailers on the streets.</p>
            </div>
            <div className='team-members-container'>
                <div className='team-member-card'>
                    <img className ="team-member-image" src={axel} alt="Axel" />
                    <h2>AXEL</h2>
                </div>
                <div className='team-member-card'>
                    <img className ="team-member-image" src={axel} alt="Axel" />
                    <h2>AXEL 2</h2>
                </div>
                <div className='team-member-card'>
                    <img className ="team-member-image" src={axel} alt="Axel" />
                    <h2>AXEL 3</h2>
                </div>

            </div>

    </div>

    );
}
export default informationPage;