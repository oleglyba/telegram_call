import { useEffect, useState } from "react";
import crypto from "crypto";

const BOT_TOKEN = process.env.REACT_APP_BOT_TOKEN;

function validateTelegramHash(initDataUnsafe) {
    const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
    const dataCheckString = Object.keys(initDataUnsafe)
        .filter((key) => key !== "hash")
        .sort()
        .map((key) => `${key}=${JSON.stringify(initDataUnsafe[key])}`)
        .join("\n");
    const hmac = crypto
        .createHmac("sha256", secretKey)
        .update(dataCheckString)
        .digest("hex");
    return hmac === initDataUnsafe.hash;
}

function validateTelegramData(initDataUnsafe) {
    if (!initDataUnsafe) {
        return false;
    }
    const user = initDataUnsafe.user;
    if (
        !user ||
        typeof user.id !== "number" ||
        !user.first_name ||
        (user.username && typeof user.username !== "string")
    ) {
        return false;
    }
    const authDate = parseInt(initDataUnsafe.auth_date, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(authDate) || authDate <= 0 || now - authDate > 600) {
        return false;
    }
    if (user.photo_url && !/^https?:\/\/t\.me\/i\/userpic/.test(user.photo_url)) {
        return false;
    }
    return validateTelegramHash(initDataUnsafe);

}

function parseTelegramData() {
    if (!window.Telegram?.WebApp) {
        return null;
    }
    const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
    if (!initDataUnsafe) {
        return null;
    }
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
        if (!window.Telegram?.WebApp) {
            setError("Telegram WebApp API not available.");
            return;
        }
        window.Telegram.WebApp.ready();
        const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
        if (validateTelegramData(initDataUnsafe)) {
            setValidatedData(parseTelegramData());
        } else {
            setError("Invalid Telegram data.");
        }
    }, []);

    return { validatedData, error };
}
