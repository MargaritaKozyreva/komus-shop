import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Импорт хука useNavigate
import { CartContext } from "../../store/CartContext";
import CartItem from '../../shared/ui/Cart/CartItem';
import { Button } from '../../shared/ui/Button';
import { InfoMessage } from '../../shared/InfoMessage';
import { Layout } from '../../shared/layout';
import './style.css';

const CartPage = () => {
    const { cart } = useContext(CartContext);

    const navigate = useNavigate(); // Использование хука

    const handleCheckout = () => {
        navigate('/komus-merch-shop/delivery'); // Перенаправление на страницу доставки
    };

    return (
        <Layout>
            <div className="cart-page">
                <h3>Корзина</h3>
                {cart?.length > 1 && <InfoMessage />}
                <div className="cart-items">
                    {cart?.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>
                {cart?.length === 0 && <p>В вашей корзине ничего нет</p>}
                {cart?.length === 1 && <Button mode="purple" onClick={handleCheckout}>Забрать</Button>}
            </div>
        </Layout>
    );
};

export default CartPage;
