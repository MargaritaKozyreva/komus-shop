import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { UserContext } from "../../store/UserContext";
import { CartContext } from "../../store/CartContext";

import { Button } from "../../shared/ui/Button";
import { Layout } from "../../shared/layout";
import { Link, Text } from "@komus/design";
import { httpService } from "../../shared/service/service";
import { useData } from "../../shared/api/useData";
import { WithSkeleton } from "../../shared/ui/WithSkeleton";
import "./style.css";
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export const ProductPage = () => {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const { mode } = useContext(UserContext);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  const { id } = useParams();

  const {
    data: product,
    isLoading,
    isError,
  } = useData(
    () => httpService("GET", "get_product", `product_id=${id}`),
    [id]
  );

  useEffect(() => {
    if (!isLoading && product !== null) {
      setSelectedImage(product?.data?.image);
    }
  }, [isLoading, product]);

  useEffect(() => {
    if (!isLoading && product !== null && product?.data.info.stock.length === 1) {
      setSelectedAttributes(prevState => {
        return { ...prevState, "variant": product?.data.info.stock[0].variant };
      });
    }
  }, [isLoading, product]);

  const isInCart = cart.find(cartItem => cartItem.id === product?.data?.id);
  const cartIsEmpty = cart.length === 0;

  const handleAttributeSelection = (attributeName, attributeValue) => {
    setSelectedAttributes(prevState => {
      return { ...prevState, [attributeName]: attributeValue };
    });
  };

  const isVariantSelected = !!selectedAttributes.variant;

  return (
    <Layout>
      <WithSkeleton isLoading={isLoading} isEmpty={product === null}>
        <div className="product-page">
          <h2 className="product-page-mobile-title">{product?.data.name}</h2>
          <div className="product-gallery">
            {product?.data.images.map((image, i) => (
              <div key={image.id} className="product-image-gallary-item">
                <img
                  src={image.url}
                  alt={image.id}
                  onClick={() => setSelectedImage(image.url)}
                />
              </div>
            ))}
          </div>
          <div className="product-main-section">
            <div className="product-main-section-image">
              <img
                src={selectedImage}
                alt={product?.data.description}
                className="product-page-image"
              />
            </div>
            <div className="product-page-wrapper">
              <h2 className="product-page-title">{product?.data.name}</h2>
              {mode === "administrator" && (
                <p className="product-page-stock">
                  Осталось на складе:{" "}
                  {product?.data.info.stock.reduce(
                    (total, item) => total + item.count,
                    0
                  )}
                </p>
              )}
              <div>
                {product?.data.info.stock.length > 1 && <p>Варианты: </p>}
                <div className="product-page-style product-page-sizes">
                  {product?.data.info.stock.length > 1 && product?.data.info.stock.map(item => (
                    <button
                      key={item.variant}
                      disabled={item.count === 0}
                      onClick={() =>
                        handleAttributeSelection("variant", item.variant)
                      }
                      className={
                        selectedAttributes.variant === item.variant
                          ? "product-button selected-size"
                          : "product-button"
                      }
                    >
                      {item.variant}
                    </button>
                  ))}
                </div>
              </div>

              {isInCart ? (
                <div className="button-panel">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Button mode="accent" disabled>
                        Уже в корзине
                      </Button>
                      {!cartIsEmpty && !isInCart ? (
                        <Tooltip title="Чтобы выбрать этот товар, Ваша корзина должна быть пустой.">
                          <InfoCircleOutlined style={{ cursor: 'help', marginLeft: 8 }} />
                        </Tooltip>
                      ) : null}
                    </div>

                    <Text style={{ fontSize: '12px', fontStyle: 'italic ' }}>(Перейдите в корзину для оформления заказа)</Text>
                  </div>
                  {/* <Button mode="accent" onClick={() => removeFromCart(product.id)}>
                                Удалить из корзины
                            </Button> */}
                  <Link
                    year="2022"
                    onClick={() => removeFromCart(product?.data.id)}
                  >
                    Удалить из корзины
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    className="cart-btn"
                    mode="purple"
                    onClick={() => addToCart(product?.data?.id, selectedAttributes.variant)}
                    disabled={!isVariantSelected || !cartIsEmpty}
                  >
                    В корзину
                  </Button>
                  {!cartIsEmpty && !isInCart ? (
                    <Tooltip title="Чтобы выбрать этот товар, Ваша корзина должна быть пустой.">
                      <InfoCircleOutlined style={{ cursor: 'help', marginLeft: 8 }} />
                    </Tooltip>
                  ) : null}
                </div>

              )}
              <p className="product-page-description">
                {product?.data.description}
              </p>
            </div>
          </div>
        </div>
      </WithSkeleton>
    </Layout>
  );
};
