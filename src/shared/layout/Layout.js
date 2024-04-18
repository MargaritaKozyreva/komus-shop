import React from 'react';
import { Header } from '../header';
import './style.css';

export const Layout = ({ children }) => (
  <div className="layout">
    <div>
      <Header />
    </div>
    {children}
  </div>
);