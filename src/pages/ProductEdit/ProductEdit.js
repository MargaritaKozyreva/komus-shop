import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productData from "../../mock_data/product.json";
import "./style.css";
import { Layout } from "../../shared/layout";
import {
  Input,
  Tabs,
  Toggle,
  select as Select,
  Textarea,
  Link,
  Button,
} from "@komus/design";
import { GallaryImage } from "../../shared/ui/GallaryImage";
import CloseIcon from "../../assets/close.svg";
import { Spinner } from "react-bootstrap";
import { useData } from "../../shared/api/useData";
import { httpService } from "../../shared/service/service";
import { WithSkeleton } from "../../shared/ui/WithSkeleton";

export const ProductEdit = () => {
  const [product, setProduct] = useState(null);
  const [initialProduct, setInitialProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prevMainImage, savePrevMainImage] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [toggle, setToggle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState("1");

  const [productSendTsLoading, setProductSendIsLoading] = useState(false);
  const [productSendIsError, setProductSendIsError] = useState(false);

  const onChange = value => setActiveKey(value);
  const [fileList, setFileList] = useState([])
  const { id } = useParams();

  const { data, isLoading, isError } = useData(
    () => httpService("GET", "get_product", `product_id=${id}`),
    [id]
  );

  const deleteImage = imageId => {
    setProduct(prevProduct => ({
      ...prevProduct,
      images: prevProduct.images.filter(image => image.id !== imageId),
    }));

    setEditingProduct(prevEditingProduct => ({
      ...prevEditingProduct,
      images: prevEditingProduct.images.filter(image => image.id !== imageId),
    }));
  };

  const makeMainImage = (data) => {

    setEditingProduct(prevProduct => ({
      ...prevProduct,
      image: data.url,
      image_id: data.id
    }));
  };

  useEffect(() => {
    if (!isLoading && data !== null) {
      const fetchProducts = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProduct(data.data);
        setInitialProduct(data.data);
        setEditingProduct(JSON.parse(JSON.stringify(data.data)));
        setToggle(data.data.is_active);
        setLoading(false);
      };
      fetchProducts();
    }
  }, [data, id, isLoading]);

  useEffect(() => {
    if (editingProduct) {

      savePrevMainImage({
        id: 0,
        url: product.image,
      });
    }
  }, [editingProduct]);
  useEffect(() => {
    if (editingProduct && editingProduct.images) {
      const newFileList = editingProduct.images.map((image) => {
        return { ...image, status: 'done', name: image.uid }
      })
      setFileList(newFileList)
    }
  }, []);


  if (!product) return <Spinner size='sm' />;


  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const apiUpdateProduct = async () => {
    setProductSendIsLoading(true);
    const response = await httpService("POST", "update_product", '', editingProduct);
    return response
  };

  const handleSave = async () => {
    try {
      const response = await apiUpdateProduct();
      if (response.status === 200) {
        setProduct(editingProduct);
      } else {
        console.error(`Error saving product: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error saving product: ${error}`);
    }
  };

  const opts = [
    { label: "first option", value: 67456774754754400 },
    { label: "second option", value: 67556774756754400 },
    { label: "third option", value: 65477647400099885 },
  ];

  const handleVariantChange = (index, key, value) => {
    const newEditingProduct = { ...editingProduct };
    newEditingProduct.info.stock[index][key] = value;
    setEditingProduct(newEditingProduct);
  };

  const handleFieldChange = (field, value) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFieldPriceChange = value => {
    const newEditingProduct = { ...editingProduct };
    newEditingProduct.info.stock_price = value;
    setEditingProduct(newEditingProduct);
  };

  const addNewVariant = () => {
    const newEditingProduct = { ...editingProduct };
    newEditingProduct.info.stock.push({ variant: "", count: 0 });
    setEditingProduct(newEditingProduct);
  };

  const deleteVariant = (id, variant) => {
    const newEditingProduct = { ...editingProduct };
    newEditingProduct.info.stock = newEditingProduct.info.stock.filter(
      stockItem => stockItem.variant !== variant
    );
    setEditingProduct(newEditingProduct);
  };

  const resetChanges = () => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    fmData.append("file", file);

    try {
      const res = await httpService(
        'POST',
        "upload_photo",
        '',
        fmData,
        config
      );

      if (res.status === 200) {
        onSuccess(res.data, file);
        setNewImages(prevImages => [
          ...prevImages,
          {
            id: res.data.uid,
            url: res.data.url
          }
        ]);
      } else {
        onError(new Error('Error in upload'), {
          uid: file.uid,
        });
        console.error(`Error uploading image: ${res.status}`);
      }
    } catch (error) {
      onError(new Error('Error in upload'), {
        uid: file.uid,
      });
      console.error(`Error uploading image: ${error}`);
    }
  }

  return (
    <Layout>
      <WithSkeleton isLoading={isLoading} isEmpty={product === null}>
        <div className="product-edit-page">
          <GallaryImage
            prevMainImage={prevMainImage}
            images={editingProduct.images}
            newImages={newImages}
            editingProduct={editingProduct}
            mainImage={editingProduct.image}
            setNewImages={setNewImages}
            setEditingProduct={setEditingProduct}
            deleteImage={deleteImage}
            makeMainImage={makeMainImage}
            fileList={fileList}
            setFileList={setFileList}
            customRequest={customRequest}
            handleChange={handleChange}
          />

          <div className="product-edit-main-section">
            <div className="product-edit-page-wrapper">
              <h2 className="product-edit-page-title">{product.name}</h2>
              <Tabs
                activeKey={activeKey}
                onChange={onChange}
                style={{ width: "100%" }}
              >
                <Tabs.TabPane tab="Общая информация" key="1">
                  <div className="form form-1">
                    {/* <Toggle
                      onChange={() => handleFieldChange("active", !toggle)}
                      label="Активный товар"
                    /> */}
                    {/* <div className="select-edit">
                      <label>Доступно</label>
                      <Select
                        value={editingProduct.available}
                        options={opts}
                        onChange={option =>
                          handleFieldChange("available", option)
                        }
                      />
                    </div> */}
                    <div className="input-edit">
                      <label>Наименование</label>
                      <Input
                        value={editingProduct.name}
                        onChange={e => handleFieldChange('name', e.target.value)}
                      />
                    </div>
                    <div className="select-edit">
                      <label>Категория</label>
                      <Select
                        value={editingProduct.category}
                        options={opts}
                        disabled
                        onChange={option =>
                          handleFieldChange("category", option)
                        }
                      />
                    </div>
                    <div className="input-edit">
                      <label>Цена</label>
                      <Input
                        value={editingProduct.info.stock_price}
                        suffix={<span className="money-icon">₽</span>}
                        onChange={e => handleFieldPriceChange(e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Описание</label>
                      <Textarea
                        value={editingProduct.description}
                        onChange={value =>
                          handleFieldChange("description", value)
                        }
                      >
                        Описание
                      </Textarea>
                    </div>
                    {JSON.stringify(product) !==
                      JSON.stringify(editingProduct) && (
                        <Button type="primary" onClick={handleSave}>
                          Сохранить
                        </Button>
                      )}
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Параметры" key="2">
                  <div className="form form-2">
                    <div className="product-variants-wrapper">
                      {editingProduct.info.stock &&
                        editingProduct.info.stock.map((stockItem, index) => (
                          <div key={index} className="product-variants">
                            <div className="product-variant-item product-variant-item-var">
                              <label>Вариант</label>
                              <Input
                                value={stockItem.variant}
                                onChange={e =>
                                  handleVariantChange(
                                    index,
                                    "variant",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="product-variant-item product-variant-item-size">
                              <label>Количество</label>
                              <Input
                                value={stockItem.count}
                                onChange={e =>
                                  handleVariantChange(
                                    index,
                                    "count",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <img
                              src={CloseIcon}
                              alt={"close-icon"}
                              className="product-variant-item-close-icon"
                              onClick={() =>
                                deleteVariant(product.id, stockItem.variant)
                              }
                            />
                          </div>
                        ))}
                      <Link onClick={addNewVariant}>Добавить ещё</Link>
                    </div>
                    <div className="product-edit-action-bar">
                      {JSON.stringify(product) !==
                        JSON.stringify(editingProduct) && (
                          <Button type="primary" onClick={handleSave}>
                            Сохранить
                          </Button>
                        )}
                      {JSON.stringify(editingProduct.info.stock) !==
                        JSON.stringify(product.info.stock) && (
                          <Link onClick={resetChanges}>Отменить изменения</Link>
                        )}
                    </div>
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </WithSkeleton>
    </Layout>
  );
};
