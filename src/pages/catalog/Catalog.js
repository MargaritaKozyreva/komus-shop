import React, { useContext, useEffect } from "react";
import { UserContext } from "../../store/UserContext";
import { CatalogContext } from "../../store/CatalogContext";
import { WithSkeleton } from "../../shared/ui/WithSkeleton";
import { Button } from "../../shared/ui/Button";
import { Link } from "@komus/design";

import s from "classnames";
import "./style.css";

export const Catalog = () => {
  const { mode } = useContext(UserContext);
  const { products, getProducts, productsLoading } = useContext(CatalogContext);

  useEffect(() => {
    getProducts();
  }, []);

  const isAdmin = mode === "administrator";
  return (
    <WithSkeleton isLoading={productsLoading} isEmpty={products === null}>
      <div className="catalog-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img
              className="product-image"
              src={product.image}
              alt={product.description}
            />
            <p className={s("product-name", "text")}>{product.name}</p>
            {isAdmin && (
              <div className="admin-info">
                <p>
                  Складской остаток:{" "}
                  {product.info.stock.reduce(
                    (total, item) => total + item.count,
                    0
                  )}
                </p>
                <p>Закупочная цена: {product.info.stock_price}</p>
              </div>
            )}
            <div className="btn-product-panel">
              {!isAdmin && (
                <Button mode="accent" to={`/komus-merch-shop/product/${product.id}`}>
                  Смотреть
                </Button>
              )}
              {isAdmin && (
                <div className="btn-product-panel">
                  <Link href={`/komus-merch-shop/product/${product.id}`}>
                    Смотреть как пользователь
                  </Link>
                  <Link href={`/komus-merch-shop/product/${product.id}/edit`}>
                    Редактировать
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </WithSkeleton>
  );
};
