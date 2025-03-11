import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ConnectTelegram from "./login/ConnectTelegram/ConnectTelegram";
import ConfirmTelegram from "./login/ConfirmTelegram/ConfirmTelegram";
import Password from "./login/Password/Password";
import Congratulations from "./components/Congratulations/Congratulations";
import NotFound from "./components/NotFound/NotFound";
import NotValid from "./components/NotValid/NotValid";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/connect-telegram" />} />
                <Route path="/connect-telegram" element={<ConnectTelegram />} />
                <Route path="/confirm-telegram" element={<ConfirmTelegram />} />
                <Route path="/password" element={<Password />} />
                <Route path="/congratulations" element={<Congratulations />} />
                <Route path="/notValid" element={<NotValid />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
