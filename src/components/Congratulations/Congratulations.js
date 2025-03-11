import React from "react";
import "./Congratulations.css";

const Congratulations = () => {
    const handleClose = () => {
        window.location.href = process.env.REACT_APP_RETURN_BOT_LINK;
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
