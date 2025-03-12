import React from "react";
import "./Congratulations.css";
import useCountdown from "../hook/useCountdown";

const Congratulations = () => {
    const handleClose = () => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.close();
        } else {
            window.close();
        }
    };

    const count = useCountdown(10, handleClose);

    return (
        <div className="form-container">
            <div className="congrats-card">
                <h1>Congratulations</h1>
                <p>
                    You have successfully registered on our web app, now you can use all «Telegram» functions
                </p>
                <button className="close-btn" onClick={handleClose}>
                    This page will be closed {count}
                </button>
            </div>
        </div>
    );
};

export default Congratulations;
