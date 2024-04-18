import React, { useState } from "react";
import { httpServiceMock } from '../../shared/service/service';
import cartData from '../../mock_data/cart.json'

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartLoading, setLoading] = useState([]);
    const [deliveryInfo, setDeliveryInfo] = useState(null); // Добавляем состояние для информации о доставке

    const getCart = () => {
        const fetch = async () => {
            const data = await httpServiceMock(cartData);
            if (data.statusText === 'success') {
                setCart(cartData);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
        fetch();
    };

    const addToCart = product => {
        // запрос на бек
        setCart(prevCart => [...prevCart, product]);
    };

    const removeFromCart = productId => {
         // запрос на бек
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        // Запрос на бек
        setCart([]); // Устанавливаем cart в пустой массив
    };

    const sendDeliveryDetails = async (deliveryDetails) => {
        setLoading(true);
        const response = await httpServiceMock(deliveryDetails);
        if (response.statusText === 'success') {
            setDeliveryInfo(response.data);
            setLoading(false);
            return response.data;
        } else {
            setLoading(false);
            return null;
        }
    };

    return (
        <CartContext.Provider value={{ cart, cartLoading, getCart, addToCart, removeFromCart, clearCart, sendDeliveryDetails  }}>
            {children}
        </CartContext.Provider>
    );
};