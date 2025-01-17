
import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
      const { name, description, sizes, colors, price, discounted_price, category } = req.body;

      if (!sizes || !colors) {
          return res.json({ success: false, message: 'Sizes or colors are missing.' });
      }

      const imageFiles = [req.files.image1, req.files.image2, req.files.image3, req.files.image4].filter(Boolean);
      const imagesUrl = await Promise.all(
          imageFiles.map(async (file) => {
              const result = await cloudinary.uploader.upload(file[0].path, { resource_type: 'image' });
              return result.secure_url;
          })
      );

      const productData = {
          name,
          description,
          category,
          discounted_price: Number(discounted_price),
          price: Number(price),
          sizes: JSON.parse(sizes),
          colors: JSON.parse(colors), 
          image: imagesUrl,
          date: Date.now(),
      };

      const product = new productModel(productData);
      await product.save();
      res.json({ success: true, message: "Product added" });
  } catch (error) {
      console.error("Error:", error);
      res.json({ success: false, message: error.message });
  }
};



const removeProduct = async (req, res) => {

    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success : true, message: "product removed"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message : error.message})
    }

}
const singleProduct = async (req, res) => {

    try {
        
        const { productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})

    } catch (error) {
        console.log(error);
        res.json({success: false, message : error.message})
    }

}
const listProduct = async (req, res) => {
    try {
        
        const products = await productModel.find({})
        res.json({success: true, products})

    } catch (error) {
        console.log(error);
        res.json({success: false, message : error.message})
    }
}


export {addProduct, removeProduct, singleProduct, listProduct}