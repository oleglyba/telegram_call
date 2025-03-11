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

export default function useTelegramValidation() {
    const [isHashValid, setIsHashValid] = useState(false);

    useEffect(() => {
        if (!window.Telegram?.WebApp) {
            setIsHashValid(false);
            return;
        }
        window.Telegram.WebApp.ready();

        const initDataString = window.Telegram.WebApp.initData;
        if (!initDataString) {
            setIsHashValid(false);
            return;
        }

        const dataObj = Object.fromEntries(new URLSearchParams(initDataString));
        if (!dataObj.hash || typeof dataObj.hash !== "string") {
            setIsHashValid(false);
            return;
        }

        (async () => {
            const valid = await validateTelegramHashAsync(dataObj, BOT_TOKEN);
            setIsHashValid(valid);
        })();
    }, []);

    return { isHashValid };
}
