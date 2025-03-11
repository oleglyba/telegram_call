// useTelegramValidation.js
import { useEffect, useState } from "react";

const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN;

async function validateTelegramHashAsync(data, botToken) {
    const encoder = new TextEncoder();
    const checkString = Object.keys(data)
        .filter((key) => key !== "hash")
        .sort()
        .map((key) => `${key}=${data[key]}`)
        .join("\n");

    const baseKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode("WebAppData"),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const secretBuffer = await crypto.subtle.sign(
        "HMAC",
        baseKey,
        encoder.encode(botToken)
    );
    const secretKey = await crypto.subtle.importKey(
        "raw",
        secretBuffer,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        secretKey,
        encoder.encode(checkString)
    );
    const computedHash = [...new Uint8Array(signatureBuffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return data.hash === computedHash;
}

function parseTelegramData() {
    if (!window.Telegram?.WebApp) return null;
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
    const [isHashValid, setIsHashValid] = useState(false);

    useEffect(() => {
        if (!window.Telegram?.WebApp) {
            setError("Telegram WebApp API not available.");
            setIsHashValid(false);
            return;
        }
        window.Telegram.WebApp.ready();

        const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
        if (!initDataUnsafe) {
            setError("No Telegram WebApp data found.");
            setIsHashValid(false);
            return;
        }

        const user = initDataUnsafe.user;
        if (!user) {
            setError("No user data found.");
            setIsHashValid(false);
            return;
        }
        if (typeof user.id !== "number") {
            setError("User ID is not a number.");
            setIsHashValid(false);
            return;
        }
        if (!user.first_name) {
            setError("User first name is missing.");
            setIsHashValid(false);
            return;
        }
        if (user.username && typeof user.username !== "string") {
            setError("User username is invalid.");
            setIsHashValid(false);
            return;
        }
        const authDate = parseInt(initDataUnsafe.auth_date, 10);
        const now = Math.floor(Date.now() / 1000);
        if (isNaN(authDate) || authDate <= 0) {
            setError("Invalid authentication date.");
            setIsHashValid(false);
            return;
        }
        if (now - authDate > 600) {
            setError("Authentication data is too old.");
            setIsHashValid(false);
            return;
        }
        if (user.photo_url && !/^https?:\/\/t\.me\/i\/userpic/.test(user.photo_url)) {
            setError("Invalid photo URL.");
            setIsHashValid(false);
            return;
        }
        if (!initDataUnsafe.hash || typeof initDataUnsafe.hash !== "string") {
            setError("Missing or invalid hash.");
            setIsHashValid(false);
            return;
        }

        const initDataString = window.Telegram.WebApp.initData;
        const dataObj = Object.fromEntries(new URLSearchParams(initDataString));

        (async () => {
            const isValid = await validateTelegramHashAsync(dataObj, BOT_TOKEN);
            if (!isValid) {
                setError("Invalid signature. Data might be tampered with.");
                setIsHashValid(false);
                return;
            }
            setIsHashValid(true);
            setValidatedData(parseTelegramData());
        })();
    }, []);

    return { validatedData, error, isHashValid };
}
