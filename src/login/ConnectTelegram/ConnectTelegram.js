import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useBackendApi } from "../../components/api/axiosBackendApi";
import InputField from "../../components/InputField/InputField";
import "./ConnectTelegram.css";
import "../../style/common.css";
import useTelegramValidation from "../../components/hook/useTelegramValidation";
import FormCard from "../../components/FormCard/FormCard";
import {useErrorMessage} from "../../components/hook/useErrorMessage";

function ConnectTelegram() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("+");
    const [errorPhone, setErrorPhone] = useState("");
    const [phoneColor, setPhoneColor] = useState("");
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const { apiRequest } = useBackendApi();
    const { isHashValid, isValidationComplete } = useTelegramValidation();
    const { getErrorMessage } = useErrorMessage();

    useEffect(() => {
        if (isValidationComplete && !isHashValid) {
            navigate("/notValid");
        }
    }, [isValidationComplete, isHashValid, navigate]);

    if (!isValidationComplete) {
        return null;
    }

    const handleSendCode = async (e) => {
        e.preventDefault();
        const phoneNumber = parsePhoneNumberFromString(phone);
        if (phone.trim() === "+") {
            setErrorPhone("Please enter your phone number.");
            setPhoneColor("red");
            setHasError(true);
            return;
        }
        if (
            !phoneNumber ||
            !phoneNumber.number ||
            (!phone.startsWith("+888") && !phoneNumber.isValid())
        ) {
            setErrorPhone("Please enter a valid phone number.");
            setPhoneColor("red");
            setHasError(true);
            return;
        }
        if (!termsAccepted) {
            setErrorPhone("You must accept the Terms and Conditions.");
            setPhoneColor("red");
            setHasError(true);
            return;
        }

        setErrorPhone("");
        setPhoneColor("green");
        setHasError(false);
        setIsLoading(true);
        try {
            const cleanedNumber = phoneNumber.number.replace("+", "");
            const url = `/session/get_code/${cleanedNumber}`;
            const response = await apiRequest(url, {
                method: "POST",
                data: { phone: phoneNumber.number },
            });
            const { username } = response;
            navigate("/confirm-telegram", {
                state: {
                    phone: cleanedNumber,
                    username,
                },
            });
        } catch (error) {
            const errorMsg = getErrorMessage(error);
            if (errorMsg === "Pending") {
                navigate("/confirm-telegram", {
                    state: { phone: phoneNumber.number.replace("+", "") },
                });
            } else {
                setErrorPhone(`Error: ${errorMsg}`);
                setPhoneColor("red");
                setHasError(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneChange = (e) => {
        let input = e.target.value;
        if (!input.startsWith("+")) {
            input = "+" + input.replace(/\+/g, "");
        }
        setPhone(input);
        setPhoneColor("");
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
        if (e.target.checked) {
            setErrorPhone("");
            setPhoneColor("");
        }
    };

    return (
        <div className="form-container">
            <FormCard className="connect-telegram-card">
                <h2>Connect your Telegram</h2>
                <p>
                    To proceed, you have to connect your Telegram account via SMS confirmation process.
                </p>
                <InputField
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={handlePhoneChange}
                    borderColor={phoneColor}
                />
                <div className="terms-container">
                    <label className="terms-label">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={handleTermsChange}
                        />
                        I agree to the Terms and Conditions
                    </label>
                </div>
                <button
                    className={`send-btn ${hasError ? "error-margin" : ""}`}
                    onClick={handleSendCode}
                    disabled={isLoading || !termsAccepted}
                >
                    {isLoading ? "Sending..." : "Send code"}
                </button>
                {errorPhone && <p className="error-text">{errorPhone}</p>}
            </FormCard>
        </div>
    );
}

export default ConnectTelegram;
