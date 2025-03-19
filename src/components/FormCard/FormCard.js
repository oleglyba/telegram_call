import React, { useRef } from "react";
import useKeyboardStatus from "../../components/hook/useKeyboardStatus";
import {useCardOffset} from "../hook/useCardOffset";

const FormCard = ({ children, className, offsetPadding = 25 }) => {
    const cardRef = useRef(null);
    const keyboardHeight = useKeyboardStatus();
    const offset = useCardOffset(cardRef, keyboardHeight, offsetPadding);
    const cardStyle = {
        transform: `translateY(${offset}px)`,
        transition: "transform 0.3s ease-in-out",
    };

    return (
        <div ref={cardRef} className={className} style={cardStyle}>
            {children}
        </div>
    );
};

export default FormCard;
