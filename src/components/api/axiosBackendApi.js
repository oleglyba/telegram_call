import { useState, useCallback } from "react";

const BASE_URL = process.env.REACT_APP_API_URL;

export const useBackendApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiRequest = useCallback(
        async (endpoint, { data, headers, ...otherOptions } = {}) => {
            setLoading(true);
            setError(null);

            const fetchOptions = {
                ...otherOptions,
                headers: { "Content-Type": "application/json", ...headers },
                ...(data && { body: JSON.stringify(data) }),
            };

            try {
                const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
                const contentType = response.headers.get("Content-Type") || "";

                let json;
                if (contentType.includes("application/json")) {
                    json = await response.json();
                } else {
                    console.error("Невірний формат відповіді від сервера.");
                    throw new Error("Server error. Please try again later.");
                }

                if (!response.ok) {
                    throw new Error(json?.detail || json?.message || "Request failed");
                }

                return json;
            } catch (err) {
                if (err.message === "Failed to fetch") {
                    console.error("Мережева помилка: не вдалося виконати запит");
                    setError("Не вдалося підключитися до сервера. Будь ласка, спробуйте пізніше.");
                } else {
                    setError(err.message);
                }
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { apiRequest, loading, error };
};
