import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../../store/CartContext';
import './style.css';

export const CartIcon = () => {
    const { cart } = useContext(CartContext);

    return (
        <Link to="/komus-merch-shop/cart">
            <div className={`cart-icon ${cart.length > 0 ? "active" : ""}`}>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="21" stroke="#E6E6E6" strokeWidth="2" />
                    <path d="M11 16L13.1714 25H30.8286L33 16H11Z" stroke="#EAEAEA" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M38 11H34.836L30.6376 28H15" stroke="#EAEAEA" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18.5 33C19.3284 33 20 32.3284 20 31.5C20 30.6716 19.3284 30 18.5 30C17.6716 30 17 30.6716 17 31.5C17 32.3284 17.6716 33 18.5 33Z" stroke="#EAEAEA" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M25.5 33C26.3284 33 27 32.3284 27 31.5C27 30.6716 26.3284 30 25.5 30C24.6716 30 24 30.6716 24 31.5C24 32.3284 24.6716 33 25.5 33Z" stroke="#EAEAEA" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </div>
        </Link>
    );
};