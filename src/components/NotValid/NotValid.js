import React from "react";
import "./NotValid.css";

function NotValid() {

    return (
        <div className="notValid-container">
            <h1>Invalid Telegram Data</h1>
            <p>The provided Telegram hash is not valid. Data might have been tampered with.</p>
        </div>
    );
}

export default NotValid;
