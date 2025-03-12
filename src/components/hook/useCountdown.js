import { useState, useEffect, useRef } from "react";

const useCountdown = (initialCount, onComplete) => {
    const [count, setCount] = useState(initialCount);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timerRef.current);
                    onComplete && onComplete();
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [onComplete]);

    return count;
};

export default useCountdown;
