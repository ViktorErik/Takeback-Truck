import "./LoginPage.css"



function LoginPage ()
{
    return <div className="login-page">

        <div className="left-section">
            <button 
            className="back-arrow" 
            aria-label="Go Back"
            onClick={() => window.history.back()}
            >
                ←
            </button>

            <p className="left-section-text">
                Log in with your TakeBackTruck account
            </p>

        </div>

        <div className="right-section">
            <p className="right-section-text">
                
                </p>

                <label className="right-section-label" htmlFor="email">
                    E-post
                </label>

                <input
                className="right-section-input"
                type="email"
                id="email"
                placeholder="axellöv@gmail.com">     
                </input>

                <label className="right-section-label" htmlFor="password">
                    Password
                </label>

                <input
                className="right-section-input"
                type="password"
                id="password"
                placeholder="axelovich123">
                </input>

                <button className="login-button">
                    Login 
                </button>

        </div>
        
    </div>
}

export default LoginPage;