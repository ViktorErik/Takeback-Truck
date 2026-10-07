import "./header.css";

import logoIMG from "../assets/ikea_logo.png"
import { Link } from "react-router-dom";

function header(){
    return(
        <header className="header">
            <nav className="header_nav">
                <img src={logoIMG} className="logo" width="150" height="75" alt=""/>
                <Link to="/informationPage">Info</Link>
                <a href="/">FAQ</a>
                <a href="/">Book pickup</a>
            </nav>

            <button className="login">
                Hello! Log in
            </button>
        </header>
    );
}

export default header;