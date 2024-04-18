import React, { useState } from "react";
import { httpServiceMock } from '../../shared/service/service';
import productsData from '../../mock_data/products.json'

export const CatalogContext = React.createContext();

export const CatalogProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [productsLoading, setLoading] = useState(true);
    const [productsError, setProductsError] = useState(false);

    const getProducts = () => {
        const fetch = async () => {
            try {
                const data = await httpServiceMock(productsData);
                if (data.statusText === 'success') {
                    setProducts(data.data);
                    setLoading(false);
                } else {
                    setLoading(true);
                    setProductsError(true)
                }
            } catch (error) {
                setLoading(false);
                setProductsError(true)
            }

        }
        fetch();
    };

    return (
        <CatalogContext.Provider value={{ products, getProducts, productsLoading, productsError }}>
            {children}
        </CatalogContext.Provider>
    );
};