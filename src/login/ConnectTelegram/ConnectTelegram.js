import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useBackendApi } from "../../components/api/axiosBackendApi";
import InputField from "../../components/InputField/InputField";
import "./ConnectTelegram.css";
import "../../style/common.css";
import useTelegramValidation from "../../components/hook/useTelegramValidation";
import useKeyboardStatus from "../../components/hook/useKeyboardStatus";

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
    const keyboardHeight = useKeyboardStatus();

    // Використовуємо ref для вимірювання висоти форми
    const formRef = useRef(null);
    const [formHeight, setFormHeight] = useState(0);

    // При монтуванні або при зміні keyboardHeight перевіряємо висоту форми
    useEffect(() => {
        if (formRef.current) {
            setFormHeight(formRef.current.offsetHeight);
        }
    }, [keyboardHeight]);

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
                    phone: phoneNumber.number.replace("+", ""),
                    username,
                },
            });
        } catch (error) {
            setErrorPhone(`Error: ${error.message}`);
            setPhoneColor("red");
            setHasError(true);
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

    // Обчислюємо зміщення для форми, якщо клавіатура відкрита (keyboardHeight > 10)
    let offset = 0;
    if (keyboardHeight > 10 && formHeight) {
        // Обчислюємо бажану позицію нижньої межі форми:
        const desiredBottom = window.innerHeight - keyboardHeight - 10;
        // Нижня межа форми при центрованому положенні:
        const currentBottom = window.innerHeight / 2 + formHeight / 2;
        offset = desiredBottom - currentBottom;
    }

    const transformStyle = { transform: `translateY(${offset}px)` };

    return (
        // Використовуємо ref для вимірювання висоти форми
        <div className="form-container" ref={formRef} style={transformStyle}>
            <div className="connect-telegram-card">
                <h2>Connect your Telegram</h2>
                <p>
                    To proceed, you have to connect your Telegram account via SMS
                    confirmation process.
                </p>
                <InputField
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={handlePhoneChange}
                    borderColor={phoneColor}
                    error={errorPhone}
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
            </div>
        </div>
    );
}

export default ConnectTelegram;
