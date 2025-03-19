import { useState, useEffect } from "react";
import { useElementHeight } from "./useElementHeight"; // імпортуємо попередній хук

export function useCardOffset(cardRef, keyboardHeight, desiredMargin = 25) {
    const cardHeight = useElementHeight(cardRef, [keyboardHeight]);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        if (cardHeight && keyboardHeight > desiredMargin) {
            const desiredBottom = window.innerHeight - keyboardHeight - desiredMargin;
            const currentBottom = window.innerHeight / 2 + cardHeight / 2;
            setOffset(desiredBottom - currentBottom);
        } else {
            setOffset(0);
        }
    }, [cardHeight, keyboardHeight, desiredMargin]);

    return offset;
}
