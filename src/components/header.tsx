import "./header.css";

import logoIMG from "../assets/ikea_logo.png"
import { Link, useNavigate } from "react-router-dom";

function header(){
    const navigate = useNavigate();

    return(
        <header className="header">
            <nav className="header_nav">
                <a href="/">
                    <img src={logoIMG} className="logo" width="150" height="75" alt=""/>
                </a>
                <Link to="/informationPage">Info</Link>
                <a href="/#faq-container">FAQ</a>
                <a href="/booking">Book pickup</a>
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