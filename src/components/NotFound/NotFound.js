import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <button className="home-btn" onClick={() => navigate("/")}>
                Go Home
            </button>
        </div>
    );
}

export default NotFound;
