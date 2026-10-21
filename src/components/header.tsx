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
                <a href="/#faq-container">FAQ</a>
                <a href="/booking">Book pickup</a>
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