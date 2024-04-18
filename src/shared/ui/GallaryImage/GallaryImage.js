import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import CloseIcon from "../../../assets/close.svg";
import { Button, Link, Upload } from "@komus/design";
import "./style.css";

const GallaryImage = props => {
    const {
        images,
        newImages,
        setNewImages,
        setEditingProduct,
        prevMainImage,
        editingProduct,
        mainImage,
        deleteImage,
        handleChange,
        fileList,
        setFileList,
        makeMainImage,
        onPreview,
        customRequest,
    } = props;
    const [previewUrl, setPreviewUrl] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const onFileChange = ({ file, fileList }) => {
        const url = URL.createObjectURL(file.originFileObj);
        setPreviewUrl(url);
        // ... остальной код
    };

    const handleDelete = image => {
        setSelectedImage(image);
        setModalShow(true);
    };

    const confirmDelete = () => {
        deleteImage(selectedImage);

        // Удаляем изображение из newImages
        setNewImages(prevImages => prevImages.filter(elem => elem.id !== selectedImage.id));

        // Удаляем изображение из editingProduct.images
        if (editingProduct && editingProduct.images) {

            setEditingProduct(prevEditingProduct => {
                return {
                    ...prevEditingProduct,
                    images: prevEditingProduct.images.filter(image => image.id !== selectedImage.id)
                }

            });
        }

        // Удаляем изображение из fileList (если это необходимо)
        const newFileList = fileList.filter(file => file.response && file.response.uid !== selectedImage.id);
        setFileList(newFileList);

        setModalShow(false);
    };

    return (
        <div className="gallary-image-root">
            <div className="gallary-image-root-wrapper">
                {previewUrl && <img src={previewUrl} alt="Preview" />}
                {mainImage && (
                    <div className="main-item-wrapper">
                        <span>Главное изображение</span>
                        <img
                            src={mainImage}
                            alt={"main image"}
                            className="gallery-photo-item main-item"
                        />
                    </div>
                )}
                {[...images, ...newImages].map((image, i) => {

                    return (
                        <div key={image.id+'_'+i} className="gallery-photo-item">
                            <img src={image.url} alt={image.id} />
                            <img
                                src={CloseIcon}
                                alt={"close-icon"}
                                className="delete-image-icon"
                                onClick={() => handleDelete(image)}
                            />
                            <Link onClick={makeMainImage.bind(null, { ...image })}>
                                Сделать главным
                            </Link>
                        </div>
                    )
                })}
            </div>
            <Upload
                fieldName="Добавить изображение"
                // description={"Файл может быть в формате jpg, png, gif и объемом не более 10 Мегабайт"}
                action="https://sdo.komus.net/komus_merch_shop/api/controller.html?action=upload_photo"
                customRequest={customRequest}
                listType="text"
                fileList={fileList}
                onChange={handleChange}
                // onPreview={onPreview}
                onFileChange={onFileChange}
                className="gallary-wrap"
                showUploadList={{ showRemoveIcon: false, showPreviewIcon: false }} // Отключает иконку удаления
            // itemRender={(originNode, file, fileList, actions) => {
            //     return (
            //         <div className='gallary-div'>
            //             <div className='gallary-div-image'>
            //                 {originNode}
            //                 <Link style={{ margin: '10px' }} onClick={() => makeMainImage(file)}>Сделать главным</Link>
            //             </div>

            //         </div>
            //     );
            // }}
            />

            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Удаление изображения</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите удалить это изображение?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalShow(false)}>
                        Отменить
                    </Button>
                    <Button variant="primary" onClick={confirmDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GallaryImage;
