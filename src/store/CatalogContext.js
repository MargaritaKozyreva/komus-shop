import React, { useState, useEffect } from "react";
import { httpService } from '../shared/service/service';

export const CatalogContext = React.createContext();

export const CatalogProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await httpService("GET", "get_products");
      setProducts(response.data.data);
      setProductsError(false);
    } catch (error) {
      setProductsError(true);
    } finally {
      setLoading(false);
    }
  };

//   useEffect(() => {
//     getProducts();
//   }, []);

  return (
    <CatalogContext.Provider
      value={{ products, getProducts, productsLoading, productsError }}
    >
      {children}
    </CatalogContext.Provider>
  );
};
