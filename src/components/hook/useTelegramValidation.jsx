import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN;


function validateTelegramHash() {
    if (!window?.Telegram?.WebApp || !window.Telegram.Utils) {
        return false;
    }

    const parsedData = window.Telegram.Utils.urlParseQueryString(
        window.Telegram.WebApp.initData
    );
    const hash = parsedData.hash;

    const dataKeys = Object.keys(parsedData)
        .filter((key) => key !== "hash")
        .sort();
    const dataCheckString = dataKeys
        .map((key) => `${key}=${parsedData[key]}`)
        .join("\n");

    const secretKey = CryptoJS.SHA256(BOT_TOKEN).toString();
    const computedHash = CryptoJS.HmacSHA256(
        dataCheckString,
        secretKey
    ).toString(CryptoJS.enc.Hex);

    return computedHash === hash;
}

function parseTelegramData() {
    if (!window?.Telegram?.WebApp) return null;
    const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
    if (!initDataUnsafe) return null;

    return {
        queryId: initDataUnsafe.query_id ?? null,
        user: initDataUnsafe.user
            ? {
                id: initDataUnsafe.user.id,
                firstName: initDataUnsafe.user.first_name,
                lastName: initDataUnsafe.user.last_name ?? "N/A",
                username: initDataUnsafe.user.username ?? "N/A",
                languageCode: initDataUnsafe.user.language_code ?? "N/A",
                isPremium: initDataUnsafe.user.is_premium ?? false,
                allowsWriteToPM: initDataUnsafe.user.allows_write_to_pm ?? false,
                photoUrl: initDataUnsafe.user.photo_url ?? "N/A",
            }
            : null,
        authDate: new Date(initDataUnsafe.auth_date * 1000).toLocaleString(),
        signature: initDataUnsafe.signature ?? null,
        hash: initDataUnsafe.hash ?? null,
        themeParams: window.Telegram.WebApp.themeParams ?? {},
        version: window.Telegram.WebApp.version ?? "Unknown",
        platform: window.Telegram.WebApp.platform ?? "Unknown",
        viewportHeight: window.Telegram.WebApp.viewportHeight ?? "Unknown",
        backgroundColor: window.Telegram.WebApp.backgroundColor ?? "Unknown",
    };
}

export default function useTelegramValidation() {
    const [validatedData, setValidatedData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!window?.Telegram?.WebApp) {
            setError("Telegram WebApp API not available.");
            return;
        }
        window.Telegram.WebApp.ready();

        const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
        if (!initDataUnsafe) {
            setError("No Telegram WebApp data found.");
            return;
        }

        const user = initDataUnsafe.user;
        if (!user) {
            setError("No user data found.");
            return;
        }
        if (typeof user.id !== "number") {
            setError("User ID is not a number.");
            return;
        }
        if (!user.first_name) {
            setError("User first name is missing.");
            return;
        }
        if (user.username && typeof user.username !== "string") {
            setError("User username is invalid.");
            return;
        }

        const authDate = parseInt(initDataUnsafe.auth_date, 10);
        const now = Math.floor(Date.now() / 1000);
        if (isNaN(authDate) || authDate <= 0) {
            setError("Invalid authentication date.");
            return;
        }
        if (now - authDate > 600) {
            setError("Authentication data is too old.");
            return;
        }
        if (user.photo_url && !/^https?:\/\/t\.me\/i\/userpic/.test(user.photo_url)) {
            setError("Invalid photo URL.");
            return;
        }

        if (!validateTelegramHash()) {
            setError("Invalid signature. Data might be tampered with.");
            return;
        }

        setValidatedData(parseTelegramData());
    }, []);

    return { validatedData, error };
}
