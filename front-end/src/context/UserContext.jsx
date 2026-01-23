import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const validateUser = async () => {
            const savedUser = localStorage.getItem('user');

            if (savedUser) {
                try {
                    const userData = JSON.parse(savedUser);
                    const response = await fetch(`/api/users/${userData.id}`);

                    if (response.ok) {
                        setUser(userData);
                    } else {
                        localStorage.removeItem('user');
                        localStorage.removeItem(`cart_${userData.id}`);
                        setUser(null);
                    }
                } catch (e) {
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }

            setLoading(false);
        };

        validateUser();
    }, []);

    const login = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
    };

    const logout = (callback) => {
        setLoggingOut(true);

        if (callback) callback();

        setTimeout(() => {
            setUser(null);
            localStorage.removeItem('user');
            setLoggingOut(false);
        }, 100);
    };

    return (
        <UserContext.Provider value={{ user, loading, loggingOut, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}