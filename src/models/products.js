// models/Product.js

import mongoose from "mongoose";



const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    stock: {
        type: Number,
        default: 0
    },

  images:[ {
    url: String,
    public_id: String
    }],   // multiple images

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });





const Product = mongoose.model("Product", productSchema);

export default Product;