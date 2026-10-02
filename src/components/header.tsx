import "./header.css";

function header(){
    return(
        <header className="header">
            <a className="header_logo" href="/">
                TakeBackTruck
            </a>

            <nav className="header_nav">
                <a href="/">Info</a>
                <a href="/">FAQ</a>
                <a href="/">Book pickup</a>
            </nav>

            <button className="login">
                Login
            </button>
        </header>
    );
}

export default header;