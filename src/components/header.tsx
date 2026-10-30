import "./header.css";

import logoIMG from "../assets/ikea_logo.png"
import { Link, useNavigate } from "react-router-dom";

function header(){
    const navigate = useNavigate();

    const goToFaq = () => {
        setTimeout(() => {
            document.getElementById("faq-container")?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    };

    return(
        <header className="header">
            <nav className="header_nav">
                <Link to="/">
                    <img src={logoIMG} className="logo" width="150" height="75" alt=""/>
                </Link>
                <Link to="/" onClick={goToFaq}>FAQ</Link>
                <Link to="/booking">Book pickup</Link>
                <Link to="/informationPage">About us</Link>
            </nav>

            <button
            className="login"
            onClick={() => navigate("/login")}
            >
                Hello! Log in
            </button>
        </header>
    );
}

export default header;