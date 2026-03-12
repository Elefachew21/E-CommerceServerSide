import slugify from "slugify";


import cloudinary from "../config/cloudinary.js";
import Product from "../models/products.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Check files
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, uploaded) => {
            if (error) throw error;
            images.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
          }
        ).end(file.buffer);
      }
    }
     const slug = slugify(name, { lower: true, strict: true });

    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    // Create product with uploaded images
    const product = await Product.create({
      name,
      slug,
      description,
      price,
      category,
      stock,
      vendor: req.user._id, // assuming authMiddleware sets req.user
      images,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProduct = async (req, res) => {

  
  try {
    const product= await Product.find();
    res.status(201).json(product);

} catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
  

}
const updateProduct = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) { 
      return res.status(400).json({ message: "Please provide data to update" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
if(!updatedProduct) {
  return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
export { createProduct, getAllProduct, updateProduct, deleteProduct };