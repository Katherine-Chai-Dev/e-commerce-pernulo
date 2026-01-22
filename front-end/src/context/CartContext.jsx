import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useUser();

    const getCartKey = () => {
        return user ? `cart_${user.id}` : 'cart_guest';
    };


    useEffect(() => {
        const cartKey = getCartKey();
        const savedCart = localStorage.getItem(cartKey);
        
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    }, [user]);


    const saveCart = (cart) => {
        const cartKey = getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(cart));
    };

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        
        let updatedCart;
        if (existingItem) {
            updatedCart = cartItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cartItems, { ...product, quantity: 1 }];
        }
        
        setCartItems(updatedCart);
        saveCart(updatedCart);
    };

    const removeFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        saveCart(updatedCart);
    };

    const clearCart = () => {
        const cartKey = getCartKey();
        setCartItems([]);
        localStorage.removeItem(cartKey);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedCart = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        
        setCartItems(updatedCart);
        saveCart(updatedCart);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}