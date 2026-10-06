import "./header.css";

import logoIMG from "../assets/ikea_logo.png"

function header(){
    return(
        <header className="header">
            <nav className="header_nav">
                <img src={logoIMG} className="logo" width="150" height="75" alt=""/>
                <a href="/">Info</a>
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