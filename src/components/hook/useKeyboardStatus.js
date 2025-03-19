import { useState, useEffect } from "react";

export default function useKeyboardStatus() {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                const heightDifference = window.innerHeight - window.visualViewport.height;
                setKeyboardHeight(heightDifference > 0 ? heightDifference : 0);
            }
        };

        window.visualViewport?.addEventListener("resize", handleResize);
        handleResize();

        return () =>
            window.visualViewport?.removeEventListener("resize", handleResize);
    }, []);

    return keyboardHeight;
}
