import React, { useContext } from 'react';
import { CartContext } from '../../../store/CartContext';
import './style.css';
import { Button } from '../Button';

const CartItem = ({ item }) => {
    const { removeFromCart } = useContext(CartContext);

    const handleRemoveClick = () => {
        removeFromCart(item.id);
    };

    return (
        <div className="cart-item">
            {/* <h2 className="cart-item-mobile-title">{item.name}</h2> */}
            <img src={item.image} alt={'image'} className="cart-item-image" />
            <div className="cart-item-details">
                <div>
                    {item.selectedAttributes && item.selectedAttributes.variant && (
                        <div>
                            <h4 className="cart-item-title">{item.name}</h4>
                            <p className="cart-item-size">Выбранный вариант: {item.selectedAttributes.variant}</p>
                        </div>
                    )}
                </div>

                <Button mode='accent' onClick={handleRemoveClick}>Удалить из корзины</Button>
            </div>
        </div>
    );
};

export default CartItem;