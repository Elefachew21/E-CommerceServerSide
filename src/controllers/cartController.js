import Cart from "../models/carts.js";
import Product from "../models/products.js";
import Order from "../models/orders.js"
const addToCart = async (req, res) => {
    try {
        const { productId, quantity, sessionID } = req.body;
        let cart;
        if (req.user) {
            cart = await Cart.findOne({ user: req.user._id });
        }
        else {
            if(!sessionID){
                return res.status(400).json({
                    success: false,
                    message: "Session ID is required for guest users"
                });
            }
            cart = await Cart.findOne({ sessionID });

        }
        if (!cart) {
            cart = new Cart({
                user: req.user ? req.user._id : null,
                sessionID: req.user ? null : sessionID,
                items: [],
                totalPrice: 0
            });
        }
        const product= await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if(existingItem){
            existingItem.quantity += quantity;
        }
        cart.items.push({
            product: productId,
            name: product.name,
            price: product.price,
            quantity
        });
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        res.status(200).json({
            success: true,
            cart
        });
        
    

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
    

}
const checkout = async (req, res) => { 
    try {
        if (!req.user) {
            res.status(400).json({
                success: false,
                message: "please login to checkout"
            });
        }
        const cart = await Cart.findOne(req.user._id);
        if (!cart || cart.items.length === 0) {
            res.status(401).json({
                success: false,
                message: "Cart is empty "
            });
        }
        const order = new Order({
            user: req.user._id,
            items: cart.items,
            totalPrice: cart.totalPrice
        });
        await order.save();

        cart.items = [];
        cart.totalPrice = 0;
        res.status(200).json({
            success: true,
            message: "Order checkout Successfully !!!"
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error:error.message
        })
        
    }
}
const updateCart = async (req, res) => {
    try {
        const { productId, quantity, sessionID } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "productId is required to update cart",
            });
        }

        let cart;
        if (req.user) {
            cart = await Cart.findOne({ user: req.user._id });
        } else {
            if (!sessionID) {
                return res.status(400).json({
                    success: false,
                    message: "Session ID is required for guest users",
                });
            }
            cart = await Cart.findOne({ sessionID });
        }

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }

        // if quantity provided and is zero or less, remove the item
        if (typeof quantity === "number") {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
        }

        cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        await cart.save();

        res.status(200).json({ success: true, message:"Update cart successfully",cart });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
const viewCart = async (req, res) => {
    try {
        const sessionID = req.sessionID;
        
        const cart = await Cart.find({
            $or: [
                { user: req.user?._id },
                {sessionID:sessionID}
                
            ]
        });
        if (!cart || cart.length===0) {
            res.status(400).json({
                success: false,
                message: `The Cart item is empty with the ID ${req.user} or ${sessionID}}`
            });
        }
        // fetch all details of the product 

        const cartItems = await Promise.all(
            cart.items.map(async (item) => {
                const product = await Product.findOne(item.product);
                return {
                    product,
                    quantity: item.quantity
                }
            }))
          res.status(200).json({
                success: true, message: "the cart detail as folllow:",
                cart: {
                    _id: cart._id,
                    user: req.user ? cart.user : null,
                    sessionID: req.user ? null : sessionID,
                    item: cartItems
                }
            });
          

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message }); 
    }
}
const viewAllCart = async (req, res) => {
    try {
        const sessionID = req.sessionID;
        const cartItems = await Cart.find({
            $or: [
                {
                    user: req.user?._id
                    
                },
        { sessionID: sessionID }
            ]
        })
        const cartWithProduct = await Promise.all(
            cartItems.map(async (item) => {
                const product = await Product.findOne(item.product);
                return {
                    _id: item._id,
                    product,
                    user: req.user ? item.user : null,
                    sessionID: req.user ? null : sessionID,
                    quantity: item.quantity
                }
            })
        );
        res.status(200).json({
            success: true,
            cart:cartWithProduct
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        }
        )
        
    }
}

const removeCart = async (req, res) => {
    try {
        const deleted = await Cart.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message:"Cart not found"
            })
        }
        res.status(200).json(({
            success: true,
            message:"Cart Deleted Successfully"
        }))
    } catch (error) {
res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })        
    }
}

export { addToCart, checkout, updateCart,viewCart,viewAllCart ,removeCart};    
