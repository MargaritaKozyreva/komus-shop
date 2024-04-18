import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../store/CartContext";
import { UserContext } from "../../store/UserContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CartIcon } from "../ui/Cart";
import { Link } from "@komus/design";

import logo from "../../assets/logo.png";
import "./style.css";
import { WithSkeleton } from "../ui/WithSkeleton";

export const Header = () => {
  const { user, getUser, userLoading, changeUserViewMode, mode } =
    useContext(UserContext);

  const { cartIsLoading, cart, getCart } = useContext(CartContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    getCart();
  }, []);

  useEffect(() => {
    setIsAdmin(user?.data?.role === "administrator");
  }, [user?.data?.role]);

  const shouldShowCart =
    location.pathname.includes("main") ||
    location.pathname.includes("cart") ||
    location.pathname.includes("product");
  const isProductPage =
    location.pathname.includes("product") &&
    !location.pathname.includes("edit");
  const isProductEditPage =
    location.pathname.includes("product") && location.pathname.includes("edit");
  const isProductNewPage =
    location.pathname.includes("product") && location.pathname.includes("new");
  const isMainPage = location.pathname.includes("main");

  const switchToViewMode = mode => {
    if (isProductEditPage) {
      navigate(`/komus-merch-shop/product/${id}`);
    }
    changeUserViewMode(mode);
  };

  const goToAddProduct = () => {
    navigate("/komus-merch-shop/product/new");
  };

  const goToEditProduct = () => {
    navigate(`/komus-merch-shop/product/${id}/edit`);
  };

  return (
    <WithSkeleton isLoading={userLoading} isEmpty={user === null}>
      <div>
        {isAdmin && (
          <div className="admin-panel">
            <div className="admin-panel__wrapper">
              <span className="red-point"></span>
              <span className="admin-panel__text">Режим администратора</span>
              {!isProductEditPage && isMainPage && (
                <Link
                  onClick={() =>
                    switchToViewMode(
                      mode === "administrator" ? "user" : "administrator"
                    )
                  }
                >
                  Вернуться в режим{" "}
                  {mode === "administrator" ? "просмотра" : "администратора"}
                </Link>
              )}
            </div>
            {!isProductNewPage && (
              <Link onClick={goToAddProduct}>Добавить товар</Link>
            )}
            {isProductPage && !isProductNewPage && (
              <Link onClick={goToEditProduct}>Редактировать эту страницу</Link>
            )}
          </div>
        )}
        <div className="user">
          <img src={user?.data?.avatar} />
          <p>{user?.data?.fullName}</p>
        </div>
        <div className="header">
          <img className='main-logo' src={logo} alt="Logo" onClick={() => navigate("/komus-merch-shop/main")} />
          <span className="text">Всегда Ваш, Комус-подарок</span>
          {shouldShowCart && (
            <WithSkeleton isLoading={cartIsLoading}>
              <CartIcon cart={cart} />
            </WithSkeleton>
          )}
        </div>
      </div>
    </WithSkeleton>
  );
};
