import { useCallback } from "react";

export const useErrorMessage = () => {
    const getErrorMessage = useCallback((error) => {
        return error.response?.data?.detail || error.message;
    }, []);

    return { getErrorMessage };
};
