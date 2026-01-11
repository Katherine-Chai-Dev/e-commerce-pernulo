import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    const getProducts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/products")

            const data = await response.json()
            setProducts(data)

        } catch (error) {
            console.log('Error fetching products:', error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProducts()
    }, [])


    return (
        <ProductContext.Provider value={{ products, setProducts, loading }}>
            {children}
        </ProductContext.Provider>
    );
}


export function useProducts() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider');
    }
    return context;
}