import { useState, useEffect } from "react";

export default function useKeyboardStatus() {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.visualViewport) {
                setIsKeyboardOpen(window.visualViewport.height < window.innerHeight * 0.75);
            }
        };

        window.visualViewport?.addEventListener("resize", handleResize);
        return () => window.visualViewport?.removeEventListener("resize", handleResize);
    }, []);

    return isKeyboardOpen;
}
