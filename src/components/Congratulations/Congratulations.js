import React from "react";
import "./Congratulations.css";

const Congratulations = () => {
    const handleClose = () => {
        const returnUrl = process.env.REACT_APP_RETURN_BOT_LINK;
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openTelegramLink(returnUrl);
        } else {
            window.location.href = returnUrl;
        }
    };

    return (
        <div className="form-container">
            <div className="congrats-card">
                <h1>Congratulations</h1>
                <p>
                    You have successfully registered on our web app, now you can use all «Telegram» functions
                </p>
                <button className="close-btn" onClick={handleClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Congratulations;
