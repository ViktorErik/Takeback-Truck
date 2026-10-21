import './informationPage.css'
import axel from "../assets/axellinkan.jpg"
import alva from "../assets/alvalinkan.png"
import anton from "../assets/antonlinkan.jpg"
import viktor from "../assets/viktorlinkan.png"
import hannes from "../assets/torkellinkan.png"
import oof from "../assets/Frame 1.png"

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
            <div className='info-container'>
                <div className='info-text-header'>
                    <h1>Backgorund and team</h1>
                </div>
                <div className='info-list-text-container'>
                    <p> Hello, we are Team 17, and our concept is called takeback truck.</p>
                    <p> Currently, IKEA offers a takeback service where you are able to assess your furniture, and if approved, are able to bring your product to the nearest warehouse to be sold back to IKEA, where it is then put in their circular store.</p>
                    <p> Our solution improves this situation by applying return trucks that do mass pickups at a regular schedule, based on demand. This will contribute to actually selling items instead of throwing them away and, in turn, reduce the amount of cars with trailers on the streets.</p>
                </div>
            </div>
            
            <div className='oof-container'>
                <h1>Order of Effects</h1>
                <img className='oof-pic' src={oof} alt="Order of Effects" />
            </div>
            <div className='team-members-container'>
                <h1>The team</h1>
                <div className='team-members-card-container'>
                    <div className='team-member-card'>
                        <img className ="team-member-image" src={axel} alt="Axel" />
                        <h2>Axel Löfstedt</h2>
                    </div>
                    <div className='team-member-card'>
                        <img className ="team-member-image" src={alva} alt="Alva" />
                        <h2>Alva Frödin</h2>
                    </div>
                    <div className='team-member-card'>
                        <img className ="team-member-image" src={anton} alt="Anton" />
                        <h2>Anton Thörnwall</h2>
                    </div>
                    <div className='team-member-card'>
                        <img className ="team-member-image" src={viktor} alt="Viktor" />
                        <h2>Viktor Modén</h2>
                    </div>
                    <div className='team-member-card'>
                        <img className ="team-member-image" src={axel} alt="Mikael" />
                        <h2>Mikael Rutgersson</h2>
                    </div>
                    <div className='team-member-card'>
                        <img className ="team-member-image" src={hannes} alt="Hannes" />
                        <h2>Hannes Abel</h2>
                    </div>
                </div>
                

            </div>

    </div>

    );
}
export default informationPage;