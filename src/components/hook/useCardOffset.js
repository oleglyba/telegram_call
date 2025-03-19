import { useState, useEffect } from "react";

export function useCardOffset(cardRef, keyboardHeight, desiredMargin = 25) {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        if (cardRef.current && keyboardHeight > desiredMargin) {
            const rect = cardRef.current.getBoundingClientRect();
            const currentBottom = rect.bottom;
            const desiredBottom = window.innerHeight - keyboardHeight - desiredMargin;
            setOffset(desiredBottom - currentBottom);
        } else {
            setOffset(0);
        }
    }, [cardRef, keyboardHeight, desiredMargin]);

    return offset;
}
