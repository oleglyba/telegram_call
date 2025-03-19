import { useState, useEffect } from "react";

export function useElementHeight(ref, deps = []) {
    const [height, setHeight] = useState(0);

    const serializedDeps = JSON.stringify(deps);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.offsetHeight);
        }
    }, [ref, serializedDeps]);

    return height;
}
