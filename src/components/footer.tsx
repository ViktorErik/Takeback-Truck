import "./footer.css";
import { Link } from "react-router-dom";

function footer(){
    return(
        <footer className="footer">
            <nav className="footer_nav">
                <Link to="/informationPage">Info</Link>
<Link
  to="/"
  onClick={() =>
    setTimeout(() => {
      document.getElementById("faq-container")?.scrollIntoView({ behavior: "smooth" });
    }, 50)
  }
>
  FAQ
</Link>
<Link to="/booking">Book pickup</Link>
            </nav>
            <p>2026 TakeBackTruck | All rights reserved</p>
        </footer>

    );
}

export default footer;