import React, { useState } from "react";
import { httpService } from "../shared/service/service";

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartTsLoading, setIsLoading] = useState(false);
    const [cartIsError, setIsError] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState(null);

    const getCart = async () => {
        setIsLoading(true);
        try {
            const res = await httpService("GET", "get_cart");
            if (res?.data?.success) {
                setCart(res.data.data);
            } else {
                setIsError(true);
            }
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (productId, variant) => {
        setIsLoading(true);
        try {
            const res = await httpService(
                "GET",
                "add_to_cart",
                `product=${productId}&variant=${variant}`
            );
            if (res?.data?.success) {
                setCart(res.data.data);
            } else {
                setIsError(true);
            }
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
        // setCart(prevCart => [...prevCart, product]);
    };

    const removeFromCart = async productId => {
        setIsLoading(true);
        try {
            const res = await httpService(
                "GET",
                "remove_from_cart",
                `product=${productId}`
            );
            if (res?.data?.success) {
                setCart(res.data.data);
            } else {
                setIsError(true);
            }
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
        // setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        // Запрос на бек
        setCart([]); // Устанавливаем cart в пустой массив
    };

    const sendDeliveryDetails = async deliveryDetails => {
        setIsLoading(true);
        const response = await httpService("POST", "complete_order", '', {
            delivery_details: deliveryDetails,
        });

        if (response.status === 200) {
            setDeliveryInfo(response.data);
            setIsLoading(false);
        } else {
            setIsLoading(false);
            return null;
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                cartTsLoading,
                cartIsError,
                getCart,
                addToCart,
                removeFromCart,
                clearCart,
                sendDeliveryDetails,
                deliveryInfo,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
