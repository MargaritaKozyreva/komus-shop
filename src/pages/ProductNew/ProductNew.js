import React, { useEffect, useState } from "react";
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
import CloseIcon from '../../assets/close.svg';
import "./style.css";
import { httpService } from '../../shared/service/service';

export const ProductNew = () => {
    const [activeKey, setActiveKey] = useState("1");
    const [newImages, setNewImages] = useState([]);
    const [productSendTsLoading, setProductSendIsLoading] = useState(false);
    const [productSendIsError, setProductSendIsError] = useState(false);
    const onChange = value => setActiveKey(value);

    const [editingProduct, setEditingProduct] = useState({
        name: "",
        images: [],
        description: "",
        category: "",
        price: "",
        available: "",
        info: {
            stock: []
        }
    });

    const [fileList, setFileList] = useState([]);
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
                        url: res.data.url,
                        main: res.data.main || false
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
    const deleteImage = image => {
        setNewImages(prevImages => prevImages.filter(elem => elem.id !== image.id));
        setEditingProduct(prevEditingProduct => ({
            ...prevEditingProduct,
            images: prevEditingProduct.images.filter(elem => elem.id !== image.id),
        }));
    };


    useEffect(() => {
        if (editingProduct.info.stock.length === 0) {
            const newEditingProduct = { ...editingProduct };
            newEditingProduct.info.stock.push({ id: Number(Date.now()), variant: "", count: 0 });
            setEditingProduct(newEditingProduct);
        }
    }, [])

    const opts = [
        { label: "first option", value: 1 },
        { label: "second option", value: 2 },
        { label: "third option", value: 3 },
    ];

    const handleFieldChange = (field, value) => {
        setEditingProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleVariantChange = (index, key, value) => {
        const newEditingProduct = { ...editingProduct };
        newEditingProduct.info.stock[index][key] = value;
        setEditingProduct(newEditingProduct);
    };

    const addNewVariant = () => {
        const newEditingProduct = { ...editingProduct };
        newEditingProduct.info.stock.push({ id: Number(Date.now()), variant: "", count: 0 });
        setEditingProduct(newEditingProduct);
    };

    const deleteVariant = (id, stockItemID) => {
        const newEditingProduct = { ...editingProduct };
        newEditingProduct.info.stock = newEditingProduct.info.stock.filter(stockItem => stockItem.id !== stockItemID);
        setEditingProduct(newEditingProduct);
    };

    const apiCreateProduct = async (data) => {
        try {
            setProductSendIsLoading(true);
            const response = await httpService("POST", "create_new_product", '', data);

            if (response.success === true) {
                setProductSendIsLoading(false);
            } else {
                setProductSendIsLoading(false);
                setProductSendIsError('not success: ' + response.error_text)
                return null;
            }
        } catch (error) {
            setProductSendIsError(error)
        }

    };

    const makeMainImage = image => {
        setEditingProduct(prevProduct => ({
            ...prevProduct,
            mainImage: image,
        }));
    };


    const validateVariants = () => {
        return editingProduct.info.stock.every(stockItem => stockItem.variant && stockItem.count > 0);
    };

    const handleSave = async () => {
        if (!validateVariants()) {
            alert('Добавьте вариант товара с количеством.');
            return;
        }

        const allImages = [
            ...editingProduct.images.map(image => ({ ...image, main: image.url === editingProduct.mainImage })),
            ...newImages.map(image => ({ ...image, main: image.url === editingProduct.mainImage }))
        ];

        const productData = {
            ...editingProduct,
            images: allImages
        };

        try {
            const response = await apiCreateProduct(productData);

            if (response.status === 200) {
                // Очищаем все данные формы, включая изображения
                setEditingProduct({
                    name: "",
                    images: [],
                    description: "",
                    category: "",
                    price: "",
                    available: "",
                    mainImage: null,
                    info: {
                        stock: [{ id: Number(Date.now()), variant: "", count: 0 }]
                    }
                });
                setNewImages([]);
            } else {
                console.error(`Error creating product: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error creating product: ${error}`);
        }
    };

    const resetChanges = () => {
        setEditingProduct(JSON.parse(JSON.stringify(editingProduct)));
    };

    const isFormFilled = () => {
        const { name, description, price, info } = editingProduct;
        const areVariantsFilled = info.stock.every(stockItem => stockItem.variant && stockItem.count > 0);
        return name && description && price && areVariantsFilled;
    };


    return (
        <Layout>
            <div className="product-add-page">

                <GallaryImage
                    prevMainImage={editingProduct.image}
                    images={editingProduct.images}
                    newImages={newImages}
                    mainImage={editingProduct.mainImage}
                    setNewImages={setNewImages}
                    setEditingProduct={setEditingProduct}
                    editingProduct={editingProduct}
                    deleteImage={deleteImage}
                    makeMainImage={makeMainImage}
                    fileList={fileList}
                    setFileList={setFileList}
                    customRequest={customRequest}
                    handleChange={handleChange}
                />

                <div className="product-add-page-wrapper">
                    <h2 className="product-add-page-title">{editingProduct.name || "Новый товар"}</h2>
                    <Tabs activeKey={activeKey} onChange={onChange} style={{ width: '100%' }}>
                        <Tabs.TabPane tab="Общая информация" key="1">
                            <div className="form">
                                <Input placeholder="Название товара"
                                    value={editingProduct.name}
                                    onChange={e => handleFieldChange('name', e.target.value)} />
                                {/* <div>
                                    <label>Категория</label>
                                    <Select
                                        value={editingProduct.category}
                                        options={opts}
                                        onChange={option => handleFieldChange('category', option.value)}
                                    />
                                </div> */}
                                <div>
                                    <label>Цена</label>
                                    <Input value={editingProduct.price}
                                        onChange={e => handleFieldChange('price', e.target.value)} />
                                </div>
                                <div>
                                    <label>Описание</label>
                                    <Textarea value={editingProduct.description}
                                        onChange={e => handleFieldChange('description', e)}>Описание</Textarea>
                                </div>
                                <Button type="primary" disabled={!isFormFilled()} onClick={handleSave}>Добавить товар</Button>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Параметры" key="2">
                            <div className="form form-2">
                                <div className='product-variants-wrapper'>
                                    {
                                        editingProduct.info.stock && editingProduct.info.stock.map((stockItem, index) => (
                                            <div key={index} className='product-variants'>
                                                <div className='product-variant-item product-variant-item-var'>
                                                    <label>Вариант</label>
                                                    <Input value={stockItem.variant} onChange={e => handleVariantChange(index, 'variant', e.target.value)} />
                                                </div>
                                                <div className='product-variant-item product-variant-item-size'>
                                                    <label>Количество</label>
                                                    <Input value={stockItem.count} onChange={e => handleVariantChange(index, 'count', e.target.value)} />
                                                </div>
                                                {
                                                    index > 0 &&
                                                    <img src={CloseIcon} alt={'close-icon'} className='product-variant-item-close-icon' onClick={() => deleteVariant(editingProduct.id, stockItem.id)} />
                                                }
                                            </div>
                                        ))
                                    }

                                    <Link onClick={addNewVariant}>Добавить ещё</Link>
                                </div>
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};