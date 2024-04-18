import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { UserContext, UserProvider } from "../store/UserContext";
import { CartProvider } from "../store/CartContext";
import { CatalogProvider } from "../store/CatalogContext";
import { MainPage } from "./main";
import { ProductPage } from "./product";
import { CartPage } from "./cart";
import { DeliveryPage } from "./DeliveryPage";
import { ConfirmationPage } from "./Confirmation";
import { ProductEditPage } from "./ProductEdit";
import { ProductNewPage } from "./ProductNew";
import { UserCheck } from "../shared/helpers/pages/UserCheck";

import "../index.css";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="komus-merch-shop/main"
            element={
              <UserCheck>
                <MainPage />
              </UserCheck>
            }
          />
          <Route
            path="komus-merch-shop/product/:id"
            element={
              <UserCheck>
                <ProductPage />
              </UserCheck>
            }
          />
          <Route
            path="komus-merch-shop/product/:id/edit"
            element={
              <UserCheck>
                <ProductEditPage />
              </UserCheck>
            }
          />
          <Route
            path="komus-merch-shop/product/new"
            element={
              <UserCheck>
                <ProductNewPage />
              </UserCheck>
            }
          />
          <Route
            path="komus-merch-shop/cart"
            element={
              <UserCheck>
                <CartPage />
              </UserCheck>
            }
          />
          <Route
            path="komus-merch-shop/delivery"
            element={
              <UserCheck>
                <DeliveryPage />
              </UserCheck>
            }
          />
          <Route
            path="komus-merch-shop/confirmation"
            element={
              <UserCheck>
                <ConfirmationPage />
              </UserCheck>
            }
          />
          <Route path="*" element={<Navigate to="komus-merch-shop/main" />} />
        </Routes>
      </Router>
    </div>
  );
};

const WrappedApp = () => (
  <UserProvider>
    <CartProvider>
      <CatalogProvider>
        <App />
      </CatalogProvider>
    </CartProvider>
  </UserProvider>
);

export default WrappedApp;
