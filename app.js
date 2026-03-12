import express from "express";
import morgan from "morgan";
import authRoute from "./src/routes/authRoute.js";
import productRoute from "./src/routes/productRoute.js";
import categoryRoute from "./src/routes/categoryRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import cartRoute from "./src/routes/cartRoute.js"
import profileRoute from "./src/routes/profileRoute.js"
const app = express(); // create an express application

app.use(express.json()); // middleware to parse JSON request bodies
app.use(morgan("dev")); // middleware for logging HTTP requests in development mode
// user API base Routes
app.use("/api/auth", authRoute);// use the auth routes for /api/auth endpoints
// Product API base Routes

app.use("/api/products", productRoute);// use the product routes for /api/products endpoints
app.use("/api/categories", categoryRoute);// use the category routes for /api/categories endpoints
app.use("/api/orders", orderRoute);// use the order routes for /api/orders endpoints


app.use("/api/carts", cartRoute);

app.use("/api/profile", profileRoute);
export default app;