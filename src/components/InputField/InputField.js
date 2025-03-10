import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './InputField.css';

const InputField = ({
                        type,
                        placeholder,
                        value,
                        onChange,
                        showPassword,
                        togglePasswordVisibility,
                        error,
                        errorGmail,
                        borderColor,
                    }) => {
    return (
        <div className="input-wrapper">
            <input
                type={type}
                placeholder={placeholder}
                style={{ borderColor }}
                value={value}
                onChange={onChange}
            />
            {showPassword !== undefined && (
                <button
                    type="button"
                    className={`toggle-button ${showPassword ? 'active' : ''}`}
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
            )}
            {error && <p className="error">{error}</p>}
            {errorGmail && <p className="error">{errorGmail}</p>}
        </div>
    );
};

export default InputField;
