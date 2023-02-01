const cloudinary = require("./../config/cloudinary");

// upload pfp
const uploadpfp = async(image, user_id) => {
    const options = {
        public_id: `${user_id}_pfp`,
        unique_filename: false,
        overwrite: true,
        folder: `${user_id}`,
    };
    const uploadResponse = await cloudinary.uploader.upload(image, options);
    return uploadResponse;
};
// upload cover image
const uploadCover = async(image, user_id) => {
    const options = {
        public_id: `${user_id}_cover`,
        unique_filename: false,
        overwrite: true,
        folder: `${user_id}`,
    };
    const uploadResponse = await cloudinary.uploader.upload(image, options);
    return uploadResponse;
};

// upload main image
const uploadProductMainImage = async(image, user_id, product_id) => {
    var options = {
        public_id: `${product_id}_mainimage`,
        unique_filename: false,
        overwrite: true,
        folder: `${user_id}/products/${product_id}`,
    };
    const uploadResponse = await cloudinary.uploader.upload(image, options);
    return uploadResponse.secure_url;
};

// upload product images
const uploadProductImages = async(image, user_id, product_id, index) => {
    var options = {
        public_id: `${product_id}_${index}`,
        unique_filename: false,
        overwrite: true,
        folder: `${user_id}/products/${product_id}`,
    };
    const uploadResponse = await cloudinary.uploader.upload(image, options);

    return uploadResponse;
};
const deleteProductImage = async(product_id, index) => {
    const deleteResponse = await cloudinary.uploader.destroy(
        `${product_id}_${index}`
    );
    return deleteResponse;
};
module.exports = {
    uploadCover,
    uploadProductImages,
    uploadpfp,
    uploadProductMainImage,
    deleteProductImage,
};