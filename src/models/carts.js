import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
        },
        sessionID: {
          type: String
         
        }
      ,

    items: [cartItemSchema],

    totalPrice: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

cartSchema.index({
  user: 1,
  sessionID:1
})

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;