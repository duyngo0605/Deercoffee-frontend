import React, { useState, useEffect } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './imageUploader.css';

const ImageUploader = ({ value, onChange }) => {
    const [imageUrl, setImageUrl] = useState(value || '');
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        console.log("Value changed:", value);
        setImageUrl(value || '');
    }, [value]);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (file) => {
        setImageLoading(true);
        try {
            const base64 = await convertToBase64(file);
            setImageUrl(base64);
            onChange(base64);
            message.success('Tải ảnh lên thành công');
        } catch (error) {
            console.error("Upload error:", error);
            message.error('Tải ảnh lên thất bại');
        } finally {
            setImageLoading(false);
        }
    };

    const handlePaste = async (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        
        for (let item of items) {
            if (item.type.indexOf('image') === 0) {
                const file = item.getAsFile();
                await handleImageUpload(file);
                break;
            }
        }
    };

    return (
        <div 
            className="image-upload-container"
            onPaste={handlePaste}
        >
            {imageUrl && (
                <div className="image-preview">
                    <img 
                        src={imageUrl} 
                        alt="Preview" 
                        onError={(e) => {
                            console.error("Image load error");
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/200';
                        }}
                    />
                </div>
            )}
            <Upload
                showUploadList={false}
                beforeUpload={(file) => {
                    console.log("Before upload:", file);
                    handleImageUpload(file);
                    return false;
                }}
            >
                <Button 
                    icon={<UploadOutlined />} 
                    loading={imageLoading}
                >
                    Tải ảnh lên
                </Button>
            </Upload>
            <div className="paste-hint">
                hoặc dán (Ctrl+V) ảnh trực tiếp vào đây
            </div>
        </div>
    );
};

export default ImageUploader; 