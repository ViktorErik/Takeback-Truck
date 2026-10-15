import "./footer.css";

function footer(){
    return(
        <footer className="footer">
            <nav className="footer_nav">
                <a href="/informationPage">Info</a>
                <a href="/#faq-container">FAQ</a>
                <a href="/booking">Book pickup</a>
            </nav>
            <p>2026 TakeBackTruck | All rights reserved</p>
        </footer>

    );
}

export default footer;