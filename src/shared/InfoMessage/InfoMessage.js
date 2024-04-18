import React from 'react';
import './style.css';

export const InfoMessage = () => (
    <div className="info-message">
        <h3>Внимание!</h3>
        <p>Вы можете взять только 1 подарок.</p>
        <p>Удалите из корзины часть товаров чтобы остался только один подарок.</p>
    </div>
);