import { createContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AUTH_TOKEN_KEY = "auth_token";

function safeDecode(token) {
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
}

function isExpired(decoded) {
    if (!decoded?.exp) return false;
    return decoded.exp * 1000 < Date.now();
}

function AuthContextProvider({ children }) {
    const [authToken, setAuthToken] = useState(null);
    const [session, setSession] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    function clearSession() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthToken(null);
        setSession(null);
        setIsLogged(false);
    }

    function loadSessionFromStorage() {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) return clearSession();

        const decoded = safeDecode(token);
        if (!decoded) return clearSession();
        if (isExpired(decoded)) return clearSession();

        setAuthToken(token);
        setSession(decoded);
        setIsLogged(true);
    }

    useEffect(() => {
        loadSessionFromStorage();

        function onStorage(e) {
            if (e.key === AUTH_TOKEN_KEY) loadSessionFromStorage();
        }
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    function saveSession(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        loadSessionFromStorage();
    }

    const providerValues = useMemo(
        () => ({
            saveSession,
            clearSession,
            session,
            isLogged,
            authToken,
        }),
        [session, isLogged, authToken]
    );

    return (
        <AuthContext.Provider value={providerValues}>
        {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider